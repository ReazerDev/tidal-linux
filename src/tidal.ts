import { BrowserWindow } from "electron";

export class Tidal {
  private mainWindow: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.mainWindow = window;
  }

  public play(): Promise<any> {
    return this.executeJS("document.querySelector('div[data-test=\"play-controls\"] button[data-type=\"button__pause\"]').click()");
  }

  public pause(): Promise<any> {
    return this.executeJS("document.querySelector('div[data-test=\"play-controls\"] button[data-type=\"button__play\"]').click()");
  }

  public async togglePlay(): Promise<any> {
    if (await this.isPlaying()) {
      return this.pause();
    }

    return this.play();
  }

  public next(): Promise<any> {
    return this.executeJS("document.querySelector('div[data-test=\"play-controls\"] button[data-type=\"button__skip-next\"]').click()");
  }

  public previous(): Promise<any> {
    return this.executeJS("document.querySelector('div[data-test=\"play-controls\"] button[data-type=\"button__skip-previous\"]').click()");
  }

  public async isPlaying(): Promise<boolean> {
    return this.executeJS("document.querySelector('button[data-type=\"button__pause\"]') === null").then(res => {
      return(res);
    });
  }

  public async getCurrentTitle(): Promise<string> {
    return await this.executeJS(`(document.querySelector('[data-test^="footer-track-title"] a') || document.querySelector('[data-test^="footer-track-title"] span')).innerText`);
  }

  public async getCurrentTitleUrl(): Promise<string> {
    return await this.executeJS(`document.querySelector('[data-test^="footer-track-title"] a').href`);
  }

  public async getCurrentAlbum(): Promise<string> {
    return await this.executeJS(`
      (document.querySelector('#footerPlayer a[href^="/album/"]') || document.querySelector('#footerPlayer a[href^="/playlist/"]') || document.querySelector('#footerPlayer a[href^="/mix/"]')).text
    `);
  }

  public async getCurrentCover(): Promise<string> {
    return await this.executeJS(`document.querySelector('[data-test="current-media-imagery"] img').src`);
  }

  public async getCurrentArtist(): Promise<string> {
    return await this.executeJS(`document.querySelector('#footerPlayer [data-test^="grid-item-detail-text-title-artist"]').text`);
  }

  public async getCurrentTime(): Promise<string> {
    return await this.executeJS(`document.querySelector('[data-test="current-time"]').textContent`);
  }

  public async getCurrentDuration(): Promise<string> {
    return await this.executeJS(`document.querySelector('[data-test="duration-time"]').textContent`);
  }

  private executeJS(command: string): Promise<any> {
    return this.mainWindow.webContents.executeJavaScript(command).then(res => {
      return res;
    }, error => {
      console.error(error);
    });
  }
}