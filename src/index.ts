import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { ping } from "./commands/ping";
import { piada } from "./commands/piada";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    ping(message);
  }

  if (message.content.startsWith("!piada")) {
    piada(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
