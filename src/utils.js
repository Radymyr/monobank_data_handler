import { bot, html } from './initialized.js';
import { getMccDescription } from './mccCodes.js';

// Функция для отображения валюты
export function getCurrencyName(currencyCode) {
  const currencies = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
    643: 'RUB',
  };
  return currencies[currencyCode] || 'Unknown currency';
}

// Функция для форматирования даты
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

// Функция для форматирования суммы
export function getAmount(amount) {
  return (amount / 100).toFixed(2); // Преобразуем копейки в гривны
}

// Функция для форматирования транзакции
export function formatText(fields) {
  const {
    id,
    time,
    description,
    mcc,
    amount,
    balance,
    commissionRate, // Это комиссия в копейках
    hold,
  } = fields;

  // Определяем категорию и смайлики
  const mccIcons = {
    5411: '🛒', // Супермаркети
    4829: '🚗', // Транспорт
    5812: '🍽️', // Ресторани та кафе
    5541: '⛽', // АЗС
    4900: '💡', // Комунальні послуги
    default: '💳', // Для всех остальных категорий
  };

  const mccDescription = getMccDescription(mcc);
  const categoryIcon = mccIcons[mcc] || mccIcons.default;

  // Статус транзакции
  const status = hold ? 'В очікуванні' : 'Завершено';

  // Форматирование сообщения
  return `
**Транзакція № ${id}**
Дата і час: ${getDate(time)}
Опис: ${description}
Категорія (MCC): ${categoryIcon} ${mccDescription} (${mcc})
Сума: ${getAmount(amount)} грн
Баланс: ${getAmount(balance)} грн
Комісія: ${getAmount(commissionRate)} грн
Статус: ${status}
${balance < 200000 ? '\n⚠️ Баланс нижче 2000 грн.' : ''}
  `;
}

// Обработка GET-запроса
export function checkWebhook(request, reply) {
  const chatId = request.params.id;
  reply.status(200).send(`GET request successful with id: ${chatId}`);
}

// Показ HTML-страницы
export function showHtml(request, reply) {
  reply.status(200).type('text/html').send(html);
}

// Валидация токена
export function validateToken(token) {
  const tokenRegex = /^[a-zA-Z0-9_-]{40,50}$/;
  return tokenRegex.test(token);
}

// Отправка сообщения в Telegram
export async function sendToTelegram(request, reply) {
  const chatId = request.params.id;
  const messageBody = request.body;

  // Форматируем сообщение
  const monobankResponse = formatText(messageBody.data.statementItem);

  console.log(monobankResponse);

  if (chatId && messageBody) {
    await bot.telegram.sendMessage(chatId, monobankResponse, {
      parse_mode: 'Markdown',
    });
  }

  reply.status(200).send(`POST request successful with id: ${chatId}`);
}
