import { IActivity, IUserSettings } from "@uncool/shared";
import { Inject, Injectable } from "@nestjs/common";
import { SettingsService } from "../controllers/settings/settings.service";


@Injectable()
export class TelegramService {

  constructor(@Inject('TELEGRAM_BOT') protected bot, protected settingsService: SettingsService){
    this.sendActivityNotification = this.sendActivityNotification.bind(this);
  }

  async sendActivityNotification(activity: IActivity){
    const userSettings = await this.settingsService.findByUserId(activity.userId) as unknown as IUserSettings;
    if(!userSettings.telegramChatId) return;

    await this.bot.sendMessage(
      userSettings.telegramChatId,
      `<b>${activity.type} - ${activity.title}</b> / <em>${activity.description??''}</em>`,
      {parse_mode: "HTML"}
    );
  }

}
