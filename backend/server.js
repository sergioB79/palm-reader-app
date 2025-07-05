
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// --- Serve Frontend Files ---
// This tells Express to serve all files from the parent directory (C:\palmreader)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// The route to handle image analysis
app.post('/analyze', upload.fields([{ name: 'dominantHand', maxCount: 1 }, { name: 'otherHand', maxCount: 1 }]), async (req, res) => {
    try {
        // Check if the dominant hand image was uploaded
        if (!req.files || !req.files.dominantHand) {
            return res.status(400).json({ error: 'Dominant hand image is required.' });
        }

        const dominantHandImage = req.files.dominantHand[0];

        // Prepare the image for the Google Vision API
        const imageBase64 = dominantHandImage.buffer.toString('base64');

        const requestBody = {
            requests: [
                {
                    image: {
                        content: imageBase64,
                    },
                    features: [
                        {
                            type: 'LABEL_DETECTION',
                            maxResults: 5,
                        },
                    ],
                },
            ],
        };

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("Google API Key not found. Make sure it's in your .env file.");
            return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
        }

        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

        // Send the request to the Google Vision API
        const visionResponse = await axios.post(apiUrl, requestBody);

        // --- Generate a Simple "Reading" from the AI Response ---
        const labels = visionResponse.data.responses[0].labelAnnotations;
        if (!labels || labels.length === 0) {
            return res.json({ reading: "The image is unclear, but your spirit feels strong. A mysterious energy surrounds you." });
        }

        // Create a simple, mystical-sounding reading from the top label
        const topLabel = labels[0].description.toLowerCase();
        let reading = `The vision is hazy, but the spirits whisper about what they see. They recognize a '${topLabel}' in your palm's reflection. This suggests a path filled with creativity and unexpected journeys. Your heart line seems strong, indicating a passionate nature...`;

        res.json({ reading: reading });

    } catch (error) {
        console.error('Error during AI analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to analyze the image.' });
    }
});

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running. Open http://localhost:${port} in your browser.`);
    console.log(`On your phone, browse to your computer's local IP address on the same Wi-Fi network.`);
});
