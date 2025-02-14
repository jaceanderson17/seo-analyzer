import puppeteer from "puppeteer";

const standard = async (req, res) => {
  try {
    let improvements = [];
    let score = 0;

    // Utility function to add improvements with fixes
    const addFix = (issue, fix, potentialGain) =>
      improvements.push({ issue, fix, potentialGain });

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(req.body.url, { waitUntil: "networkidle2" });

    // --- Title Tag (12 points) ---
    //  - 6 points if <title> is present
    //  - additional 6 points if length is 45-70 chars
    const titleMax = 12;
    let titlePoints = 0;

    const title = await page.evaluate(() => document.title);
    if (title) {
      titlePoints += 6; // has a title
      if (title.length >= 45 && title.length <= 70) {
        titlePoints += 6;
      } else {
        addFix(
          "Title should be between 45 and 70 characters.",
          "Update the title tag to a concise, keyword-rich title.",
          6
        );
      }
    } else {
      addFix(
        "No title found.",
        "Add a `<title>Your Page Title</title>` inside the `<head>` section.",
        12
      );
    }
    score += titlePoints;

    // --- Meta Description (10 points) ---
    //  - 5 points if present
    //  - additional 5 if between 145-165 chars
    const metaDescMax = 10;
    let metaDescPoints = 0;

    const description = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (description) {
      metaDescPoints += 5;
      if (description.length >= 145 && description.length <= 165) {
        metaDescPoints += 5;
      } else {
        addFix(
          "Meta description should be 145-165 characters long.",
          "Refine the meta description to be clear, concise, and within the ideal range.",
          5
        );
      }
    } else {
      addFix(
        "No description found.",
        "Add a `<meta name='description' content='Your description here.' />` in the <head>.",
        10
      );
    }
    score += metaDescPoints;

    // --- Keywords Meta Tag (2 points) ---
    //  - 1 point if present
    //  - additional 1 if 3-10 keywords
    const keywordsMax = 2;
    let keywordsPoints = 0;

    const keywords = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="keywords"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (keywords) {
      keywordsPoints += 1;
      const numWords = keywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (numWords >= 3 && numWords <= 10) {
        keywordsPoints += 1;
      } else {
        addFix(
          "Keywords meta tag should have 3 to 10 relevant keywords.",
          "Optimize keywords for relevance and avoid keyword stuffing.",
          1
        );
      }
    } else {
      addFix(
        "No keywords found.",
        "Add `<meta name='keywords' content='your, optimized, keywords'>` in the <head>.",
        2
      );
    }
    score += keywordsPoints;

    // --- H1 Tag (10 points) ---
    //  - 10 points if exactly one H1; 0 otherwise
    const h1Max = 10;
    let h1Points = 0;

    const h1Count = await page.evaluate(
      () => document.querySelectorAll("h1").length
    );
    if (h1Count === 1) {
      h1Points = 10;
    } else if (h1Count === 0) {
      addFix(
        "No H1 tag found.",
        "Add an H1 heading at the top of your content: `<h1>Your Main Heading</h1>`.",
        10
      );
    } else {
      addFix(
        "Multiple H1 tags found.",
        "Each page should have only **one** H1 tag. Convert secondary H1s to H2 or H3 tags.",
        10
      );
    }
    score += h1Points;

    // --- Image Alt Tags (6 points) ---
    //  - 6 points if no images missing alt
    const imageAltMax = 6;
    let imageAltPoints = 0;

    const imagesWithoutAlt = await page.evaluate(
      () => document.querySelectorAll("img:not([alt])").length
    );
    if (imagesWithoutAlt === 0) {
      imageAltPoints = 6;
    } else {
      addFix(
        `${imagesWithoutAlt} images lack alt text.`,
        "Add alt attributes: `<img src='image.jpg' alt='describe the image here'>`",
        6
      );
    }
    score += imageAltPoints;

    // --- Canonical Tag (4 points) ---
    //  - 4 points if present
    const canonicalMax = 4;
    let canonicalPoints = 0;

    const canonical = await page.evaluate(() => {
      const link = document.querySelector('link[rel="canonical"]');
      return link ? link.getAttribute("href") : null;
    });
    if (canonical) {
      canonicalPoints = 4;
    } else {
      addFix(
        "Missing canonical tag.",
        "Add `<link rel='canonical' href='https://yoursite.com/page'>` in the <head>.",
        4
      );
    }
    score += canonicalPoints;

    // --- Robots Meta (4 points) ---
    //  - 4 points if not set to 'noindex'
    const robotsMax = 4;
    let robotsPoints = 0;

    const robotsMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="robots"]');
      return meta ? meta.getAttribute("content") : null;
    });
    // If there's no meta or it's not "noindex"
    if (!robotsMeta || !robotsMeta.toLowerCase().includes("noindex")) {
      robotsPoints = 4;
    } else {
      addFix(
        "Your page is set to 'noindex'.",
        "Remove or change to `<meta name='robots' content='index, follow'>` if indexing is desired.",
        4
      );
    }
    score += robotsPoints;

    // --- Viewport Meta Tag (10 points) ---
    //  - 10 points if present
    const viewportMax = 10;
    let viewportPoints = 0;

    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute("content") : null;
    });
    if (viewport) {
      viewportPoints = 10;
    } else {
      addFix(
        "Missing viewport meta tag.",
        "Add `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` for mobile responsiveness.",
        10
      );
    }
    score += viewportPoints;

    // --- URL Length Check (5 points) ---
    //  - 5 points if <= 75 chars
    const urlLengthMax = 5;
    let urlLengthPoints = 0;

    const urlLength = req.body.url.length;
    if (urlLength <= 75) {
      urlLengthPoints = 5;
    } else {
      addFix(
        "URL is too long",
        "Consider shortening it to under ~75 characters for readability and SEO.",
        5
      );
    }
    score += urlLengthPoints;

    // --- Header Structure Check (4 points) ---
    //  - 4 points if at least one H2
    const headerStructureMax = 4;
    let headerStructurePoints = 0;

    const h2Count = await page.evaluate(
      () => document.querySelectorAll("h2").length
    );
    if (h2Count > 0) {
      headerStructurePoints = 4;
    } else {
      addFix(
        "No H2 tags found",
        "Add H2 subheadings to better structure your content.",
        4
      );
    }
    score += headerStructurePoints;

    // --- Internal Links Check (10 points) ---
    //  - 10 points if >= 1 internal link
    const internalLinksMax = 10;
    let internalLinksPoints = 0;

    const internalLinks = await page.evaluate((baseUrl) => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.filter((link) => {
        const href = link.href;
        return href.startsWith("/") || href.startsWith(baseUrl);
      }).length;
    }, req.body.url);

    if (internalLinks > 0) {
      internalLinksPoints = 10;
    } else {
      addFix(
        "No internal links found",
        "Add internal links to improve site navigation, distribute link equity, and help crawlers.",
        10
      );
    }
    score += internalLinksPoints;

    // --- External Links Check (2 points) ---
    //  - 2 points if >= 1 external link
    const externalLinksMax = 2;
    let externalLinksPoints = 0;

    const externalLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href^="http"]')).length;
    });
    if (externalLinks > 0) {
      externalLinksPoints = 2;
    } else {
      addFix(
        "No external links found",
        "Consider adding relevant external links to authoritative sources.",
        2
      );
    }
    score += externalLinksPoints;

    // --- Content Length Check (15 points) ---
    //  - 15 points if >= 300 words
    const contentLengthMax = 15;
    let contentLengthPoints = 0;

    const wordCount = await page.evaluate(() => {
      const bodyText = document.body.innerText.trim();
      return bodyText.split(/\s+/).length;
    });
    if (wordCount >= 300) {
      contentLengthPoints = 15;
    } else {
      addFix(
        "Content length is too short",
        "Add more in-depth content. Generally aim for at least 300 words, but more for competitive niches.",
        15
      );
    }
    score += contentLengthPoints;

    // --- SSL (5 points) ---
    //  - 5 points if page uses HTTPS
    const sslMax = 5;
    let sslPoints = 0;

    if (req.body.url.startsWith("https")) {
      sslPoints = 5;
    } else {
      addFix(
        "Site not using HTTPS",
        "Migrate to HTTPS for better security and a minor SEO boost.",
        5
      );
    }
    score += sslPoints;

    // --- Language Declaration Check (1 point) ---
    //  - 1 point if <html lang="..."> is present
    const languageMax = 1;
    let languagePoints = 0;

    const htmlLang = await page.evaluate(() => {
      const html = document.querySelector("html");
      return html ? html.getAttribute("lang") : null;
    });
    if (htmlLang) {
      languagePoints = 1;
    } else {
      addFix(
        "Missing language declaration",
        "Add `lang` attribute to HTML: `<html lang='en'>`.",
        1
      );
    }
    score += languagePoints;

    await browser.close();

    res.status(200).json({ score, improvements });
  } catch (error) {
    console.error("Error analyzing website:", error);
    res.status(500).json({ error: "Failed to analyze website." });
  }
};

export default standard;
