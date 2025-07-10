const express = require('express');
require('dotenv').config();
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
    const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `You are a knowledgeable assistant. Answer the user's question naturally and clearly using both the provided blog post and your broader knowledge. If the blog doesn't include the answer, use your own information and expertise.\n\nBlog Post:\n${blogContent}\n\nUser Question:\n${question}\n\nAnswer:`;


    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      res.json({ answer: data.candidates[0].content.parts[0].text });
    } else if (data.error && data.error.status === 'RESOURCE_EXHAUSTED') {
      res.status(429).json({ error: 'Daily Gemini API quota reached. Please try again tomorrow.' });
    } else {
      console.error('Unexpected Gemini response:', data);
      res.status(500).json({ error: 'Unexpected Gemini API response.', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error contacting Gemini.', errors: err.message });
  }
});

module.exports = router;