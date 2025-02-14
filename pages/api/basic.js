import axios from "axios";
import cheerio from "cheerio";

const basic = async (req, res) => {
  try {
    let improvements = [];
    let score = 0;

    // Utility function to add improvements with fixes
    const addFix = (issue, fix) => improvements.push({ issue, fix });

    // Fetch website data with better error handling
    const response = await axios.get(req.body.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Use more forgiving parsing options
    const $ = cheerio.load(response.data, {
      xmlMode: false,
      decodeEntities: true,
      normalizeWhitespace: true,
      lowerCaseTags: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
    });

    // **Title Tag** (10 points)
    const title = $("title").text();
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
    const description = $('meta[name="description"]').attr("content");
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
    const keywords = $('meta[name="keywords"]').attr("content");
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
    const h1Tags = $("h1");
    if (h1Tags.length === 1) {
      score += 10;
    } else if (h1Tags.length === 0) {
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
    const imagesWithoutAlt = $("img:not([alt])");
    if (imagesWithoutAlt.length === 0) {
      score += 10;
    } else {
      addFix(
        `${imagesWithoutAlt.length} images lack alt text.`,
        `Add alt attributes: \n\`<img src="image.jpg" alt="Describe the image here">\``
      );
    }

    // **Canonical Tag** (5 points)
    const canonical = $('link[rel="canonical"]').attr("href");
    if (canonical) {
      score += 5;
    } else {
      addFix(
        "Missing canonical tag.",
        `Add: \n\`<link rel="canonical" href="https://yourwebsite.com/your-page">\` to the <head>.`
      );
    }

    // **Robots Meta Tag** (5 points)
    const robotsMeta = $('meta[name="robots"]').attr("content");
    if (!robotsMeta || robotsMeta.toLowerCase() !== "noindex") {
      score += 5;
    } else {
      addFix(
        "Your page is set to 'noindex'.",
        "Ensure this is intentional, otherwise change it to `<meta name='robots' content='index, follow'>`."
      );
    }

    // **Viewport Meta Tag (Mobile Friendliness)** (10 points)
    const viewport = $('meta[name="viewport"]').attr("content");
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
    const h2Tags = $("h2").length;
    if (h2Tags === 0) {
      addFix(
        "No H2 tags found",
        "Add H2 subheadings to structure your content better."
      );
    } else {
      score += 5;
    }

    // **Internal Links Check** (5 points)
    const internalLinks = $(
      'a[href^="/"], a[href^="' + req.body.url + '"]'
    ).length;
    if (internalLinks === 0) {
      addFix(
        "No internal links found",
        "Add internal links to improve site navigation and SEO."
      );
    } else {
      score += 5;
    }

    // **External Links Check** (5 points)
    const externalLinks = $('a[href^="http"]').length;
    if (externalLinks === 0) {
      addFix(
        "No external links found",
        "Consider adding relevant external links to authoritative sources."
      );
    } else {
      score += 5;
    }

    // **Content Length Check** (5 points)
    const bodyText = $("body").text().trim();
    const wordCount = bodyText.split(/\s+/).length;
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
    const htmlLang = $("html").attr("lang");
    if (!htmlLang) {
      addFix(
        "Missing language declaration",
        "Add lang attribute to HTML tag: `<html lang='en'>`"
      );
    } else {
      score += 5;
    }

    // **Return Response**
    res.status(200).json({ score, improvements });
  } catch (error) {
    console.error("Error parsing website:", error.message);
    res.status(500).json({ error: "Failed to analyze website." });
  }
};

export default basic;
