import Fastify from 'fastify';
const app = Fastify({ logger: true });

import {
  webhookRegistrationUrl,
  monobankToken,
  monobankRoute,
  baseUrl,
  html,
  telegramRoute,
  telegramToken,
} from '../src/initialized.js';
import { makeMonobankWebhook } from './monobank.js';
import { makeTelegramWebhook } from './telegram.js';

app.get('/', async (request, reply) => {
  reply.status(200).type('text/html').send(html);
});

// app.get('/makeMonobankWebhook', async (request, reply) => {
//   const result = await makeMonobankWebhook(
//     webhookRegistrationUrl,
//     monobankToken,
//     baseUrl
//   );
//   const json = result.json();
//   reply.status(200).send(json);
// });

app.get('/makeTelegramWebhook', async (request, reply) => {
  const result = await makeTelegramWebhook();

  const json = result.json();
  reply.status(200).send(json);
});

app.post(telegramRoute, async (request, reply) => {
  const message = request.body.message;
  const chatId = message.chat.id;
  const tokenFromText = message.text.trim();
  let result = null;

  if (
    typeof tokenFromText === 'string' &&
    tokenFromText.length > 40 &&
    tokenFromText.length < 50
  ) {
    result = await makeMonobankWebhook(
      webhookRegistrationUrl,
      tokenFromText,
      baseUrl,
      chatId
    );
    console.log(result);
    const json = await result.json();
    reply.status(200).send(json);
  }

  reply.status(200).send('success');
});

app.get(`${monobankRoute}/:id`, async (request, reply) => {
  const id = request.params.id;
  reply.status(200).send(`GET request successful with id: ${id}`);
});

app.post(`${monobankRoute}/:id`, async (request, reply) => {
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const id = request.params.id;
  const messageBody = request.body;
  const messageText = `ID: ${id}\nBody: ${JSON.stringify(
    messageBody,
    null,
    2
  )}`;

  try {
    // Отправляем данные в Telegram с помощью fetch()
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: id, // Используем id пользователя из маршрута
        text: messageText,
      }),
    });

    const telegramResult = await response.json();

    if (response.ok) {
      reply.status(200).send(`POST request successful with id: ${id}`);
    } else {
      console.error('Error from Telegram API:', telegramResult);
      reply
        .status(500)
        .send(`Error from Telegram: ${telegramResult.description}`);
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    reply.status(500).send('Error sending message to Telegram');
  }

  reply.status(200).send(`POST request successful with id: ${id}`);
});

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
