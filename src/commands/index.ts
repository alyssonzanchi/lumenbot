import { CommandHandler } from "../types/CommandHandler";
import casar from "./casamento";
import { piada } from "./piada";
import { ping } from "./ping";
import quiz from "./quiz";
import { roleta } from "./roleta";

export const commands: Record<string, CommandHandler> = {
  "!piada": piada,
  "!ping": ping,
  "!roleta": roleta,
  "!quiz": quiz,
  "!casar": casar
};
