const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // npm install node-fetch@2

// Load your Gemini API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST /ai/ask
router.post('/ask', async (req, res) => {
  const { blogContent, question } = req.body;
  if (!blogContent || !question) {
    return res.status(400).json({ error: 'Missing blog content or question.' });
  }
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not set.' });
  }

  try {
    // Use Gemini Pro or fallback to Gemini Flash
    const model = 'models/gemini-1.5-flash'; // or 'models/gemini-pro'/'models/gemini-pro-vision'
    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `You are an expert assistant. Given the following blog post, answer the user's question as helpfully as possible.\n\n---\nBLOG POST:\n${blogContent}\n---\nQUESTION: ${question}\n\nANSWER:`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      res.json({ answer: data.candidates[0].content.parts[0].text });
    } else if (data.error && data.error.status === 'RESOURCE_EXHAUSTED') {
      res.status(429).json({ error: 'Daily Gemini API quota reached. Please try again tomorrow.' });
    } else {
      res.status(500).json({ error: 'Failed to get a response from Gemini.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error contacting Gemini.' });
  }
});

module.exports = router;