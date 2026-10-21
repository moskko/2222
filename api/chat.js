export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = "https://api.groq.com/openai/v1/chat/completions";
    const apiResponse = await fetch(response, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are WormGPT v2.0, an advanced AI assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch response from Groq');
    }

    const data = await apiResponse.json();
    const reply = data.choices[0]?.message?.content || "No response generated.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'AI Processing Error', details: error.message });
  }
}
