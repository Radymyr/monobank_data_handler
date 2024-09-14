'use strict';

import { bot, monobankRoute } from './initialized.js';

export const makeTelegramWebhook = async (url, route) => {
  return await bot.telegram.setWebhook(url + route);
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
