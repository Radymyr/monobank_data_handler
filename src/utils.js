import { bot, html } from './initialized.js';

export function getCurrencyName(currencyCode) {
  const currencies = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
    643: 'RUB',
  };

  return currencies[currencyCode] || 'Unknown currency';
}

export function getDate(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toUTCString();
}

export function getAmount(amount) {
  return amount / 100;
}

export async function sendToTelegram(request, reply) {
  const chatId = request.params.id;
  const messageBody = request.body;
  const {
    time,
    description,
    amount,
    currencyCode,
    commissionRate,
    cashbackAmount,
    balance,
    hold,
  } = messageBody.data.statementItem;

  console.log(messageBody);

  if (chatId && messageBody) {
    await bot.telegram.sendMessage(chatId, JSON.stringify(currencyCode));
  }

  reply.status(200).send(`POST request successful with id: ${chatId}`);
}

export function checkWebhook(request, reply) {
  const chatId = request.params.id;
  reply.status(200).send(`GET request successful with id: ${chatId}`);
}

export function showHtml(request, reply) {
  reply.status(200).type('text/html').send(html);
}

export function validateToken(token) {
  const tokenRegex = /^[a-zA-Z0-9_-]{40,50}$/;

  return tokenRegex.test(token);
}
