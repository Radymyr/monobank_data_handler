import Fastify from 'fastify';
const app = Fastify({ logger: true });

import {
  webhookRegistrationUrl,
  monobankRoute,
  baseUrl,
  telegramRoute,
} from '../src/initialized.js';
import { makeMonobankWebhook } from './monobank.js';
import { makeTelegramWebhook } from './telegram.js';
import {
  checkWebhook,
  fetchDataToTelegram,
  showHtml,
  validateToken,
} from './utils.js';

app.get('/', showHtml);

app.get('/makeTelegramWebhook', async (request, reply) => {
  const result = await makeTelegramWebhook();

  const json = result.json();
  reply.status(200).send(json);
});

app.post(telegramRoute, async (request, reply) => {
  const message = request.body.message;
  const chatId = message.chat.id;
  const tokenFromText = message.text.trim();

  if (validateToken(tokenFromText)) {
    const result = await makeMonobankWebhook(
      webhookRegistrationUrl,
      tokenFromText,
      baseUrl,
      chatId
    );
    const json = await result.json();
    reply.status(200).send(json);
  }

  reply.status(200).send('success');
});

app.get(`${monobankRoute}/:id`, checkWebhook);

app.post(`${monobankRoute}/:id`, fetchDataToTelegram);

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
