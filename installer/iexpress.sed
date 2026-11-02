[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=1
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=dist\OC-Studio-Setup-0.18.1.exe
FriendlyName=OC Studio
AppLaunched=cmd /c msiexec.exe /i "%~dp0OC-Studio-Setup-0.18.1.msi"
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
FILE0="OC-Studio-Setup-0.18.1.msi"
[SourceFiles]
SourceFiles0=dist
[SourceFiles0]
%FILE0%=
