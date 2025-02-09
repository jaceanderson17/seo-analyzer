const parseUrl = async (url) => {
  try {
    // Try HEAD request first
    let response = await fetch(url, { method: "HEAD" });

    // If HEAD fails, try GET as fallback
    if (!response.ok) {
      response = await fetch(url);
    }

    if (!response.ok) {
      throw new Error(`Website returned status: ${response.status}`);
    }

    // Get the response text
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Error parsing website:", error.message);
    throw error;
  }
};

export default parseUrl;
