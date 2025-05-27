import { Message } from "discord.js";

export const piada = async (message: Message) => {
  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Any?lang=pt");
    const data = await res.json();

    if (data.error) {
      return message.reply(
        "Não consegui buscar uma piada agora. Tente novamente em breve!"
      );
    }

    let jokeText = "";

    if (data.type === "twopart") {
      jokeText = `${data.setup}\n${data.delivery}`;
    } else {
      jokeText = data.joke;
    }

    message.reply(jokeText);
  } catch (error) {
    console.error("Erro ao buscar piada:", error);
    message.reply("Erro ao tentar buscar uma piada. 😥");
  }
};
