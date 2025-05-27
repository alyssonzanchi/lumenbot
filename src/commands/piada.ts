import { Message } from "discord.js";

export const piada = async (message: Message) => {
  try {
    const res = await fetch(
      "https://us-central1-kivson.cloudfunctions.net/charada-aleatoria"
    );
    const data = await res.json();

    const joke = `${data.pergunta}\n${data.resposta}`;
    message.reply(joke);
  } catch (error) {
    console.error("Erro ao buscar piada:", error);
    message.reply(
      "Não consegui encontrar uma piada agora. Tente novamente em breve!"
    );
  }
};
