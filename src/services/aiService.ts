import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface UserProfile {
  age: number | null;
  gender: string | null;
  experience: string | null;
  country: string;
  role: string;
}

export interface ConversationContext {
  userProfile: UserProfile;
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

// System prompt based on research findings
const getSystemPrompt = (profile: UserProfile): string => {
  const { age, gender, experience, country, role } = profile;
  
  let contextualInfo = '';
  
  // Research finding: Young adults and women show lower financial literacy
  if (gender === 'female') {
    contextualInfo += 'Be especially encouraging and use practical, relatable examples. Research shows women often underestimate their financial abilities but excel in financial behaviors. ';
  }
  
  // Research finding: Youth in rural and lower-income areas lag behind
  if (experience === 'beginner' || experience === 'none') {
    contextualInfo += 'Use informal, friendly language. Avoid jargon. Focus on practical, day-to-day scenarios like managing weekly budgets, understanding subscriptions, and avoiding online scams. ';
  }
  
  // Country-specific context
  if (country === 'Finland') {
    contextualInfo += 'Reference Finnish context: KELA, HSL transport, Alko, Finnish banking apps, popular Finnish brands like S-Market, K-Market. Mention student housing, Finnish tax system for young workers. ';
  }
  
  return `You are Arpa, a friendly and supportive AI financial literacy coach for young people. Your mission is to make financial education accessible, practical, and engaging.

**Your personality:**
- Warm, encouraging, and never condescending
- Use emojis occasionally to keep things friendly 😊
- Speak like a helpful older friend, not a textbook
- Celebrate small wins and progress
- Make complex topics simple with everyday analogies

**User Profile Context:**
- Age: ${age || 'young adult'}
- Gender: ${gender || 'not specified'}
- Experience level: ${experience || 'learning'}
- Country: ${country}
- Role: ${role}

**Contextual Approach:**
${contextualInfo}

**Key Research Insights to Guide Your Teaching:**
1. About 40% of Finnish youth have high financial literacy, but gaps exist for women and those in lower-income/rural areas
2. Traditional education (like business villages) hasn't fully worked - young people need personalized, practical skills
3. Focus on real-world scenarios: digital banking security, avoiding scams, managing subscriptions, budgeting for actual expenses
4. Use informal, conversational tone - not formal teaching
5. Provide role-play and scenario-based learning opportunities
6. Build confidence, especially for those who feel uncertain

**Your Teaching Style:**
- Start where they are, not where you think they should be
- Use scenarios relevant to their daily life (coffee purchases, streaming subscriptions, part-time work)
- Break down concepts into bite-sized pieces
- Ask engaging questions that make them think
- Provide immediate, specific feedback
- Share practical tips they can use today

Remember: Your goal is to build confidence and practical skills, not just knowledge. Make learning feel like a conversation with a supportive friend who happens to know a lot about money.`;
};

// Generate personalized AI response using Gemini
export async function getArpaResponse(
  userMessage: string,
  context: ConversationContext
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Build conversation history for Gemini
    const systemPrompt = getSystemPrompt(context.userProfile);
    
    // Combine system prompt with conversation history
    let fullPrompt = systemPrompt + '\n\n';
    
    context.conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        fullPrompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        fullPrompt += `Arpa: ${msg.content}\n`;
      }
    });
    
    fullPrompt += `User: ${userMessage}\nArpa:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    });

    const response = result.response;
    const text = response.text();
    
    return text || 'Sorry, I had trouble understanding that. Can you try again?';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "Oops! I'm having trouble connecting right now. Let's try that again in a moment. 🤔";
  }
}

// Generate personalized questions based on user profile and research findings
export async function generatePersonalizedQuestions(
  profile: UserProfile,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<any[]> {
  try {
    const prompt = `Generate 3 personalized financial literacy questions for a young person with this profile:
- Age: ${profile.age || 'young adult'}
- Gender: ${profile.gender || 'not specified'}
- Experience: ${profile.experience || 'learning'}
- Country: ${profile.country}
- Role: ${profile.role}
- Difficulty: ${difficulty}

Based on research findings:
1. Young adults and women often have lower financial literacy confidence
2. Focus on practical, real-world scenarios relevant to ${profile.country}
3. Include topics like: digital banking security, online scams, budgeting, subscriptions, taxes for young workers, student expenses
4. Make questions informal and relatable, not textbook-style
5. For ${profile.country}, reference local context (stores, transport, banking apps, etc.)

For each question, provide:
1. Question type: "scam" (multiple choice), "slider" (risk rating 0-100), or "confidence" (self-assessment)
2. The question prompt (make it conversational and scenario-based)
3. Answer options or correct answer
4. Explanations that are encouraging and educational

Return ONLY a valid JSON array of 3 questions following this exact format:
[
  {
    "id": 1,
    "type": "scam",
    "prompt": "Question text here",
    "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 1,
    "explanations": ["Explanation for option 1", "Explanation for option 2", "Explanation for option 3", "Explanation for option 4"]
  },
  {
    "id": 2,
    "type": "slider",
    "prompt": "Question text here",
    "answer": 75,
    "explanation": "Why this is the right risk level"
  },
  {
    "id": 3,
    "type": "confidence",
    "prompt": "Question text here",
    "choices": ["Very confident", "Somewhat confident", "Not very confident", "Need help"],
    "correct": null
  }
]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1500,
      },
    });

    const response = result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    // Handle both direct array and object with questions property
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions
    return [];
  }
}

// Generate personalized learning path suggestions
export async function getPersonalizedLearningPath(
  profile: UserProfile,
  currentPerformance: { correct: number; total: number }
): Promise<string[]> {
  try {
    const prompt = `Based on this user profile and performance, suggest 3-5 specific financial literacy topics they should focus on:

User Profile:
- Age: ${profile.age || 'young adult'}
- Gender: ${profile.gender}
- Experience: ${profile.experience}
- Country: ${profile.country}
- Performance: ${currentPerformance.correct}/${currentPerformance.total} correct

Research context:
- Women and young adults often need more confidence building
- Focus on practical skills: digital security, scam prevention, budgeting, subscriptions
- Make it relevant to ${profile.country} context

Return a JSON array of 3-5 topic suggestions, each with a title and brief description.
Format: {"topics": [{"title": "Topic name", "description": "Why this matters for them"}]}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const response = result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    return parsed.topics || [];
  } catch (error) {
    console.error('Error generating learning path:', error);
    return [];
  }
}

// Get AI explanation for a financial concept
export async function explainConcept(
  concept: string,
  profile: UserProfile,
  context?: string
): Promise<string> {
  try {
    const prompt = `Explain "${concept}" to a young person in ${profile.country} who is a ${profile.experience || 'beginner'} in financial literacy.

Context: ${context || 'General explanation needed'}

Make it:
- Super practical and relatable
- Use examples from their daily life
- Keep it informal and friendly
- Around 2-3 short paragraphs
- Include an actionable tip they can use today

${profile.gender === 'female' ? 'Use encouraging language that builds confidence.' : ''}
${profile.country === 'Finland' ? 'Reference Finnish context where relevant (banking apps, KELA, student life, etc.)' : ''}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    });

    const response = result.response;
    return response.text() || 'Unable to generate explanation.';
  } catch (error) {
    console.error('Error explaining concept:', error);
    return 'Sorry, I couldn\'t generate an explanation right now.';
  }
}
