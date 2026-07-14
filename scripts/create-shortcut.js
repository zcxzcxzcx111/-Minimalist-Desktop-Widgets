const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\90823', 'Desktop');
// Using English filename MacWidgets.lnk to avoid any Windows CMD/VBScript codepage encoding issues
const shortcutPath = path.join(desktopPath, 'MacWidgets.lnk');
const targetPath = path.join(__dirname, '../start-hidden.vbs');
const workingDir = path.join(__dirname, '..');

// VBScript script to create the Windows shortcut file (.lnk)
const vbsContent = `
Set WshShell = CreateObject("WScript.Shell")
Set oShellLink = WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}")
oShellLink.TargetPath = "wscript.exe"
oShellLink.Arguments = """${targetPath.replace(/\\/g, '\\\\')}"""
oShellLink.WorkingDirectory = "${workingDir.replace(/\\/g, '\\\\')}"
oShellLink.Description = "Mac-style Desktop Widgets for Windows"
oShellLink.WindowStyle = 1
oShellLink.Save
`;

const tempVbsPath = path.join(__dirname, '_temp_make_shortcut.vbs');
try {
  fs.writeFileSync(tempVbsPath, vbsContent, 'latin1');
  execSync(`cscript //nologo "${tempVbsPath}"`);
  console.log('🎉 桌面快捷方式创建成功: ' + shortcutPath);
} catch (err) {
  console.error('❌ 创建快捷方式遇到错误: ', err);
} finally {
  if (fs.existsSync(tempVbsPath)) {
    fs.unlinkSync(tempVbsPath);
  }
}
