import { Collection, Message } from "discord.js";

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

  if ("send" in message.channel) {
    await message.channel.send(
      `${mentionedUser}, você aceita se casar com ${message.author}? 💍\nResponda com **sim** ou **não**.`
    );
  } else {
    console.log("Canal não suporta enviar mensagem");
  }

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

      if ("send" in message.channel) {
        await message.channel.send(
          `🎉 Parabéns ${message.author} e ${mentionedUser}, vocês agora estão casados! 💖`
        );
      } else {
        console.log("Canal não suporta enviar mensagem");
      }
    } else {
      if ("send" in message.channel) {
        await message.channel.send(
          `😢 Que pena, ${message.author}, ${mentionedUser} recusou o pedido.`
        );
      } else {
        console.log("Canal não suporta enviar mensagem");
      }
    }
  });

  collector.on("end", async (collected: Collection<string, Message>) => {
    if (collected.size === 0) {
      if ("send" in message.channel) {
        message.channel.send(
          "⏰ Tempo esgotado! O pedido de casamento expirou."
        );
      }
    }
  });
}
