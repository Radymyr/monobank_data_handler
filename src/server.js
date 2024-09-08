import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

const userToken = process.env.MONOBANK_TOKEN;
const webHookUrl = process.env.WEB_HOOK_URL;
const userUrl = 'https://api.monobank.ua/personal/webhook';
const direction = '/monobank/webhook';

const fetchData = (url, token, webHook) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'X-Token': token,
    },
    body: JSON.stringify({ webHookUrl: webHook + '/' + direction }),
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
      reply.send('hello').status(200);
    } else if (request.method === 'POST') {
      const data = {
        body: request.body,
      };
      console.log(data);
      reply.send(data).status(200);
    }
  },
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  } else {
    console.log(address);
  }
});

export default fastify;
