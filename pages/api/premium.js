import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
const premium = async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  const { lhr } = await lighthouse(req.body.url, {
    port: new URL(browser.wsEndpoint()).port,
  });

  await browser.close();
};

export default premium;
