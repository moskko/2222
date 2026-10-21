export default async function handler(req, res) {
  // السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // الاتصال بخادم Ollama على Google Colab عبر رابط Serveo الجديد
    const response = await fetch('https://00035f2717cac74b-35-237-143-67.serveousercontent.com/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama server error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // إرجاع رد نموذج Llama 3 الحقيقي إلى الواجهة
    return res.status(200).json({ reply: data.response });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to connect to AI engine', details: error.message });
  }
}
