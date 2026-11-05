using System;
using System.IO;
using System.Text;

namespace OCEditor.Launcher;

internal static class LauncherLog
{
    private static readonly object Gate = new();
    private static readonly string LogPath = Path.Combine(
        Environment.GetEnvironmentVariable("OC_EDITOR_LOG_DIR")
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
