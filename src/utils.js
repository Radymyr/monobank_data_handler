'use strict';

import { bot } from './initialized.js';
import { getMccDescription } from './mccDescriptions.js';

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

export function getCurrencyName(currencyCode) {
  const currencies = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
    643: 'RUB',
  };
  return currencies[currencyCode] || 'Unknown currency';
}

export function getAmount(amount) {
  return (amount / 100).toFixed(2);
}

export function formatTransactionMessage(fields) {
  const { id, time, description, mcc, amount, balance, commissionRate, hold } =
    fields;

  const date = getDate(time);

  const mccIcons = {
    5411: '🛒',
    4829: '🚗',
    5812: '🍽️',
    5541: '⛽',
    4900: '💡',
    default: '💳',
  };

  const mccDescription = getMccDescription(mcc);
  const categoryIcon = mccIcons[mcc] || mccIcons.default;

  const status = hold ? 'В очікуванні' : 'Завершено';

  return `
**Транзакція № ${id}**
Дата і час: ${date}
Опис: ${description}
Категорія (MCC): ${categoryIcon} ${mccDescription} (${mcc})
Сума: ${getAmount(amount)} грн
Баланс: ${getAmount(balance)} грн
Комісія: ${getAmount(commissionRate)} грн
Статус: ${status}
${
  balance < 200000
    ? '\n⚠️ Баланс нижче 2000 грн, рекомендується поповнити рахунок.'
    : ''
}
  `;
}

export async function sendToTelegram(request, reply) {
  const chatId = request.params.id;
  const messageBody = request.body;

  const monobankResponse = formatTransactionMessage(
    messageBody.data.statementItem
  );

  console.log(monobankResponse);

  if (chatId && messageBody) {
    await bot.telegram.sendMessage(chatId, monobankResponse, {
      parse_mode: 'Markdown',
    });
  }

  reply.status(200).send(`POST request successful with id: ${chatId}`);
}
