import { telegramUrl, baseUrl, telegramRoute } from './initialized.js';

export const makeTelegramWebhook = async () => {
  return await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: baseUrl + telegramRoute,
    }),
  });
};
