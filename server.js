require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize Replicate
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// API endpoint for generating stickers
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Call Replicate API
        const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
                input: {
                    prompt: prompt,
                    num_outputs: 4, // Generate 4 images
                    width: 512,
                    height: 512,
                    scheduler: "K_EULER",
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                }
            }
        );

        res.json({ images: output });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate images' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 