import 'dotenv/config';

export const monobankToken = process.env.MONOBANK_TOKEN;
export const baseUrl = process.env.WEB_HOOK_URL;
export const telegramToken = process.env.TELEGRAM_TOKEN;
export const webhookRegistrationUrl =
  'https://api.monobank.ua/personal/webhook';

export const monobankRoute = '/monobank/webhook';
export const telegramRoute = '/telegram/webhook';

export const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <link
      rel="icon"
      type="image/x-icon"
    />
  </head>
  <body>
    <h1>mono data</h1>
  </body>
</html>`;
