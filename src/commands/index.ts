import { Message } from "discord.js";
import { piada } from "./piada";
import { ping } from "./ping";

export const commands: Record<string, (msg: Message) => void | Promise<void>> =
  {
    "!piada": piada,
    "!ping": ping,
  };
