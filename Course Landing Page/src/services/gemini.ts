import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface Question {
  id: number;
  type: 'slider' | 'scam' | 'trueFalse';
  prompt: string;
  answer?: number | boolean;
  correct?: number | boolean;
  choices?: string[];
  explanations?: string[];
  explanation?: string;
}

export interface LessonData {
  title: string;
  questions: Question[];
  facts: string[];
}

export async function generateLesson(
  topic: string,
  country: string,
  role: string,
  userData: any
): Promise<LessonData> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a financial literacy education expert creating an interactive lesson for young people.

CONTEXT:
- Country: ${country}
- User role: ${role}
- Gender: ${userData.gender || 'Not specified'}
- Income status: ${userData.hasIncome || 'Not specified'}
- Savings habit: ${userData.savingsHabit || 'Not specified'}
- Topic: ${topic}

TASK: Create a 10-question interactive lesson about "${topic}" with questions relevant to ${country} and ${role}s.

QUESTION TYPES (mix them):
1. "slider" - Risk assessment (0-100 scale)
2. "scam" - Multiple choice with 4 options
3. "trueFalse" - Quick true/false statements

REQUIREMENTS:
- Use real ${country} examples (e.g., local shops, banks, payment apps, prices in EUR)
- Make scenarios relevant to ${role}s in ${country}
- Include specific ${country} scams or financial situations
- Be conversational and engaging
- Questions should test practical financial knowledge

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "title": "lesson title here",
  "questions": [
    {
      "id": 1,
      "type": "slider",
      "prompt": "Rate the risk 0-100: [scenario with ${country} context]",
      "answer": 75,
      "explanation": "Brief explanation why"
    },
    {
      "id": 2,
      "type": "scam",
      "prompt": "Question about ${country}-specific situation",
      "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 1,
      "explanations": [
        "Explanation for option 1",
        "Explanation for option 2",
        "Explanation for option 3",
        "Explanation for option 4"
      ]
    },
    {
      "id": 3,
      "type": "trueFalse",
      "prompt": "True or False: [${country}-specific statement]",
      "correct": true,
      "explanation": "Why this is true/false"
    }
  ],
  "facts": [
    "Fun fact about ${country} finances 1",
    "Fun fact about ${country} finances 2",
    "Fun fact about ${country} finances 3",
    "Fun fact about ${country} finances 4",
    "Fun fact about ${country} finances 5"
  ]
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown code blocks
- Include exactly 10 questions
- Mix question types evenly
- For slider questions, answer should be between 0-100
- For scam questions, correct should be index 0-3
- For trueFalse questions, correct should be true or false boolean
- All explanations should be helpful and educational`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const lessonData = JSON.parse(text);
    
    // Validate the structure
    if (!lessonData.title || !Array.isArray(lessonData.questions) || !Array.isArray(lessonData.facts)) {
      throw new Error('Invalid lesson structure');
    }
    
    if (lessonData.questions.length !== 10) {
      throw new Error('Lesson must have exactly 10 questions');
    }
    
    return lessonData;
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw new Error('Failed to generate lesson. Please try again.');
  }
}
