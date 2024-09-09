import { telegramToken, baseUrl, telegramRoute } from './initialized.js';

export const makeTelegramWebhook = async () => {
  const url = `https://api.telegram.org/bot${telegramToken}/setWebhook`;

  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: baseUrl + telegramRoute,
    }),
  });
};
