import { CommandHandler } from "../types/CommandHandler";
import { piada } from "./piada";
import { ping } from "./ping";

export const commands: Record<string, CommandHandler> = {
  "!piada": piada,
  "!ping": ping,
};
