import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

// --- Load OpenRouter settings from environment variables ---
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GPT_MODEL_ON_ROUTER = process.env.GPT_MODEL_ON_ROUTER || 'google/gemini-flash-1.5';

router.post('/ask', async (req, res) => {
  const { blogContent, question } = req.body;

  if (!blogContent || !question) {
    return res.status(400).json({ error: 'Missing blog content or question.' });
  }

  // --- Check for the OpenRouter key ---
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API key not set.' });
  }

  try {
    // --- OpenRouter API URL and Headers ---
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    };
    
    const prompt = `You are a knowledgeable assistant. Use the provided blog post and your broader knowledge to answer the user’s question. If the blog does not contain the answer, rely on your own expertise. Always respond briefly and clearly in pointwise format.

Blog Post:
${blogContent}

User Question:
${question}

Answer:`;

    const body = {
      model: GPT_MODEL_ON_ROUTER,
      messages: [
        { role: 'user', content: prompt }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0]?.message?.content) {
      res.json({ answer: data.choices[0].message.content });
    } else if (data.error) {
        console.error('OpenRouter API Error:', data.error);
        res.status(500).json({ error: 'An error occurred with the OpenRouter API.', details: data.error.message });
    } else {
      console.error('Unexpected OpenRouter response:', data);
      res.status(500).json({ error: 'Unexpected OpenRouter API response.', details: data });
    }
  } catch (err) {
    console.error('Error fetching from OpenRouter API:', err);
    res.status(500).json({ error: 'Server error contacting OpenRouter.', errors: err.message });
  }
});

export default router;