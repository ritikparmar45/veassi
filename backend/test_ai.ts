import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key starting with:", apiKey ? apiKey.substring(0, 8) + '...' : 'NONE');
    
    if (!apiKey) {
      console.log('API key is missing entirely.');
      return;
    }

    const prompt = 'Return a JSON object with {"sections": [{"title": "Section A", "instruction": "Test", "questions": []}]}';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    console.log('Sending request to Gemini...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      return;
    }

    const data = await response.json();
    console.log("Gemini API Success Response Data:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Catastrophic Failure:", error);
  }
};

testGemini();
