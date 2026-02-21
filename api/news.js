// pages/api/news.js
// Proxy API for NewsAPI requests to bypass CORS issues

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { category, page, pageSize } = req.query;
    const apiKey = process.env.REACT_APP_NEWS_API;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    
    console.log('Fetching from:', url);

    const newsResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Daily-News-App/1.0.0',
      },
    });

    if (!newsResponse.ok) {
      console.error('NewsAPI Error:', newsResponse.status, newsResponse.statusText);
      throw new Error(`NewsAPI returned ${newsResponse.status}: ${newsResponse.statusText}`);
    }

    const data = await newsResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message,
      status: 'error',
    });
  }
}
