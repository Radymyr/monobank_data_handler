import { monobankRoute } from './initialized.js';

export const makeMonobankWebhook = async (url, token, webHook) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'X-Token': token,
    },
    body: JSON.stringify({ webHookUrl: webHook + monobankRoute }),
  });
};
