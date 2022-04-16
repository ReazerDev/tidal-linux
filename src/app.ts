import { app, components, BrowserWindow, Tray, Menu } from 'electron';
import settings, { set } from 'electron-settings';
import { DiscordIntegration } from './integrations/discord';
import { Tidal } from './tidal';

export const ICON_PATH: string = `${__dirname}/assets/tidal-icon.png`;

export class App {
  private mainWindow: BrowserWindow;
  private tray: Tray;
  private tidal: Tidal;

  public init() {
    if (!app.requestSingleInstanceLock()) {
      console.log('There is already an instance running! Quitting...');
      app.exit(0);
      return;
    }

    app.whenReady().then(async () => {
      await components.whenReady();
      this.createWindow();
      this.createTray();
      this.tidal = new Tidal(this.mainWindow);

      setTimeout(async () => {
        DiscordIntegration.init(this.tidal);
      }, 5000);
    });

    app.on('second-instance', () => {
      this.mainWindow.show();
    });
  }

  private createWindow() {
    const windowsState: Electron.Rectangle = <any>settings.getSync('windowState');
    this.mainWindow = new BrowserWindow({
      icon: ICON_PATH,
      ...windowsState,
      webPreferences: {
        devTools: false,
      }
    });
    this.mainWindow.loadURL('https://listen.tidal.com/');
    this.mainWindow.menuBarVisible = false;

    this.mainWindow.on('close', (event) => {
      event.preventDefault();

      settings.setSync('windowState', {
        ...this.mainWindow.getBounds()
      });

      this.mainWindow.hide();
    });
  }

  private createTray() {
    this.tray = new Tray(ICON_PATH);
    this.tray.setToolTip('Tidal');
    this.tray.on('click', this.toggleWindow.bind(this));

    const trayMenu = Menu.buildFromTemplate([
      {
        label: "TIDAL",
        click: () => this.toggleWindow(),
      },
      {
        label: "Actions",
        submenu: [
          {
            label: "Previous",
            click: () => this.tidal.previous(),
          },
          {
            label: "Play/Pause",
            click: () => this.tidal.togglePlay(),
          },
          {
            label: "Next",
            click: () => this.tidal.next(),
          }
        ]
      },
      {
        label: "Quit",
        click: () => this.exitApp(),
      }
    ]);

    this.tray.setContextMenu(trayMenu);
  }

  private toggleWindow() {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
    }
  }

  private exitApp() {
    if (this.mainWindow.isVisible()) {
      settings.setSync('windowState', {
        ...this.mainWindow.getBounds()
      });
    }

    app.exit(0);
  }
}
