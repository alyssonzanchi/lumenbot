import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands";

config();

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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cmd = message.content.split(" ")[0];
  const command = commands[cmd];

  if (command) {
    await command(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
