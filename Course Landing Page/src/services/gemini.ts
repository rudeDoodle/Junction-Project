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

export interface PersonalizedQuestion {
  id: number;
  text: string;
  field: string;
  inputType?: 'choice' | 'text';
  options?: string[];
  context?: string;
}

export async function generatePersonalizedQuestions(userData: any): Promise<PersonalizedQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a financial literacy expert creating a personalized onboarding questionnaire.

USER PROFILE:
- Country: ${userData.country || 'Finland'}
- Role: ${userData.role || 'student'}
- Financial Preparedness: ${userData.preparedness || 'beginner'}

IMPORTANT CONTEXT - WOMEN IN FINLAND:
Research shows that young women in Finland often have lower financial confidence than men, despite having similar or better financial behaviors. Women tend to underestimate their abilities even when they're doing well financially.

YOUR TASK: Create 6-8 personalized questions that will help us understand this person better and recommend the right learning content.

QUESTION GUIDELINES:
1. START with gender (Male/Female/Non-binary/Prefer not to say)
2. Be FRIENDLY and INFORMAL - use casual language, contractions, even slang sometimes
3. Mix question types:
   - Multiple choice for most questions (include "All of the above" when relevant)
   - Open-ended for personal questions (like "How much did you spend at Prisma last time?" for Finland)
4. If gender is female/woman: Ask empowering questions that acknowledge confidence gaps
5. Ask about real-life situations specific to ${userData.country || 'Finland'} (local stores like Prisma, S-Market, payment apps like MobilePay)
6. Include learning topic options so they know what's available
7. Make it feel like chatting with a knowledgeable friend, not an interview
8. For beginners: focus on foundational topics
9. For advanced: include investment and complex topics

EXAMPLE PERSONALIZED QUESTIONS:
- "Hey! What financial stuff interests you most?" with options like "Building confidence with money", "Understanding investments", "Avoiding scams", "All of the above"
- For Finland: "Quick one - about how much did you spend at Prisma or S-Market last time you shopped?" (open-ended, no options)
- "Real talk - what's your biggest money worry right now?" with relatable options
- "How do you usually learn best?" with learning style options
- "What would help you feel more boss with your finances?" with empowering options

OUTPUT FORMAT (valid JSON only, no markdown):
[
  {
    "id": 1,
    "text": "What's your gender?",
    "field": "gender",
    "inputType": "choice",
    "options": ["Male", "Female", "Non-binary", "Prefer not to say"]
  },
  {
    "id": 2,
    "text": "Casual, friendly question based on their profile",
    "field": "fieldName",
    "inputType": "choice",
    "options": ["Option 1", "Option 2", "Option 3", "All of the above"],
    "context": "Brief explanation of why this matters"
  },
  {
    "id": 3,
    "text": "About how much did you spend at Prisma last time?",
    "field": "lastPurchase",
    "inputType": "text",
    "context": "Helps understand spending patterns"
  }
]

REQUIREMENTS:
- Return ONLY valid JSON array, no markdown
- Include 6-8 questions total
- First question MUST be about gender
- Use "inputType": "choice" for multiple choice (include "All of the above" when it makes sense)
- Use "inputType": "text" for open-ended questions (1-2 questions max)
- Make questions warm, casual, friendly - like chatting with a knowledgeable friend
- Include real ${userData.country} references (stores, apps, prices in EUR)
- Include learning topic examples in questions
- For women: acknowledge confidence gap and focus on empowerment`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questions = JSON.parse(text);
    
    if (!Array.isArray(questions) || questions.length < 6) {
      throw new Error('Invalid questions structure');
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating personalized questions:', error);
    
    // Fallback to basic questions
    return [
      {
        id: 1,
        text: "What's your gender?",
        field: "gender",
        inputType: "choice",
        options: ["Male", "Female", "Non-binary", "Prefer not to say"]
      },
      {
        id: 2,
        text: "Hey! What financial stuff are you most curious about?",
        field: "mainInterest",
        inputType: "choice",
        options: ["Building money confidence", "Learning to budget", "Avoiding scams", "All of the above"]
      },
      {
        id: 3,
        text: "Quick one - about how much did you spend last time you went shopping? (in EUR)",
        field: "lastPurchase",
        inputType: "text"
      },
      {
        id: 4,
        text: "Do you have any income right now?",
        field: "hasIncome",
        inputType: "choice",
        options: ["Yeah, part-time job", "Yep, allowance", "Not yet", "Sometimes"]
      },
      {
        id: 5,
        text: "Real talk - what's your biggest money worry?",
        field: "biggestWorry",
        inputType: "choice",
        options: ["Not having enough", "Making bad decisions", "Getting scammed", "All of these tbh"]
      },
      {
        id: 6,
        text: "How do you learn best?",
        field: "learningStyle",
        inputType: "choice",
        options: ["Videos & visuals", "Interactive quizzes", "Real examples", "All of the above"]
      }
    ];
  }
}

export async function generateLesson(
  topic: string,
  country: string,
  role: string,
  userData: any
): Promise<LessonData> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a financial literacy education expert creating an interactive lesson for young people.

CONTEXT:
- Country: ${country}
- User role: ${role}
- Financial preparedness: ${userData.preparedness || 'beginner'}
- Gender: ${userData.gender || 'Not specified'}
- Main interest: ${userData.mainInterest || 'Not specified'}
- Biggest worry: ${userData.biggestWorry || 'Not specified'}
- Income status: ${userData.hasIncome || 'Not specified'}
- Savings habit: ${userData.savingsHabit || 'Not specified'}
- Learning style: ${userData.learningStyle || 'Not specified'}
- Topic: ${topic}

SPECIAL CONSIDERATIONS:
${userData.gender === 'Female' ? '- This user is a woman. Research shows women in Finland often have lower financial confidence despite good financial behaviors. Make questions empowering and acknowledge common concerns women face (like confidence gaps, pay gaps, financial independence).' : ''}
${userData.preparedness === 'beginner' ? '- Focus on foundational concepts and building confidence' : ''}
${userData.preparedness === 'advanced' ? '- Include more complex scenarios and advanced topics' : ''}

TASK: Create a 10-question interactive lesson about "${topic}" with questions highly relevant to this specific user's profile and ${country} context.

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
