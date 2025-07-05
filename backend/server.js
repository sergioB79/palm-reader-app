require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();

// --- Middleware ---
app.use(express.json());

// --- Serve Static Frontend Files ---
// This is the key change: Vercel needs an explicit path to the public folder.
const publicPath = path.join(__dirname, '..');
app.use(express.static(publicPath));

// --- API Route for Analysis ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/analyze', upload.fields([{ name: 'dominantHand', maxCount: 1 }, { name: 'otherHand', maxCount: 1 }]), async (req, res) => {
    try {
        if (!req.files || !req.files.dominantHand) {
            return res.status(400).json({ error: 'Dominant hand image is required.' });
        }

        const dominantHandImage = req.files.dominantHand[0];
        const imageBase64 = dominantHandImage.buffer.toString('base64');

        const requestBody = {
            requests: [
                {
                    image: { content: imageBase64 },
                    features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
                },
            ],
        };

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
        }

        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        const visionResponse = await axios.post(apiUrl, requestBody);

        const labels = visionResponse.data.responses[0].labelAnnotations;
        if (!labels || labels.length === 0) {
            return res.json({ reading: "The image is unclear, but your spirit feels strong. A mysterious energy surrounds you." });
        }

        const topLabel = labels[0].description.toLowerCase();
        const reading = `The vision is hazy, but the spirits whisper about what they see. They recognize a '${topLabel}' in your palm\'s reflection. This suggests a path filled with creativity and unexpected journeys. Your heart line seems strong, indicating a passionate nature...`;

        res.json({ reading: reading });

    } catch (error) {
        console.error('Error during AI analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to analyze the image.' });
    }
});

// --- Root Route Handler ---
// This ensures that visiting the base URL serves the index.html file.
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Vercel handles the listening part, so we export the app.
module.exports = app;