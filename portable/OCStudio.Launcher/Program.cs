using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace OCStudio.Launcher;

internal static class Program
{
    private const string SingleInstanceName = @"Local\OCStudio.SingleInstance";
    private const int SwRestore = 9;

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern IntPtr FindWindow(string? lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [STAThread]
    private static void Main()
    {
        LauncherLog.Write($"launcher starting; os={Environment.OSVersion.VersionString}");

        // Windows 10 1809 (build 17763) 是 WebView2 与 PerMonitorV2 DPI 的稳妥基线。
        if (!OperatingSystem.IsWindowsVersionAtLeast(10, 0, 17763))
        {
            MessageBox.Show(
                "OC Studio 需要 64 位 Windows 10（1809 或更高版本）。\n\n" +
                "当前系统版本过低，请先升级 Windows 再运行。",
                "OC Studio",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);
            return;
        }

        // 同一时间只允许一个实例：WebView2 的用户数据目录不能被两个进程同时占用。
        using var instanceMutex = new Mutex(
            initiallyOwned: true,
            SingleInstanceName,
            out var createdNew);
        if (!createdNew)
        {
            var existing = FindWindow(null, "OC Studio");
            if (existing != IntPtr.Zero)
            {
                ShowWindow(existing, SwRestore);
                SetForegroundWindow(existing);
            }
            else
            {
                MessageBox.Show(
                    "OC Studio 已经在运行，请查看任务栏或已打开的窗口。",
                    "OC Studio",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
            }
            return;
        }

        AppDomain.CurrentDomain.UnhandledException += (_, args) =>
            LauncherLog.Write($"unhandled: {args.ExceptionObject}");
        Application.ThreadException += (_, args) =>
            LauncherLog.Write($"thread exception: {args.Exception}");
        try
        {
            Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
            LauncherLog.Write("launcher exited normally");
        }
        catch (Exception ex)
        {
            LauncherLog.Write($"fatal: {ex}");
            throw;
        }
    }
}
