import { TextBasedChannel } from "discord.js";

export async function safeSend(
  channel: TextBasedChannel,
  content: string
): Promise<void> {
  if ("send" in channel && typeof channel.send === "function") {
    await channel.send(content);
  } else {
    console.warn("Canal não suporta .send");
  }
}
