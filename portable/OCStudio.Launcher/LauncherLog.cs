using System;
using System.IO;
using System.Text;

namespace OCStudio.Launcher;

internal static class LauncherLog
{
    private static readonly object Gate = new();
    private static readonly string LogPath = Path.Combine(
        Environment.GetEnvironmentVariable("OC_STUDIO_LOG_DIR")
            ?? Path.GetTempPath(),
        "OCEditor-launcher.log");

    public static void Write(string message)
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(LogPath)!);
            lock (Gate)
            {
                File.AppendAllText(
                    LogPath,
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}{Environment.NewLine}",
                    Encoding.UTF8);
            }
        }
        catch
        {
            // Logging must never prevent startup.
        }
    }
}
