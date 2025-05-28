import { Message } from "discord.js";
import { safeSend } from "../utils/safeSend";

type RoletaState = {
  balas: number[];
};

const mortesEngracadas = [
  "💀 Bang! Você foi eliminado, {user}. RIP!",
  "☠️ Tentou a sorte, {user}... e perdeu!",
  "🔫 O tambor girou e... adeus, {user}.",
  "😵 A bala te encontrou, {user}. F.",
  "🧟 {user}, você virou um zumbi.",
];

const sobreviventeEngracado = [
  "😌 Ufa, {user}! Você sobreviveu dessa vez.",
  "🛡️ A bala passou raspando, {user}.",
  "🎯 E nada aconteceu com você, {user}!",
  "😎 Indestrutível, hein {user}?",
  "🚫 Nenhum tiro hoje, {user}. Está com sorte!",
];

let roletaState: RoletaState = {
  balas: [],
};

function iniciarRoleta() {
  const posicoes = [false, false, false, false, false, false];
  const balaIndex = Math.floor(Math.random() * 6);
  posicoes[balaIndex] = true;

  roletaState.balas = posicoes.map((temBala) => (temBala ? 1 : 0));
  console.log("[Roleta Reiniciada] Posição da bala:", balaIndex + 1);
}

export const roleta = async (message: Message) => {
  if (roletaState.balas.length === 0) iniciarRoleta();

  const bala = roletaState.balas.shift();

  const username = `<@${message.author.id}>`;
  let resposta;

  if (bala === 1) {
    resposta = mortesEngracadas[
      Math.floor(Math.random() * mortesEngracadas.length)
    ].replace("{user}", username);
    iniciarRoleta();
  } else {
    resposta = sobreviventeEngracado[
      Math.floor(Math.random() * sobreviventeEngracado.length)
    ].replace("{user}", username);
  }

  await safeSend(message.channel, resposta);
};
