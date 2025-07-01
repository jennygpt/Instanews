// /api/ai-news.js
export default async function handler(req, res) {
  const accounts = ["openai", "chatgpt", "evolving.ai", "elevenlabsio"];
  const rapidApiKey = process.env.RAPIDAPI_KEY;

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
    const posts = json?.data?.slice(0, 2) || [];
    return {
      username,
      posts,
    };
  };

  const results = await Promise.all(accounts.map(fetchPosts));

  let formatted = `📢 **AI Instagram News Summary**\n`;

  for (const result of results) {
    const { username, posts } = result;
    formatted += `\n#### 🧠 @${username}\n`;
    if (posts.length === 0) {
      formatted += `- (No recent posts found)\n`;
      continue;
    }
    for (const post of posts) {
      const date = new Date(post.timestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      formatted += `- 📅 ${date} — *"${post.caption}"*\n  🔗 [View post](${post.postUrl})\n`;
    }
  }

  res.status(200).json({
    summary: formatted,
  });
}
