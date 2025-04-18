const Replicate = require('replicate');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
                input: {
                    prompt: prompt,
                    num_outputs: 4,
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
}; 