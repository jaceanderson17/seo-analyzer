import axios from "axios";
import cheerio from "cheerio";

const basic = async (req, res) => {
  try {
    // Try HEAD request first
    const { data } = await axios.get(req.body.url);

    const $ = cheerio.load(data);

    const title = $("title").text() || "No title found";
    const description =
      $('meta[name="description"]').attr("content") || "No description found";
    const keywords =
      $('meta[name="keywords"]').attr("content") || "No keywords found";
    const headings = [];
    $("h1, h2, h3").each((_, el) => headings.push($(el).text().trim()));
    const imageWithoutAlt = $("img:not([alt])").length;
  } catch (error) {
    console.error("Error parsing website:", error.message);
    throw error;
  }
};

export default basic;
