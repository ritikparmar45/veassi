import dotenv from 'dotenv';
dotenv.config();

// We are using Google Gemini natively via REST API

interface AIGenerationParams {
  questionTypes: string[];
  numQuestions: number;
  marks: number;
  instructions: string;
}

export const generateAssignmentPaper = async (params: AIGenerationParams) => {
  const { questionTypes, numQuestions, marks, instructions } = params;
  
  const prompt = `
You are an expert educator. Create an assessment paper based on the following parameters:
- Question Types: ${questionTypes.join(', ')}
- Total Questions: ${numQuestions}
- Total Marks: ${marks}
- Additional Instructions: ${instructions}

Return ONLY a valid JSON object matching the following structure exactly (do not wrap in markdown tags like \`\`\`json):
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Question text",
          "difficulty": "easy" | "medium" | "hard",
          "marks": 5
        }
      ]
    }
  ]
}
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No GEMINI_API_KEY found. Generating dummy data for demonstration.");
      return generateDummyData(params);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
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
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the JSON
    const parsed = JSON.parse(content);
    return parsed.sections;

  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error('Failed to generate assignment paper.');
  }
};

const generateDummyData = (params: AIGenerationParams) => {
  // Wait a few seconds to simulate generation
  return new Promise((resolve) => setTimeout(() => {
    resolve([
      {
        title: "Section A: Multiple Choice",
        instruction: "Choose the correct option.",
        questions: Array.from({ length: params.numQuestions }).map((_, i) => ({
          text: `Sample Dummy Question ${i + 1} regarding ${params.questionTypes.join(', ')}?`,
          difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
          marks: Math.floor(params.marks / params.numQuestions) || 1
        }))
      }
    ]);
  }, 3000));
};
