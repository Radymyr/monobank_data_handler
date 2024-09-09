import Fastify from 'fastify';
const app = Fastify({ logger: true });

import {
  webhookRegistrationUrl,
  monobankToken,
  monobankRoute,
  baseUrl,
  html,
  telegramRoute,
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

  if (typeof text === 'string' && text.length > 40 && text.length < 50) {
    result = await makeMonobankWebhook(
      webhookRegistrationUrl,
      tokenFromText,
      baseUrl,
      chatId
    );
    console.log(result);
    const json = result.json();
    reply.status(200).send(json);
  }

  reply.status(200).send('success');
});

app.get(monobankRoute, async (request, reply) => {
  reply.status(200).send('success');
});

app.post(monobankRoute, async (request, reply) => {
  console.log(request.body);

  reply.status(200).send('success');
});

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
