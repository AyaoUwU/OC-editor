# OC editor 隐私政策

最后更新：2026-11-03

OC editor（微软商店名称：OC editor；包标识：nekibud.OCeditor）是一个本地优先的原创角色与世界观创作桌面应用。本政策说明应用会访问哪些数据、数据保存在哪里，以及我们如何处理这些数据。

## 1. 应用会访问的数据

为了提供创作功能，应用会访问你主动录入或选择的内容，包括：

- 角色、事件、国家、武器、宠物、世界观词条、关系、时间线和地图参数；
- 你为角色、事件、国家等选择的照片、头像、头图和 OC 动画；
- 你的应用设置、备份文件和导出文件。

这些内容由你创建或选择，应用不会在后台扫描你的其他文件。

## 2. 数据保存在哪里

- 角色、事件、国家、词条、标签、关系、地图参数等：保存在本机 WebView2/IndexedDB 数据目录。
- 图片和动画：保存在本机应用数据目录，路径为 %LOCALAPPDATA%\OC Studio。
- 备份：仅保存到你主动选择的导出位置。
- 应用不提供账号系统、云同步或服务器端存储。

## 3. 不收集、不上传、不共享

- 应用不收集姓名、电话号码、生物识别信息、位置、联系人、录音、通信内容等个人信息。
- 应用不包含遥测、分析埋点、广告、崩溃上报或自动更新。
- 应用运行时不向外部服务器发送你的创作数据。
- 我们不会出售、出租或共享你的创作数据。
- 应用使用 Microsoft Edge WebView2 运行时显示界面；WebView2 是微软组件，其自身可能按微软隐私政策处理诊断数据，但 OC editor 不会通过它上传你的创作内容。

## 4. 你的控制权

- 你可以在应用内编辑、删除或从回收站清理内容。
- 你可以随时导出 JSON/ZIP 备份。
- 卸载应用不会自动删除 %LOCALAPPDATA%\OC Studio；如需彻底删除本机数据，请在退出应用后手动删除该文件夹。
- 删除应用或数据不需要联系开发者。

## 5. 儿童隐私

OC editor 不是面向 13 岁以下儿童的产品，我们不会有意收集儿童的个人信息。由于应用不收集或上传个人信息，所有创作内容仅保存在你的设备上。

## 6. 政策更新

如果应用的数据处理方式发生变化，我们会更新本页面并修改“最后更新”日期。重大变化会通过项目仓库说明。

## 7. 联系方式

如对本政策有疑问，请通过以下公开页面联系我们：

https://github.com/nekibud/OC-editor/issues

---

## English summary

OC editor is a local-first desktop app. It accesses only the characters, images, animations, backups and settings that you create or select, and stores them locally under %LOCALAPPDATA%\OC Studio and the local WebView2 profile. It has no account system, cloud sync, telemetry, analytics, ads, crash reporting, or automatic updates, and it does not upload or share your creative data. You can delete content in the app or remove the local data folder after uninstalling. Contact: https://github.com/nekibud/OC-editor/issues