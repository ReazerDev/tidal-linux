import { Tidal } from "../tidal";
import { Client, Presence } from 'discord-rpc';
import { secondsFromHMS } from "../helpers/time";
import { timeout } from "../helpers/timeout";

export class DiscordIntegration {
  private readonly ACTIVITY_ERROR_THRESHOLD: number = 5;
  private activityErrorCount: number = 0;

  private updateInterval: NodeJS.Timer;

  private tidal: Tidal;
  private discordRpc: Client;

  constructor(tidal: Tidal) {
    this.tidal = tidal;
  }

  public static init(tidal: Tidal) {
    new DiscordIntegration(tidal).init();
  }

  public async init() {
    this.discordRpc = new Client({ transport: 'ipc'});
    this.discordRpc.login({ clientId: '964255500524990526' }).catch((error) => {
      console.error(error);
      this.loginUnsuccessfull();
    });

    this.discordRpc.on('ready', () => {
      this.discordRpc.setActivity({
        details: `Browsing Tidal`,
        largeImageKey: "tidal-icon",
        largeImageText: `Tidal`,
        instance: false,
      });

      this.updateActivity();
    });
  }

  private async updateActivity() {
    this.discordRpc.setActivity(await this.gatherActivity());

    this.updateInterval = setInterval(async () => {
      timeout(this.discordRpc.setActivity(await this.gatherActivity()), 5000).then(() => {
        this.activityErrorCount = 0;
      }, () => {
        this.handleActivityError();
      });
    }, 10000);
  }

  private async gatherActivity(): Promise<Presence> {
    if (!await this.tidal.isPlaying()) {
      return {
        details: `Browsing Tidal`,
        largeImageKey: "tidal-icon",
        largeImageText: `Tidal`,
        instance: false,
      }
    }

    const base: Presence = {
      state: await this.tidal.getCurrentArtist(),
      startTimestamp: secondsFromHMS(await this.tidal.getCurrentTime()),
      endTimestamp: secondsFromHMS(await this.tidal.getCurrentDuration()),
      instance: false,
    }

    if (await this.tidal.getCurrentTitleUrl()) {
      return {
        ...base,
        details: `Listening to ${await this.tidal.getCurrentTitle()}`,
        largeImageKey: await this.tidal.getCurrentCover(),
        largeImageText: await this.tidal.getCurrentAlbum(),
        smallImageKey: 'tidal-icon',
        smallImageText: 'Tidal',
      };
    }

    return {
      ...base,
      details: `Watching ${await this.tidal.getCurrentTitle()}`,
      largeImageKey: "tidal-icon",
      largeImageText: `Tidal`,
    };
  }

  private loginUnsuccessfull() {
    setTimeout(() => {
      this.init();
    }, 30000);
  }

  private handleActivityError() {
    this.activityErrorCount++;

    if (this.activityErrorCount >= this.ACTIVITY_ERROR_THRESHOLD) {
      clearInterval(this.updateInterval);
      this.activityErrorCount = 0;

      this.loginUnsuccessfull();
    }
  }
}