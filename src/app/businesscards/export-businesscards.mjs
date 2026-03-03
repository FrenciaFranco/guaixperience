import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "assets");

await mkdir(outputDir, { recursive: true });

const targetUrl = process.env.BUSINESSCARDS_URL ?? "http://127.0.0.1:3000/businesscards";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 4,
});

const page = await context.newPage();
await page.goto(targetUrl, { waitUntil: "networkidle" });
await page.waitForSelector("article.businesscard");

await page.evaluate(() => {
  const overlays = document.querySelectorAll("main > div.absolute.inset-0");
  overlays.forEach((el) => el.remove());

  document.documentElement.style.background = "transparent";
  document.body.style.background = "transparent";

  const main = document.querySelector("main");
  if (main) {
    main.style.background = "transparent";
  }

  const cardArtworks = document.querySelectorAll(".businesscard-artwork");
  cardArtworks.forEach((el) => {
    el.remove();
  });
});

const cards = page.locator("article.businesscard");
const cardCount = await cards.count();

if (cardCount < 2) {
  throw new Error(`Expected 2 business cards, found ${cardCount}.`);
}

const frontBox = await cards.nth(0).boundingBox();
const backBox = await cards.nth(1).boundingBox();

if (!frontBox || !backBox) {
  throw new Error("Unable to read business card bounds.");
}

await page.screenshot({
  path: path.join(outputDir, "businesscard-front-transparent.png"),
  clip: {
    x: frontBox.x,
    y: frontBox.y,
    width: frontBox.width,
    height: frontBox.height,
  },
  omitBackground: true,
  animations: "disabled",
});

await page.screenshot({
  path: path.join(outputDir, "businesscard-back-transparent.png"),
  clip: {
    x: backBox.x,
    y: backBox.y,
    width: backBox.width,
    height: backBox.height,
  },
  omitBackground: true,
  animations: "disabled",
});

await browser.close();
