/**
 * 检查更新工具
 * 从 GitHub API 拉取 latest release 并对比本地版本
 */

declare const __APP_VERSION__: string;

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.2.1';

export interface UpdateInfo {
  version: string;
  url: string;
  releaseNotes?: string;
}

const GITHUB_API_URL =
  'https://api.github.com/repos/buend/ascii-life-os/releases/latest';

/**
 * 去除版本号前缀的 v/V
 */
function stripV(version: string): string {
  return version.replace(/^v/i, '');
}

export async function checkUpdate(
  currentVersion: string
): Promise<{
  hasUpdate: boolean;
  latest?: UpdateInfo;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(GITHUB_API_URL, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const tagName: string = data.tag_name || '';
    const latestVersion = stripV(tagName);
    const latestUrl: string = data.html_url || `https://github.com/buend/ascii-life-os/releases/tag/${tagName}`;
    const releaseNotes: string = data.body || '';

    if (!latestVersion) {
      throw new Error('无法解析最新版本号');
    }

    const latest: UpdateInfo = {
      version: latestVersion,
      url: latestUrl,
      releaseNotes,
    };

    const hasUpdate = compareVersion(latestVersion, stripV(currentVersion)) > 0;

    return {
      hasUpdate,
      latest: hasUpdate ? latest : undefined,
    };
  } catch (e) {
    return {
      hasUpdate: false,
      error: e instanceof Error ? e.message : '未知错误',
    };
  }
}

/**
 * 比较两个语义化版本号
 * @returns >0 表示 a 更新，<0 表示 b 更新，0 表示相同
 */
export function compareVersion(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10));
  const pb = b.split('.').map((n) => parseInt(n, 10));
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}
