# AzureFinalChallenge
Application for Mate's final Azure challenge for detecting fish.

GUI interface is located in the fishui folder and can be packaged into System specific
executables using the electron-package system.

To generate the application:
```
cd fishui
npm install
npx electron-packager . --platform=<platform> --arch=<arch>
```

For more information on packaging go [here](https://github.com/electron/electron-packager)
