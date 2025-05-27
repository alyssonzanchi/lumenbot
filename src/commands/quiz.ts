import { Message, TextChannel, DMChannel, NewsChannel } from "discord.js";

interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const quizStates = new Map<string, string>();
const lastQuestions = new Map<string, string>(); // Evita repetir pergunta

export default async function quiz(message: Message) {
  try {
    const res = await fetch(
      "https://tryvia.ptr.red/api.php?amount=1&category=9&type=multiple&difficulty=easy"
    );
    const json = await res.json();
    const data = json.results[0] as QuizQuestion;

        // Evita repetir a mesma pergunta
    const previous = lastQuestions.get(message.author.id);
    if (previous === data.question) {
      return quiz(message); // Tenta buscar uma nova pergunta
    }
    lastQuestions.set(message.author.id, data.question);

    const answers = [...data.incorrect_answers, data.correct_answer];
    const shuffled = answers.sort(() => Math.random() - 0.5);

    const emojis = ["🇦", "🇧", "🇨", "🇩"];
    const letterMap = ["A", "B", "C", "D"];
    const answerMap = Object.fromEntries(
      shuffled.map((ans, i) => [letterMap[i], ans])
    );

    const correctLetter = letterMap[shuffled.indexOf(data.correct_answer)];
    quizStates.set(message.author.id, correctLetter);

    const questionText =
      `🧠 **Quiz Geek!**\n\n❓ ${decodeURIComponent(data.question)}\n\n` +
      shuffled
        .map((ans, i) => `**${letterMap[i]})** ${decodeURIComponent(ans)}`)
        .join("\n") +
      `\n\nResponda com A, B, C ou D`;

    if ("send" in message.channel) {
      await message.channel.send(questionText);
    }

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel ||
      message.channel instanceof NewsChannel
    ) {
      const collector = message.channel.createMessageCollector({
        filter: (m: Message) =>
          m.author.id === message.author.id &&
          ["A", "B", "C", "D"].includes(m.content.toUpperCase()),
        time: 15000,
        max: 1,
      });

      collector.on("collect", (m: Message) => {
        const userAnswer = m.content.toUpperCase();
        const correct = quizStates.get(m.author.id);

        if (userAnswer === correct) {
          m.reply("✅ Resposta correta! Parabéns!");
        } else {
          m.reply(`❌ Resposta errada. A correta era **${correct}**.`);
        }

        quizStates.delete(m.author.id);
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          message.reply("⏰ Tempo esgotado! Tente mais rápido da próxima vez!");
          quizStates.delete(message.author.id);
        }
      });
    } else {
      message.reply("⚠️ Esse comando deve ser usado em canais de texto ou DM.");
    }
  } catch (error) {
    console.error(error);
    message.reply("⚠️ Ocorreu um erro ao buscar a pergunta.");
  }
}
