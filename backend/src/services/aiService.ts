import dotenv from 'dotenv';
dotenv.config();

// We can use a direct fetch to OpenAI or use the openai package
// Assuming OpenAI for simplicity, falling back to a dummy generator if no key is provided.

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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("No OPENAI_API_KEY found. Generating dummy data for demonstration.");
      return generateDummyData(params);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Parse the JSON
    // Clean potential markdown wrappers
    let jsonStr = content;
    if (jsonStr.startsWith('\`\`\`json')) {
      jsonStr = jsonStr.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    const parsed = JSON.parse(jsonStr);
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
