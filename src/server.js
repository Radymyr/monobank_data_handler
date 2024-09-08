import Fastify from 'fastify';
import 'dotenv/config';
const fastify = Fastify({ logger: true });

const userToken = process.env.MONOBANK_TOKEN;
const webHookUrl = process.env.WEB_HOOK_URL;
const monobankUrl = 'https://api.monobank.ua/personal/webhook';
const direction = '/monobank/webhook';

const fetchData = (url, token, webHook) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'X-Token': token,
    },
    body: JSON.stringify({ webHookUrl: webHook + direction }),
  });
};

fetchData(userUrl, userToken, webHookUrl)
  .then((data) => data.json())
  .then((json) => console.log(json))
  .catch((err) => console.error(err));

fastify.route({
  method: ['GET', 'POST'],
  url: direction,
  handler: (request, reply) => {
    if (request.method === 'GET') {
      reply.status(200).send('<h1>hello!</h1>');
    } else if (request.method === 'POST') {
      const data = {
        body: request.body,
      };
      console.log(data);
      reply.status(200).send(data);
    }
  },
});

fastify.listen();

export default fastify;
