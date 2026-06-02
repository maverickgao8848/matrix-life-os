# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.2.1] - 2026-06-02

### Added
- OKR 跨月份查看 — 支持 `<` / `>` 切换月份，历史 OKR 数据不再丢失
- 存储容量预警 — 数据超过 4MB 时控制台警告，超过 4.5MB 时顶部横幅提示导出清理
- 任务看板列宽记忆 — 新增 `taskColumnWidth` 配置，默认 260px
- 构建版本号自动注入 — `vite.config.ts` 读取 `package.json` version，更新检查更准确
- 反思模板默认数据 — 新用户首次打开自动加载「障碍突破」模板（5 个问题）

### Fixed
- 更新检测 404 — 移除对 `latest.json` 的依赖，改为直接调用 GitHub Releases API，解决"更新失败"误报
- 暗色模式对比度 — 提升文字色值亮度，修复伤眼问题（WCAG AA 合规）
- 任务能力值编辑 — 已有任务支持修改/补加/移除能力关联
- OKR→任务能力关联 — 收纳箱 KR 发送到看板前可选择能力+分值
- 2K 屏布局适配 — 任务看板与下方面板对齐

## [0.1.0] - 2025-05-31

### Added
- 周看板 (Dashboard) — 任务管理、能力雷达、数据备份、娱乐追踪、原则面板
- 反思库 (Reflection) — 月度计划、能力训练、反思记录与筛选
- 双主题支持 — 深色 / 浅色模式切换
- 数据持久化 — 自动保存到本地，支持导出/导入备份
- 跨平台发布 — Windows (.exe) + macOS (.dmg / .zip)
