## Install

Run `npm install` and `npm run package`.
This will create a Folder `Tidal-linux-x64`, which contains the packaged application.

## .desktop file
```
[Desktop Entry]
Name=Tidal
Exec=PATH_TO_CLONED_DIRECTORY/Tidal-linux-x64/tidal
Icon=PATH_TO_CLONED_DIRECTORY/assets/tidal-icon.png
Type=Application
Categories=AudioVideo;
```
Put the above content inside a file called `tidal.desktop` in `/usr/share/applications/`
