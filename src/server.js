'use strict';

import { app, bot } from '../src/initialized.js';

import {
  webhookRegistrationUrl,
  monobankRoute,
  baseUrl,
  telegramRoute,
} from '../src/initialized.js';
import { makeTelegramWebhook, makeMonobankWebhook } from './setWebhooks.js';
import {
  checkWebhook,
  sendToTelegram,
  showHtml,
  validateToken,
} from './utils.js';

app.get('/', showHtml);

app.get('/makeTelegramWebhook', async (request, reply) => {
  await makeTelegramWebhook(baseUrl, telegramRoute);

  reply.status(200).send('success');
});

app.post(telegramRoute, async (request, reply) => {
  const message = request.body.message;
  const chatId = message.chat.id;
  const tokenFromText = message.text.trim();
  await bot.handleUpdate(request.body);

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

app.post(`${monobankRoute}/:id`, sendToTelegram);

export default async function handler(request, reply) {
  await app.ready();
  app.server.emit('request', request, reply);
}
