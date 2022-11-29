require('dotenv').config();
import * as TelegramBot from 'node-telegram-bot-api';

import { init } from './bot';
import { BotService } from './services/bot.service';

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

export function initBot() {
  const botService = new BotService(
    bot,
  );
  init(bot, botService);

  return bot;
}
