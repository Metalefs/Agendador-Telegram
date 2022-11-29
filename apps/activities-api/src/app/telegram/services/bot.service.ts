export class BotService {
  constructor(
    private bot,
  ) {
    this.bot.nextMessage = {};
    this.bot.onNextMessage = (chatId, callback) => {
      const promise = new Promise((resolve) => {
        this.bot.nextMessage[chatId] = { callback: callback, next: resolve };
      });
      return promise;
    };
  }

  start = async (msg, match) => {
    const [chatId] = [msg.chat.id];

    await this.bot.sendMessage(
      chatId,
      "Ola! Insira o identificador abaixo no <a href='https://mealprepscheduler.herokuapp.com/'>mealprepscheduler</a> para receber as notificações por aqui.",
      {parse_mode: "HTML"}
    );
    await this.bot
      .sendMessage(chatId, chatId)
  }

}
