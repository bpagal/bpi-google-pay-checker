import { firefox } from "playwright";

async function getCardsWithGooglePay() {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.bpi.com.ph/personal/bank/digital-banking/digital-wallets",
  );
  await page.getByText("What cards can I add to Google Pay?").click();
  const addFollowingText = page.getByText(
    "You can add the following BPI cards to Google Pay:",
  );
  const parent = addFollowingText.locator("..");

  const ul = parent.locator("ul");
  const cardsWithGooglePay = await ul.locator("li").allTextContents();

  await browser.close();

  return cardsWithGooglePay;
}

async function sendTelegram(message: string) {
  const token = process.env.TG_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });
}

(async () => {
  const cardsWithGooglePay = await getCardsWithGooglePay();
  const message = cardsWithGooglePay.map((item) => `- ${item}`).join("\n");

  sendTelegram(message);
})();
