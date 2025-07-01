// /api/ai-news.js
export default async function handler(req, res) {
  const accounts = ["openai", "chatgpt", "evolving.ai", "elevenlabsio"];
  const rapidApiKey = process.env.RAPIDAPI_KEY; // Set this in Vercel environment variables
  const fetchPosts = async (username) => {
    const response = await fetch("https://instagram120.p.rapidapi.com/api/instagram/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "instagram120.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      },
      body: JSON.stringify({
        username,
        maxId: "",
      }),
    });
    const json = await response.json();
    return {
      username,
      posts: json?.data?.slice(0, 2) || [],
    };
  };

  const results = await Promise.all(accounts.map(fetchPosts));
  const responseBody = Object.fromEntries(results.map((r) => [r.username, r.posts]));
  res.status(200).json(responseBody);
}
