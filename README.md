# ASCII Life OS (ALO)

[![Release](https://img.shields.io/github/v/release/maverickgao8848/matrix-life-os)](https://github.com/maverickgao8848/matrix-life-os/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)]()
[![License](https://img.shields.io/github/license/maverickgao8848/matrix-life-os)](LICENSE)
<img width="2723" height="1460" alt="image" src="https://github.com/user-attachments/assets/d01b7cae-9011-49b7-9912-351117f597e8" />
<img width="2587" height="1505" alt="image" src="https://github.com/user-attachments/assets/60664ef6-87a8-4636-8f54-0febf8f4dcec" />


> **你的人生，值得一款操作系统。**
>
> 把混沌的日常拆成可量化的行动，像玩 RPG 一样训练自己，用一套本地-first 的工具把「想做的事」真正推进到「已完成」。

ALO 不是又一个 Todo App。它是一座**数字抄写室（Scriptorium）**——没有圆角、没有阴影、没有算法推荐，只有深墨色的寂静、ASCII 线条的几何祈祷，和偶尔一点金箔般的强调，提醒使用者：即使在最深的黑暗中，专注本身就会发光。

---

<img width="2705" height="1515" alt="action-desk" src="https://github.com/user-attachments/assets/8e2737e1-f882-468d-9718-47ae7b36710f" />

*行动台：捕捉、支撑与执行交汇之处，所有决策在一屏内完成。*

<img width="2671" height="1333" alt="review-archive" src="https://github.com/user-attachments/assets/d605bbef-f7ae-4104-a727-f2ac7ceed177" />

*回顾档案：反思、能力雷达与光荣榜，保存真正有价值的结果。*

---

## 设计理念

### 1. 大脑是 CPU，不是硬盘

人类的工作记忆只有 `4±1` 个槽位。ALO 只做一件事：**帮你把大脑缓存清掉**，让思考回归思考，让系统负责记账。

### 2. 三页即全部

任何需要超过三次点击的功能都会沦为数字废墟。ALO 只有三个页面：

```
[ 行动台 ]  [ 回顾档案 ]  [ 系统 ]
```

ALO 把 GTD 抽象成四个阶段，每个模块只属于自己的阶段：

- **捕捉**：快速收集箱、灵感仓库。任何念头先丢进来，不判断、不排序。
- **支撑**：原则、日历、习惯、心情、娱乐。它们不直接产生行动，但决定行动的质量和可持续性。
- **执行**：周看板、OKR、时间块。唯一产生「完成」的地方。
- **洞察**：反思、能力雷达、光荣榜。复盘、校准、纪念。

行动台承载「捕捉 / 支撑 / 执行」，回顾档案承载「洞察」，系统则负责低频配置与数据安全。

### 3. 过程轻，结果重

ALO 是个有点洁癖的管家：

- **不囤积垃圾**：普通任务勾选完成后不保留，每周一自动清扫。
- **珍藏勋章**：完成的 Objective（值得花一个下午的大事）和每一篇反思，会被永久存档。

**它不在乎你有多忙，只在乎你有没有做成事，以及做完之后有没有长脑子。**

### 4. 单向行动流

跨模块拖拽遵循严格的四阶段流向，不做 Notion 式任意互通：

```
捕捉（收集箱 / 灵感）
        ↓ clarify
支撑（原则 / 日历 / 习惯 / 心情 / 娱乐）
        ↓ arrange
执行（周看板 / OKR / 时间块 / 日历）
        ↓ complete
洞察（反思 / 能力雷达 / 光荣榜）
```

> 值得做的东西，可以被安排到某天；原处保留，安排处执行。

### 5. 模块可裁剪

每个人的成长阶段不同。ALO 的核心模块永远开启，可选模块（习惯、心情、时间块、灵感仓库）可在系统页自由开关。**系统应该像乐高一样随你组装，而不是像企业软件一样强迫你用完所有功能。**

### 6. 本地优先，无账号，无云

所有数据以 JSON 形式保存在你的电脑里：

- **Windows**: `%APPDATA%/ASCII Life OS/`
- **macOS**: `~/Library/Application Support/ASCII Life OS/`

支持一键导出/导入 JSON 备份。你的数据不属于任何服务器。

---

## 功能地图

| GTD 阶段 | 模块 | 作用 |
|---|---|---|
| **捕捉** | 快速收集箱 | 任何念头先丢进来，不判断、不排序 |
| **捕捉** | 灵感仓库 | 想法的冷宫，可一键安排到周看板 |
| **支撑** | 我的原则 | 人生免责声明，迷茫时的锚定 |
| **支撑** | 迷你日历 | 时间坟场，标记反思 / O 完成 / 习惯 |
| **支撑** | 习惯追踪 | 重复性自欺欺人记录，但坚持就是复利 |
| **支撑** | 心情记录 | 每日内心天气谎报 |
| **支撑** | 娱乐安排 | 合法摆烂时段，平衡奋斗与放松 |
| **执行** | 周看板 | 7 天任务看板，今日列高亮，拖拽排序/跨天 |
| **执行** | OKR 拆解 | 把大梦切成小片，KR 可直接安排到看板 |
| **执行** | 时间块 | 把一天切成碎片，守住专注边界 |
| **洞察** | 能力雷达 | 自欺欺人全景图，可视化长板与盲区 |
| **洞察** | 能力训练 | 针对弱项制定训练计划，子任务自动进入执行区 |
| **洞察** | 反思档案 | 黑历史档案馆，支持自定义问题模板 |
| **洞察** | 光荣榜 | 已完成 Objective 的墓碑陈列室 |
| **洞察** | 数据备份 | 罪证封存处，一键导出/导入 JSON |

---

## 下载安装

| 平台 | 下载 | 说明 |
|------|------|------|
| **Windows** | [Releases](https://github.com/maverickgao8848/matrix-life-os/releases) 下载 `.exe` | 便携版，双击即用，无需安装 |
| **macOS** | [Releases](https://github.com/maverickgao8848/matrix-life-os/releases) 下载 `.dmg` | 拖拽到「应用程序」文件夹即可 |

> **macOS 用户注意**：当前版本未进行 Apple 开发者签名，首次打开时可能会看到「无法验证开发者」提示。请前往 **系统设置 → 隐私与安全性** → 找到 ALO → 点击 **「仍要打开」**。或在终端执行：
> ```bash
> xattr -cr /Applications/ASCII\ Life\ OS.app
> ```

---

## 快速上手

### 早上：清空收集箱

1. 打开 **行动台**，先看「快速收集箱」。
2. 每条收集项点击 **[处理]**，决定它是垃圾、今日任务、OKR 还是灵感。
3. 把 OKR 里的 KR 拖到周看板对应日期。

### 白天：执行与勾选

- 周看板是唯一产生「完成」的地方。
- 未完成的任务会像幽灵一样跟着你：第二天自动出现在今天列顶部，并温柔地标记 `⤴ 来自昨日`。

### 晚上：反思与封存

1. 切换到 **回顾档案**，填写「今日反思」。
2. 看看能力雷达，确认今天又变强了 0.1%。
3. 完成的 Objective 会自动进入「光荣榜」，低谷时可以回来充电。

---

## 视觉风格

- **艺术指导**：The Monastic Terminal（修道院终端）
- **字体**：JetBrains Mono 等宽字体全家桶
- **配色**：深色模式为主，抄写室羊皮纸浅色模式为辅
- **边框**：ASCII 线条字符 `┌─┐│└┘`
- **按钮**：ASCII 方括号包裹，如 `[保存]` `[编辑]` `[删除]`
- **强调色**：极度克制的金箔 `#b8954a`

拒绝圆角、拒绝阴影、拒绝一切数字时代的视觉噪音。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Zustand + persist 中间件 |
| 样式方案 | CSS Variables（深色 / 浅色双主题） |
| 桌面端 | Electron + electron-builder |
| 拖拽交互 | @dnd-kit |

---

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/maverickgao8848/matrix-life-os.git
cd matrix-life-os/matrix-app

# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 构建前端资源
npm run build

# 本地打包 Electron 应用
npm run electron:build
```

---

## 项目结构

```
matrix-app/
├── build/              # 应用图标（electron-builder 自动生成 .ico / .icns）
├── electron/           # Electron 主进程
│   ├── main.cjs        # 主进程入口：原子写 + .bak 备份
│   └── preload.cjs     # 预加载脚本
├── public/             # 静态资源
├── src/
│   ├── components/     # 通用组件（AsciiBox、AsciiButton、DraggablePanel…）
│   ├── copy/           # 全局文案（alo-copy、system-copy、titles-copy、monkQuotes）
│   ├── features/       # 按功能域组织的模块
│   ├── hooks/          # 自定义 Hooks（useDayMigration、useObjectiveAutoArchive…）
│   ├── pages/          # 三页：ActionDesk / ReviewArchive / System
│   ├── store/          # Zustand Store（按 slice 拆分）
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数与数据迁移
├── .github/workflows/  # CI/CD 自动化发布
└── ...
```

---

## 数据安全

- 主数据文件使用**原子写**（temp + rename）+ `.bak` 备份。
- 版本升级时自动执行数据迁移，迁移前保留旧数据副本。
- 若反序列化失败，自动从 `.bak` 恢复。
- 建议定期通过应用内「数据备份」导出 JSON 到安全位置。

---

详细设计文档见 [`docs/alo/`](docs/alo/)。

---

## 开源协议

[MIT](LICENSE)

> *在黑暗中，金箔是最谦卑的荣耀。*
