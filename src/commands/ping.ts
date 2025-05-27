import { Message } from "discord.js";

export const ping = (message: Message) => {
  message.reply("Pong!");
};
