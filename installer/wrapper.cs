using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        try
        {
            var dir = Path.Combine(Path.GetTempPath(), "OCEditorSetup");
            Directory.CreateDirectory(dir);
            var msi = Path.Combine(dir, "OCEditor-Setup.msi");
            using (var input = Assembly.GetExecutingAssembly().GetManifestResourceStream("OCEditorSetup.msi"))
            {
                if (input == null) throw new InvalidOperationException("安装包资源缺失。");
                using (var output = File.Create(msi)) input.CopyTo(output);
            }

            var info = new ProcessStartInfo
            {
                FileName = "msiexec.exe",
                Arguments = "/i \"" + msi + "\" REBOOT=ReallySuppress",
                UseShellExecute = true,
            };
            var process = Process.Start(info);
            if (process != null) process.WaitForExit();
        }
        catch (Exception ex)
        {
            MessageBox.Show("安装程序启动失败：\n" + ex.Message, "OC editor", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
