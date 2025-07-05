require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors'); // Re-add cors

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Route for Analysis ---
const upload = multer();

app.post('/analyze', upload.none(), async (req, res) => {
    try {
        const { dominantHandChoice, dominantHand, otherHand, readingType } = req.body;

        if (!dominantHand || !otherHand) {
            return res.status(400).json({ error: 'Both hand images are required.' });
        }

        let prompt;
        if (readingType === 'brief') {
            prompt = `You are a mystic Romani palm reader. Provide a concise, intriguing, and slightly mysterious palm reading based on the two images provided. The user's dominant hand is their ${dominantHandChoice} hand. Keep the reading to 3-4 sentences, focusing on the most prominent lines (like Life, Heart, and Head) and the overall hand shape. End with a tempting hint that a more detailed reading will reveal much more.`;
        } else { // detailed
            prompt = `You are an expert Romani palm reader with deep knowledge of ancient traditions. The user has provided two images: their dominant (${dominantHandChoice}) hand and their other hand. Perform a comprehensive and insightful reading. Analyze the lines (Heart, Head, Life, Fate, Sun, Mercury, Health, Marriage, Travel, Intuition), the mounts (Venus, Jupiter, Saturn, Apollo, Mercury, Health, Marriage, Travel, Intuition), the finger shapes, and the overall hand shape. Synthesize this information into a flowing, narrative-style reading. Cover personality traits, life path, potential challenges, hidden strengths, love, career, and future indications. Be detailed, mystical, and profound.`;
        }

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: dominantHand
                            }
                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: otherHand
                            }
                        }
                    ]
                }
            ],
        };

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

        const visionResponse = await axios.post(apiUrl, requestBody);

        const reading = visionResponse.data.candidates[0].content.parts[0].text;
        res.json({ reading });

    } catch (error) {
        console.error('Error during AI analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to analyze the image. Please check the server logs.' });
    }
});

// Vercel handles the listening part, so we export the app.
module.exports = app;