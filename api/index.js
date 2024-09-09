import Fastify from 'fastify';
const app = Fastify({ logger: true });

import { route, userToken, webHookUrl } from '../src/initialized.js';
import { fetchData } from '../src/initialized.js';

app.get('/registration', async (request, reply) => {
  const result = await fetchData(route, userToken, webHookUrl);
  const json = result.json();
  reply.status(200).send(json);
});

app.get(webhookRoute, async (request, reply) => {
  reply.status(200).send('success');
});

app.post(webhookRoute, async (request, reply) => {
  console.log(request.body);

  reply.status(200).send('success');
});

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit('request', req, reply);
}
