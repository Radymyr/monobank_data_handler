import 'dotenv/config';

export const userToken = process.env.MONOBANK_TOKEN;
export const webHookUrl = process.env.WEB_HOOK_URL;
export const route = 'https://api.monobank.ua/personal/webhook';

export const webhookRoute = '/monobank/webhook';

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
      href="public/favicon.ico"
      type="image/x-icon"
    />
  </head>
  <body>
    <h1>mono data</h1>
  </body>
</html>`;
