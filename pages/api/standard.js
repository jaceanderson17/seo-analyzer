import puppeteer from "puppeteer";

const standard = async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(req.body.url, { waitUntil: "networkidle2" });

  const title = await page.evaluate(() => document.title);
  const metaDescription = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.content : "No Meta Description Found";
  });

  const headings = await page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, h3")].map((h) => h.innerText.trim())
  );

  const imagesWithoutAlt = await page.evaluate(
    () => [...document.querySelectorAll("img")].filter((img) => !img.alt).length
  );
  await browser.close();
};

export default standard;
