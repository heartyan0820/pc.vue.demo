# ecmweb

与 `src/`（app1）平级的**独立 Vite + Vue3** 项目，复用同一套 Tauri 桌面端打包（`src-tauri/`）。

## 独立运行（不开 Tauri 窗口）

```bash
pnpm -C ecmweb dev      # http://localhost:5174
pnpm -C ecmweb build    # 产物：ecmweb/dist/
```

## Tauri 桌面端打包

通过独立的 Tauri 配置文件切换前端项目，无需修改 `src-tauri/tauri.conf.json`：

```bash
# app1（src/，原项目）
pnpm tauri:dev:app1
pnpm tauri:build:app1

# ecmweb（本目录）
pnpm tauri:dev:ecmweb
pnpm tauri:build:ecmweb
```

底层差异（自动处理，不用手动改）：

| 项目 | 端口 | 产物目录 | Tauri 配置 |
| --- | --- | --- | --- |
| app1 | 5173 | `dist/` | `src-tauri/tauri.conf.json` |
| ecmweb | 5174 | `ecmweb/dist/` | `src-tauri/tauri.ecmweb.conf.json` |
