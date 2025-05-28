import { Collection, Message } from "discord.js";
import { safeSend } from "../utils/safeSend";

const casais = new Map<string, string>();

export default async function casar(message: Message) {
  const mentionedUser = message.mentions.users.first();

  if (!mentionedUser) {
    return message.reply("👤 Você precisa mencionar um usuário para casar.");
  }

  if (mentionedUser.id === message.author.id) {
    return message.reply("❌ Você não pode casar consigo mesmo.");
  }

  if (casais.has(message.author.id) || casais.has(mentionedUser.id)) {
    return message.reply("💔 Um dos usuários já está em um relacionamento.");
  }

  await safeSend(
    message.channel,
    `${mentionedUser}, você aceita se casar com ${message.author}? 💍\nResponda com **sim** ou **não**.`
  );

  const filter = (m: Message) =>
    m.author.id === mentionedUser.id &&
    ["sim", "não", "nao"].includes(m.content.toLowerCase());

  const collector = (message.channel as any).createMessageCollector({
    filter,
    time: 30000,
    max: 1,
  });

  collector.on("collect", async (m: Message) => {
    const resposta = m.content.toLowerCase();
    if (resposta === "sim") {
      casais.set(message.author.id, mentionedUser.id);
      casais.set(mentionedUser.id, message.author.id);

      await safeSend(
        message.channel,
        `🎉 Parabéns ${message.author} e ${mentionedUser}, vocês agora estão casados! 💖`
      );
    } else {
      await safeSend(
        message.channel,
        `😢 Que pena, ${message.author}, ${mentionedUser} recusou o pedido.`
      );
    }
  });

  collector.on("end", async (collected: Collection<string, Message>) => {
    if (collected.size === 0) {
      await safeSend(
        message.channel,
        "⏰ Tempo esgotado! O pedido de casamento expirou."
      );
    }
  });
}
