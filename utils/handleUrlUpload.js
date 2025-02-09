const handleUrlUpload = async (url) => {
  try {
    // Ensure URL starts with http/https
    let formattedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // Validate using the URL constructor
    const urlObject = new URL(formattedUrl);

    // Ensure hostname exists
    if (!urlObject.hostname) {
      throw new Error("Invalid URL: missing hostname");
    }

    // Try fetching the website to verify it exists
    try {
      // Try HEAD request first
      let response = await fetch(formattedUrl, { method: "HEAD" });

      // If HEAD fails, try GET as fallback
      if (!response.ok) {
        response = await fetch(formattedUrl);
      }

      if (!response.ok) {
        throw new Error(`Website returned status: ${response.status}`);
      }

      return formattedUrl;
    } catch (fetchError) {
      throw new Error("Website could not be reached");
    }
  } catch (error) {
    console.error("Invalid URL:", error.message);
    return false;
  }
};

export default handleUrlUpload;
