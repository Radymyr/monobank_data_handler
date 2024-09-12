import { telegramToken } from './initialized.js';

export function getCurrencyName(currencyCode) {
  const currencies = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
    643: 'RUB',
  };

  return currencies[currencyCode] || 'Unknown currency';
}

export function getDate(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toUTCString();
}

export function getAmount(amount) {
  return amount / 100;
}

// split a function into two functions by logic
export async function fetchDataToTelegram(req, rep) {
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const id = req.params.id;
  const messageBody = req.body;
  const messageText = `ID: ${id}\nBody: ${JSON.stringify(
    messageBody,
    null,
    2
  )}`;

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: id,
        text: messageText,
      }),
    });

    const telegramResult = await response.json();

    if (response.ok) {
      rep.status(200).send(`POST request successful with id: ${id}`);
    } else {
      console.error('Error from Telegram API:', telegramResult);
      rep
        .status(500)
        .send(`Error from Telegram: ${telegramResult.description}`);
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    rep.status(500).send('Error sending message to Telegram');
  }
  rep.status(200).send(`POST request successful with id: ${id}`);
}

export function checkWebhook(req, rep) {
  const id = request.params.id;
  rep.status(200).send(`GET request successful with id: ${id}`);
}

export function showHtml(req, rep) {
  if (req.query.code) {
    console.log(req.query.code);
  }
  rep.status(200).type('text/html').send(html);
}
