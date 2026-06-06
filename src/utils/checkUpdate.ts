/**
 * 检查更新工具
 * 优先使用 Shields 的 release badge JSON，避开 GitHub API 匿名限流；
 * GitHub API 作为备用源，并对成功结果做短期缓存。
 */

declare const __APP_VERSION__: string;

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.3.0';

export interface UpdateInfo {
  version: string;
  url: string;
  releaseNotes?: string;
}

export interface CheckUpdateResult {
  hasUpdate: boolean;
  latest?: UpdateInfo;
  checkedAt?: string;
  fromCache?: boolean;
  error?: string;
}

const GITHUB_API_URL =
  'https://api.github.com/repos/maverickgao8848/matrix-life-os/releases/latest';
const SHIELDS_RELEASE_URL =
  'https://img.shields.io/github/v/release/maverickgao8848/matrix-life-os.json';
const RELEASES_URL = 'https://github.com/maverickgao8848/matrix-life-os/releases';
const CACHE_KEY = 'alo:update-check:last-success';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

interface CachedUpdate {
  latest: UpdateInfo;
  checkedAt: string;
}

interface CheckUpdateOptions {
  fetcher?: typeof fetch;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  now?: () => number;
}

/**
 * 去除版本号前缀的 v/V
 */
function stripV(version: string): string {
  return version.trim().replace(/^v/i, '');
}

export async function checkUpdate(
  currentVersion: string,
  options: CheckUpdateOptions = {}
): Promise<CheckUpdateResult> {
  const fetcher = options.fetcher ?? fetch;
  const storage = options.storage ?? getLocalStorage();
  const now = options.now ?? Date.now;
  const cached = readCachedUpdate(storage);

  if (cached && now() - new Date(cached.checkedAt).getTime() < CACHE_TTL_MS) {
    return toResult(currentVersion, cached.latest, cached.checkedAt, true);
  }

  try {
    const latest = await fetchLatestVersion(fetcher);
    const checkedAt = new Date(now()).toISOString();
    writeCachedUpdate(storage, { latest, checkedAt });
    return toResult(currentVersion, latest, checkedAt, false);
  } catch (e) {
    if (cached) {
      return {
        ...toResult(currentVersion, cached.latest, cached.checkedAt, true),
        error: normalizeUpdateError(e),
      };
    }

    return {
      hasUpdate: false,
      latest: {
        version: stripV(currentVersion),
        url: RELEASES_URL,
      },
      error: normalizeUpdateError(e),
    };
  }
}

async function fetchLatestVersion(fetcher: typeof fetch): Promise<UpdateInfo> {
  const primaryError = await fetchFromShields(fetcher)
    .then((latest) => latest)
    .catch((e) => e);

  if (!(primaryError instanceof Error)) {
    return primaryError;
  }

  return fetchFromGitHub(fetcher).catch((e) => {
    throw new Error(`${primaryError.message}; ${normalizeUpdateError(e)}`);
  });
}

async function fetchFromShields(fetcher: typeof fetch): Promise<UpdateInfo> {
  const data = await fetchJson(fetcher, SHIELDS_RELEASE_URL, 5000);
  const rawVersion =
    typeof data.value === 'string'
      ? data.value
      : typeof data.message === 'string'
      ? data.message
      : '';
  const latestVersion = stripV(rawVersion);

  if (!latestVersion || latestVersion === 'none') {
    throw new Error('Shields 未返回有效版本号');
  }

  return {
    version: latestVersion,
    url: RELEASES_URL,
  };
}

async function fetchFromGitHub(fetcher: typeof fetch): Promise<UpdateInfo> {
  const data = await fetchJson(fetcher, GITHUB_API_URL, 8000, {
    Accept: 'application/vnd.github+json',
  });
  const tagName = typeof data.tag_name === 'string' ? data.tag_name : '';
  const latestVersion = stripV(tagName);
  const latestUrl =
    typeof data.html_url === 'string' && data.html_url
      ? data.html_url
      : `${RELEASES_URL}/tag/${tagName}`;
  const releaseNotes = typeof data.body === 'string' ? data.body : '';

  if (!latestVersion) {
    throw new Error('无法解析最新版本号');
  }

  return {
    version: latestVersion,
    url: latestUrl,
    releaseNotes,
  };
}

async function fetchJson(
  fetcher: typeof fetch,
  url: string,
  timeoutMs: number,
  headers?: HeadersInit
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetcher(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: unknown = await res.json();
    if (!data || typeof data !== 'object') {
      throw new Error('响应格式异常');
    }

    return data as Record<string, unknown>;
  } finally {
    clearTimeout(timeoutId);
  }
}

function toResult(
  currentVersion: string,
  latest: UpdateInfo,
  checkedAt: string,
  fromCache: boolean
): CheckUpdateResult {
  return {
    hasUpdate: compareVersion(latest.version, stripV(currentVersion)) > 0,
    latest,
    checkedAt,
    fromCache,
  };
}

function getLocalStorage(): Pick<Storage, 'getItem' | 'setItem'> | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

function readCachedUpdate(
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined
): CachedUpdate | undefined {
  if (!storage) return undefined;

  try {
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) return undefined;

    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return undefined;

    const cached = data as Partial<CachedUpdate>;
    if (
      !cached.latest ||
      typeof cached.latest.version !== 'string' ||
      typeof cached.latest.url !== 'string' ||
      typeof cached.checkedAt !== 'string'
    ) {
      return undefined;
    }

    return {
      latest: cached.latest,
      checkedAt: cached.checkedAt,
    };
  } catch {
    return undefined;
  }
}

function writeCachedUpdate(
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined,
  cached: CachedUpdate
): void {
  if (!storage) return;

  try {
    storage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // 缓存失败不影响更新检查本身。
  }
}

function normalizeUpdateError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return '检查超时，请稍后再试';
  }

  if (error instanceof Error) {
    if (error.message.includes('HTTP 403')) {
      return '更新源限流，请稍后再试';
    }
    if (error.message.includes('Failed to fetch')) {
      return '网络连接失败';
    }
    return error.message;
  }

  return '未知错误';
}

/**
 * 比较两个语义化版本号
 * @returns >0 表示 a 更新，<0 表示 b 更新，0 表示相同
 */
export function compareVersion(a: string, b: string): number {
  const pa = stripV(a).split('.').map((n) => parseInt(n, 10));
  const pb = stripV(b).split('.').map((n) => parseInt(n, 10));
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}
