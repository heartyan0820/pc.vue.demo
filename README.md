# PC Vue Demo

基于 Vue 3、Vite 和 Tauri 2，支持 Windows 桌面、Android 与 iOS 打包。

## 安装与桌面运行

```sh
pnpm install
pnpm tauri dev
```

Windows 桌面打包：

```sh
pnpm tauri build
```

默认生成 MSI 和 NSIS 安装包，产物位于 `src-tauri/target/release/bundle/`。首次打包需要联网下载 Windows 安装器工具。

## Android

安装 Android Studio，并在 SDK Manager 中安装 Android SDK、Platform-Tools、Build-Tools 和 NDK。配置 `JAVA_HOME`、`ANDROID_HOME`、`NDK_HOME`，并确保 Android SDK Command-line Tools 可用。首次在项目根目录初始化：

```sh
pnpm tauri android init
```

连接 Android 设备或启动模拟器后运行调试：

```sh
pnpm android:dev
```

生成 Android 包：

```sh
pnpm android:build
```

Android APK 使用 `src-tauri/tauri.android.conf.json` 指向 GitHub Pages 线上页面。首次启用此配置后，需要手动构建并安装一次 APK；此后推送 Vue 页面改动只会更新 Pages，已安装 App 在联网重新打开页面后即可加载新版本，不需要每次重新打包 APK。桌面版仍使用 APK/桌面包内的本地前端资源。

GitHub Actions 只会在手动运行 `Build Android APK` workflow 时构建 arm64 APK。完成后到仓库的 Actions 运行记录页面，在 Artifacts 区域下载 `pc-vue-demo-android-arm64`。

若需要后续版本覆盖安装，建议在仓库 Settings → Secrets and variables → Actions 配置固定签名密钥：`ANDROID_KEYSTORE_BASE64`（keystore 文件的 Base64 内容）、`ANDROID_KEY_ALIAS`、`ANDROID_KEY_PASSWORD` 和 `ANDROID_STORE_PASSWORD`。未配置时 workflow 会生成临时签名密钥，APK 可安装，但不适合跨构建升级。

## iOS

iOS 开发和打包必须在 macOS 上安装 Xcode 后执行。首次初始化及后续命令：

```sh
pnpm tauri ios init
pnpm ios:dev
pnpm ios:build
```

此 Android workflow 每次运行都会在 runner 上初始化临时 Android 工程，因此不依赖仓库内的 `src-tauri/gen/android`。如果本地需要维护原生 Android 工程或自定义原生代码，应将对应改动纳入版本控制，并相应调整 workflow，避免初始化时覆盖这些改动。
