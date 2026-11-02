# Windows 10 适配说明（0.18.1）

本次在原有 Windows 打包方案上做增量改进，没有替换原有技术路线。

## 参考的已有方案

- `portable/OCStudio.Launcher`：.NET WinForms + WebView2，自包含单文件发布。
- `installer/OCStudio.wxs`：WiX per-user MSI，安装到 `LocalAppData\Programs\OC Studio`。
- `installer/iexpress.sed`：IExpress 把 MSI 包成单文件 Setup EXE。
- 前端通过 `SetVirtualHostNameToFolderMapping` 映射 `wwwroot`，运行时仍然完全离线。

## 本次改进

1. **系统基线**
   - MSI 增加 `VersionNT64`、`VersionNT >= 1000`、`MsiNTProductType = 1` 启动条件。
   - 启动器再次检查 Windows 10 build 17763（1809），低于基线给出明确提示。
2. **单实例**
   - `Local\OCStudio.SingleInstance` 命名互斥量；重复启动时激活已有窗口，避免 WebView2 数据目录被两个进程同时占用。
3. **DPI / 长路径**
   - `app.manifest` 增加 PerMonitorV2 DPI 与 longPathAware；保留 `asInvoker`，不要求管理员权限。
4. **WebView2 诊断**
   - 缺少 Runtime：提示并可直接打开微软官方 Evergreen 下载页。
   - 数据目录被占用（0x800700AA）：提示关闭其他窗口/重启，而不是只显示异常堆栈。
   - 用户目录无权限：提示检查权限与磁盘空间。
5. **包体**
   - 启动器使用压缩单文件自包含发布（约 50 MB），MSI 总体约 46 MB；Win10 无需预装 .NET。
6. **版本**
   - 产品版本提升到 0.18.1，保留原 UpgradeCode，可自动升级 0.18.0。

## 验证

- `dotnet publish` 成功，生成的 EXE 版本为 0.18.1.0。
- WiX 构建成功；MSI 的 Template 为 `x64;2052`，LaunchCondition 表包含上述三条系统条件。
- 使用 `msiexec /a` 做管理安装解包验证：89 个文件完整解出，`OCStudio.exe` 版本 0.18.1.0，`wwwroot/index.html` 为最新前端。
- IExpress Setup EXE 内嵌最终 MSI（7-Zip 可列出 `OC-Studio-Setup-0.18.1.msi`）。
- 当前 DSH 沙箱会拦截 WebView2 的 CrashSender 子进程，因此无法在沙箱内完成可视化启动回归；在正常桌面会话中运行不受此限制。
