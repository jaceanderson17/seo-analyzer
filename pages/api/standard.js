import puppeteer from "puppeteer";

const standard = async (req, res) => {
  try {
    let improvements = [];
    let score = 0;

    // Utility function to add improvements with fixes
    const addFix = (issue, fix) => improvements.push({ issue, fix });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(req.body.url, { waitUntil: "networkidle2" });

    // **Title Tag** (10 points)
    const title = await page.evaluate(() => document.title);
    if (title) {
      score += 5;
      if (title.length < 45 || title.length > 70) {
        addFix(
          "Title should be between 45 and 70 characters.",
          "Update the title tag to a concise, keyword-rich title."
        );
      } else {
        score += 5;
      }
    } else {
      addFix(
        "No title found.",
        "Add a `<title>Your Page Title</title>` inside the `<head>` section."
      );
    }

    // **Meta Description** (10 points)
    const description = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (description) {
      score += 5;
      if (description.length < 145 || description.length > 165) {
        addFix(
          "Meta description should be between 145 and 165 characters.",
          "Refine the meta description to be clear, concise, and within the ideal character range."
        );
      } else {
        score += 5;
      }
    } else {
      addFix(
        "No description found.",
        `Add: \n\`<meta name="description" content="Your optimized description here." />\` inside the <head>.`
      );
    }

    // **Keywords Meta Tag** (5 points)
    const keywords = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="keywords"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (keywords) {
      score += 2;
      const numWords = keywords.split(" ").length;
      if (numWords < 3 || numWords > 10) {
        addFix(
          "Keywords should have between 3 and 10 words.",
          "Optimize keywords for relevance and avoid keyword stuffing."
        );
      } else {
        score += 3;
      }
    } else {
      addFix(
        "No keywords found.",
        `Add: \n\`<meta name="keywords" content="your, optimized, keywords">\` inside the <head>.`
      );
    }

    // **H1 Tags** (10 points)
    const h1Count = await page.evaluate(
      () => document.querySelectorAll("h1").length
    );
    if (h1Count === 1) {
      score += 10;
    } else if (h1Count === 0) {
      addFix(
        "No H1 tag found.",
        "Add an H1 heading at the top of your content: `<h1>Your Main Heading</h1>`."
      );
    } else {
      addFix(
        "Multiple H1 tags found.",
        "Each page should have only **one** H1 tag. Convert secondary H1s to H2 or H3 tags."
      );
    }

    // **Image Alt Tags** (10 points)
    const imagesWithoutAlt = await page.evaluate(
      () => document.querySelectorAll("img:not([alt])").length
    );
    if (imagesWithoutAlt === 0) {
      score += 10;
    } else {
      addFix(
        `${imagesWithoutAlt} images lack alt text.`,
        `Add alt attributes: \n\`<img src="image.jpg" alt="Describe the image here">\``
      );
    }

    // **Canonical Tag** (5 points)
    const canonical = await page.evaluate(() => {
      const link = document.querySelector('link[rel="canonical"]');
      return link ? link.getAttribute("href") : null;
    });
    if (canonical) {
      score += 5;
    } else {
      addFix(
        "Missing canonical tag.",
        `Add: \n\`<link rel="canonical" href="https://yourwebsite.com/your-page">\` to the <head>.`
      );
    }

    // **Robots Meta Tag** (5 points)
    const robotsMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="robots"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (!robotsMeta || robotsMeta.toLowerCase() !== "noindex") {
      score += 5;
    } else {
      addFix(
        "Your page is set to 'noindex'.",
        "Ensure this is intentional, otherwise change it to `<meta name='robots' content='index, follow'>`."
      );
    }

    // **Viewport Meta Tag** (10 points)
    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (viewport) {
      score += 10;
    } else {
      addFix(
        "Missing viewport meta tag.",
        `Add: \n\`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` to support mobile devices.`
      );
    }

    // **URL Length Check** (5 points)
    const urlLength = req.body.url.length;
    if (urlLength > 75) {
      addFix(
        "URL is too long",
        "Consider shortening the URL. Ideal URLs are under 75 characters."
      );
    } else {
      score += 5;
    }

    // **Header Structure Check** (5 points)
    const h2Count = await page.evaluate(
      () => document.querySelectorAll("h2").length
    );
    if (h2Count === 0) {
      addFix(
        "No H2 tags found",
        "Add H2 subheadings to structure your content better."
      );
    } else {
      score += 5;
    }

    // **Internal Links Check** (5 points)
    const internalLinks = await page.evaluate((url) => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.filter((link) => {
        const href = link.href;
        return href.startsWith("/") || href.startsWith(url);
      }).length;
    }, req.body.url);
    if (internalLinks === 0) {
      addFix(
        "No internal links found",
        "Add internal links to improve site navigation and SEO."
      );
    } else {
      score += 5;
    }

    // **External Links Check** (5 points)
    const externalLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="http"]'));
      return links.length;
    });
    if (externalLinks === 0) {
      addFix(
        "No external links found",
        "Consider adding relevant external links to authoritative sources."
      );
    } else {
      score += 5;
    }

    // **Content Length Check** (5 points)
    const wordCount = await page.evaluate(() => {
      const bodyText = document.body.innerText.trim();
      return bodyText.split(/\s+/).length;
    });
    if (wordCount < 300) {
      addFix(
        "Content length is too short",
        "Add more content. Most SEO-friendly pages have at least 300 words."
      );
    } else {
      score += 5;
    }

    // **SSL Check** (5 points)
    if (!req.body.url.startsWith("https")) {
      addFix(
        "Site not using HTTPS",
        "Consider switching to HTTPS for better security and SEO."
      );
    } else {
      score += 5;
    }

    // **Language Declaration Check** (5 points)
    const htmlLang = await page.evaluate(() => {
      const html = document.querySelector("html");
      return html ? html.getAttribute("lang") : null;
    });
    if (!htmlLang) {
      addFix(
        "Missing language declaration",
        "Add lang attribute to HTML tag: `<html lang='en'>`"
      );
    } else {
      score += 5;
    }

    await browser.close();
    res.status(200).json({ score, improvements });
  } catch (error) {
    console.error("Error analyzing website:", error);
    res.status(500).json({ error: "Failed to analyze website." });
  }
};

export default standard;
