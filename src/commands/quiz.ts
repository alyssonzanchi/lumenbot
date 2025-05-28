import { Collection, Message } from "discord.js";
import quizData from "../data/quiz.json";

interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const quizStates = new Map<string, string>();

export default async function quiz(message: Message) {
  try {
    const data = quizData[
      Math.floor(Math.random() * quizData.length)
    ] as QuizQuestion;

    const answers = [...data.incorrect_answers, data.correct_answer];
    const shuffled = answers.sort(() => Math.random() - 0.5);

    const letterMap = ["A", "B", "C", "D"];

    const correctLetter = letterMap[shuffled.indexOf(data.correct_answer)];
    quizStates.set(message.author.id, correctLetter);

    const questionText =
      `🧠 **Quiz Geek!**\n\n❓ ${data.question}\n\n` +
      shuffled.map((ans, i) => `**${letterMap[i]})** ${ans}`).join("\n") +
      `\n\nResponda com A, B, C ou D`;

    if ("send" in message.channel) {
      await message.channel.send(questionText);
    }

    const filter = (m: Message) =>
      m.author.id === message.author.id &&
      ["A", "B", "C", "D"].includes(m.content.toUpperCase());

    const collector = (message.channel as any).createMessageCollector({
      filter,
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

    collector.on("end", (collected: Collection<string, Message>) => {
      if (collected.size === 0) {
        message.reply("⏰ Tempo esgotado! Tente mais rápido da próxima vez!");
        quizStates.delete(message.author.id);
      }
    });
  } catch (error) {
    console.error(error);
    message.reply("⚠️ Ocorreu um erro ao buscar a pergunta.");
  }
}
