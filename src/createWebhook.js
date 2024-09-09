import { webhookRoute } from './initialized.js';

export const fetchData = async (url, token, webHook) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'X-Token': token,
    },
    body: JSON.stringify({ webHookUrl: webHook + webhookRoute }),
  });
};
