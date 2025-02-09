const handleUrlUpload = async (url, tier) => {
  try {
    // Basic URL formatting
    let formattedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // Validate using the URL constructor
    new URL(formattedUrl);

    // Make API call to the appropriate endpoint based on tier
    const endpoint = `/api/${tier}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: formattedUrl }),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
};

export default handleUrlUpload;
