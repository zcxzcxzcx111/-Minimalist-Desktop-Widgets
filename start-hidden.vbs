Set WshShell = CreateObject("WScript.Shell")
' Set working directory to the project folder
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
' Run the app cleanly in hidden window mode (0 = hide cmd window)
WshShell.Run "npm.cmd run start", 0, False
