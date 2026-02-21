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
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { category, page, pageSize } = req.query;
    const apiKey = process.env.REACT_APP_NEWS_API;

    if (!apiKey || apiKey === 'undefined') {
      console.error('❌ API key not configured in Vercel environment');
      return res.status(500).json({ 
        status: 'error',
        message: 'API key not configured. Set REACT_APP_NEWS_API in Vercel dashboard.',
        articles: []
      });
    }

    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    
    console.log('📡 Proxy fetching from NewsAPI...');

    const newsResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Daily-News-App/1.0.0',
      },
    });

    const data = await newsResponse.json();

    if (!newsResponse.ok || data.status === 'error') {
      console.error('❌ NewsAPI Error:', data.message);
      return res.status(400).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error.message);
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      articles: []
    });
  }
}
