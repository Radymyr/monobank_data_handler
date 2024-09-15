'use strict';

import { bot, monobankRoute } from './initialized.js';

export const makeTelegramWebhook = async (url, route) => {
  await bot.telegram.setWebhook(url + route);
  await bot.telegram.getWebhookInfo().then((info) => console.log(info));
};

export const makeMonobankWebhook = async (url, token, webHook, id) => {
  const webHookUrl = webHook + monobankRoute + '/' + id;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'X-Token': token,
    },
    body: JSON.stringify({ webHookUrl }),
  });
};
