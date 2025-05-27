import { Message } from "discord.js";

export type CommandHandler = (
  msg: Message
) => void | Promise<void> | Promise<any>;
