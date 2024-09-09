import 'dotenv/config';

export const userToken = process.env.MONOBANK_TOKEN;
export const webHookUrl = process.env.WEB_HOOK_URL;
export const route = 'https://api.monobank.ua/personal/webhook';

export const webhookRoute = '/monobank/webhook';

export default app;
