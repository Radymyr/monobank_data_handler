import { bot, html } from './initialized.js';
import { getMccDescription } from './mccCodes.js';

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
  return date.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAmount(amount) {
  return (amount / 100).toFixed(2);
}

export function formatText(fields) {
  const { id, time, description, mcc, amount, balance, commissionRate, hold } =
    fields;

  const mccIcons = {
    3000: '✈️',
    3301: '✈️',
    4511: '✈️',
    5309: '🛍️',
    4131: '🚌',
    5531: '🔧',
    5172: '⛽',
    5542: '⛽',
    5912: '💊',
    3501: '🏨',
    5945: '🧸',
    4111: '🚆',
    5811: '☕',
    5812: '🍽️',
    5814: '🍔',
    7832: '🎬',
    5992: '💐',
    5651: '👗',
    7512: '🚗',
    7216: '🧼',
    5722: '📺',
    5411: '🛒',
    4121: '🚖',
    default: '💳',
  };

  const mccDescription = getMccDescription(mcc);
  const categoryIcon = mccIcons[mcc] || mccIcons.default;

  const status = hold ? 'В очікуванні' : 'Завершено';

  const message = `
  *Транзакція № ${id}*
  *Дата і час*: ${getDate(time)}
  *Опис*: ${description}
  *Категорія (MCC)*: ${categoryIcon} ${mccDescription} (${mcc})
  *Сума*: ${getAmount(amount).toFixed(2)} грн
  *Баланс*: ||${getAmount(balance).toFixed(2)}|| грн
  *Комісія*: ${getAmount(commissionRate).toFixed(2)} грн
  *Статус*: ${status}
  
  ⚠️ Баланс нижче ||${getAmount(2000).toFixed(2)}|| грн\\.
  `.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1'); // Экранирование всех специальных символов Markdown

  return message;
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

export async function sendToTelegram(request, reply) {
  const chatId = request.params.id;
  const messageBody = request.body;

  const monobankResponse = formatText(messageBody.data.statementItem);

  console.log(monobankResponse);

  if (chatId && messageBody) {
    await bot.telegram.sendMessage(chatId, monobankResponse, {
      parse_mode: 'MarkdownV2',
    });
  }

  reply.status(200).send(`POST request successful with id: ${chatId}`);
}
