import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface Question {
  id: number;
  type: 'slider' | 'scam' | 'trueFalse' | 'textInput' | 'multiSelect';
  prompt: string;
  answer?: number | boolean;
  correct?: number | boolean | number[];
  choices?: string[];
  explanations?: string[];
  explanation?: string;
  evaluationCriteria?: string;
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

// Generate personalized quiz based on user data and spending patterns
export async function generatePersonalizedQuiz(
  userData: any,
  financeData: any[],
  transactions: any[],
  round: number = 1
): Promise<LessonData> {
  console.log('📝 generatePersonalizedQuiz called with:', { userData, financeData, transactions, round });
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build spending context
  const spendingContext = financeData.map(f => `${f.category}: €${f.monthly}/month`).join(', ');
  const recentTransactions = transactions.slice(0, 5).map(t => 
    `€${t.amount} at ${t.merchant} (${t.category}) on ${t.date}`
  ).join('; ');

  // Calculate age category for questions
  const ageCategory = userData.role === 'teen' ? 'teenager' : 
                       userData.role === 'student' ? 'young adult' : 'adult';

  const difficultyLevel = round === 1 ? 'easy' : round === 2 ? 'moderate' : 'hard';
  
  console.log('🎯 Quiz parameters:', { ageCategory, difficultyLevel, spendingContext });
  
  const prompt = `You are an AI financial literacy expert creating a HIGHLY PERSONALIZED quiz for a real user.

USER PROFILE:
- Role: ${userData.role} (${ageCategory})
- Gender: ${userData.gender || 'Not specified'}
- Country: ${userData.country || 'Finland'}
- Financial preparedness: ${userData.preparedness || 'beginner'}
- Main interest: ${userData.mainInterest || 'Not specified'}
- Biggest worry: ${userData.biggestWorry || 'Not specified'}

SPENDING DATA (THIS IS REAL DATA FROM THE USER):
- Monthly spending by category: ${spendingContext}
- Recent transactions: ${recentTransactions}

QUIZ ROUND: ${round} (Difficulty: ${difficultyLevel})
${round === 1 ? '- Start with foundational questions' : ''}
${round === 2 ? '- Increase complexity, reference their spending patterns' : ''}
${round >= 3 ? '- Advanced scenarios, deep personalization based on their habits' : ''}

CRITICAL REQUIREMENTS - THIS IS WHAT MAKES THE QUIZ SPECIAL:
1. **USE THEIR REAL DATA**: Reference actual amounts they spent (e.g., "Yesterday you paid €${transactions[0]?.amount || '20'} for groceries...")
2. **PERSONALIZE TO AGE**: ${userData.role === 'teen' ? 'Ask about credit card basics, first jobs, allowance management' : userData.role === 'student' ? 'Ask about student loans, budgeting, part-time income' : 'Ask about investments, mortgages, retirement'}
3. **MIX QUESTION TYPES**: 
   - "textInput" for open-ended answers (e.g., "How much should someone your age save monthly?")
   - "scam" for multiple choice
   - "trueFalse" for quick facts
   - "slider" for risk assessment
4. **PROGRESSIVE DIFFICULTY**: Round ${round} should be ${difficultyLevel} difficulty
5. **ENGAGING TONE**: Be conversational, supportive, occasionally humorous

QUESTION DISTRIBUTION:
- ${round === 1 ? '2 textInput, 4 scam, 2 trueFalse, 2 slider' : ''}
- ${round === 2 ? '3 textInput, 3 scam, 2 trueFalse, 2 slider' : ''}
- ${round >= 3 ? '4 textInput, 3 scam, 2 trueFalse, 1 slider' : ''}

EXAMPLES OF PERSONALIZED QUESTIONS:
${userData.role === 'teen' ? `
- "You want to get your first debit card. What do you need to open a bank account?" (textInput)
- "A shop offers you a store credit card with 20% discount. Should you get it?" (scam with options)
` : userData.role === 'student' ? `
- "Last week you spent €${transactions[0]?.amount || '45'} at ${transactions[0]?.merchant || 'Prisma'}. Was this planned or impulse spending, and why does it matter?" (textInput)
- "You have €500 saved. Should you invest it or keep it in savings?" (scam with options)
` : `
- "Based on your €${financeData[0]?.monthly || '200'}/month on ${financeData[0]?.category || 'groceries'}, what's a reasonable emergency fund goal?" (textInput)
`}

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "title": "Round ${round} - ${difficultyLevel === 'easy' ? 'Getting Started' : difficultyLevel === 'moderate' ? 'Leveling Up' : 'Expert Mode'}",
  "questions": [
    {
      "id": 1,
      "type": "textInput",
      "prompt": "Personalized question referencing their real data",
      "explanation": "What makes a good answer and why this matters",
      "evaluationCriteria": "Key points the AI should look for when evaluating"
    },
    {
      "id": 2,
      "type": "scam",
      "prompt": "Multiple choice question",
      "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 1,
      "explanations": ["Why option 1", "Why option 2", "Why option 3", "Why option 4"]
    },
    {
      "id": 3,
      "type": "trueFalse",
      "prompt": "True/false statement about their situation",
      "correct": true,
      "explanation": "Why this is true/false"
    },
    {
      "id": 4,
      "type": "slider",
      "prompt": "Rate the financial risk of [their actual scenario]",
      "answer": 65,
      "explanation": "Why this risk level"
    }
  ],
  "facts": [
    "Personalized fun fact based on their spending (e.g., 'If you saved that extra €20 from groceries, you could afford a trip to Milano in 6 months!')",
    "Another personalized insight about their financial habits",
    "Encouraging fact about their progress",
    "Interesting stat relevant to their age group in Finland",
    "Motivational fact about financial literacy"
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown
- Include EXACTLY 10 questions
- Make at least 20% of questions type "textInput" (open-ended)
- Reference their REAL spending data in at least 3 questions
- Fun facts should relate to THEIR spending patterns
- Adjust difficulty based on round number`;

  try {
    console.log('🤖 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('📥 Raw AI response:', text.substring(0, 200) + '...');
    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const quizData = JSON.parse(text);
    
    console.log('✅ Parsed quiz data:', { title: quizData.title, questionCount: quizData.questions?.length });
    
    if (!quizData.title || !Array.isArray(quizData.questions) || !Array.isArray(quizData.facts)) {
      throw new Error('Invalid quiz structure');
    }
    
    if (quizData.questions.length !== 10) {
      console.warn('⚠️ Quiz has', quizData.questions.length, 'questions instead of 10, but continuing...');
    }
    
    return quizData;
  } catch (error) {
    console.error('❌ Error generating personalized quiz:', error);
    console.log('🔄 Using fallback quiz instead...');
    
    // Return fallback quiz with basic personalized elements
    return {
      title: `Financial Quiz - Round ${round}`,
      questions: [
        {
          id: 1,
          type: 'textInput',
          prompt: `Based on your recent spending of €${transactions[0]?.amount || '25'} at ${transactions[0]?.merchant || 'a local store'}, how would you categorize this purchase - essential or discretionary? Explain why.`,
          explanation: "Understanding the difference between essential and discretionary spending helps you prioritize your budget.",
          evaluationCriteria: "Look for clear categorization and reasoning about needs vs wants"
        },
        {
          id: 2,
          type: 'scam',
          prompt: "A website offers designer clothes at 90% off. What should you do before buying?",
          choices: [
            "Buy immediately before the deal ends",
            "Research the website and check reviews",
            "Share it with friends first",
            "Ignore it completely"
          ],
          correct: 1,
          explanations: [
            "Hold on! Deals that are too good to be true often are scams. Always verify first.",
            "Smart! Always research unfamiliar websites, check reviews, and verify they're legitimate before entering payment info.",
            "Don't spread potential scams! Better to verify it yourself first.",
            "Not necessarily ignore it, but definitely verify it's legitimate before proceeding."
          ]
        },
        {
          id: 3,
          type: 'trueFalse',
          prompt: `In ${userData.country || 'Finland'}, ${userData.role === 'student' ? 'students can get discounts on public transport' : 'young people should start saving early'}`,
          correct: true,
          explanation: userData.role === 'student' 
            ? "True! Student discounts can save you 50% or more on public transport and many other services." 
            : "True! Starting to save early, even small amounts, helps build good financial habits and lets compound interest work in your favor."
        },
        {
          id: 4,
          type: 'slider',
          prompt: "Rate the financial risk (0-100): Using the same password for your bank account and social media.",
          answer: 95,
          explanation: "Extremely risky! If one account gets hacked, all your accounts are vulnerable. Always use unique, strong passwords."
        },
        {
          id: 5,
          type: 'textInput',
          prompt: `You spend about €${financeData.find(f => f.category === 'Groceries')?.monthly || '200'}/month on groceries. What's one practical way you could reduce this by 10%?`,
          explanation: "Small changes in grocery spending can add up significantly over time.",
          evaluationCriteria: "Look for practical, specific strategies like meal planning, buying generic brands, or reducing food waste"
        },
        {
          id: 6,
          type: 'scam',
          prompt: "You receive a text saying your bank account is frozen. What should you do?",
          choices: [
            "Click the link in the text to unlock it",
            "Call the bank using the number on their official website",
            "Reply to the text asking what happened",
            "Post about it on social media"
          ],
          correct: 1,
          explanations: [
            "Never click links in unexpected texts! Banks don't send texts like this. It's a phishing scam.",
            "Perfect! Always contact your bank directly using official contact information, never through unsolicited messages.",
            "Don't engage with potential scammers! They can use your response to target you further.",
            "Don't publicize your financial issues. Contact your bank directly through official channels."
          ]
        },
        {
          id: 7,
          type: 'trueFalse',
          prompt: "It's okay to share your bank PIN with close friends if you trust them.",
          correct: false,
          explanation: "False! Never share your PIN with anyone, even people you trust. If unauthorized transactions occur, you could be held liable."
        },
        {
          id: 8,
          type: 'textInput',
          prompt: `As a ${userData.role || 'young person'} in ${userData.country || 'Finland'}, what's your biggest financial worry and why?`,
          explanation: "Identifying your financial concerns is the first step to addressing them effectively.",
          evaluationCriteria: "Look for genuine concern and some reasoning behind the worry"
        },
        {
          id: 9,
          type: 'scam',
          prompt: "An online 'job' offers €500/week for liking social media posts. Red flag?",
          choices: [
            "No, social media jobs are legitimate",
            "Yes, this is likely a scam",
            "Only if they ask for money upfront",
            "It depends on the company"
          ],
          correct: 1,
          explanations: [
            "While some social media jobs exist, this offer is way too good to be true. Real jobs don't pay that much for simple tasks.",
            "Correct! Promises of easy money for simple tasks are classic scam red flags. Legitimate work requires real skills and effort.",
            "This is already a red flag! Even without upfront payment, these 'jobs' often steal personal info or involve illegal activity.",
            "No legitimate company offers this much for such minimal work. This is a scam pattern."
          ]
        },
        {
          id: 10,
          type: 'slider',
          prompt: `Rate the financial wisdom (0-100): Spending your entire monthly budget within the first week.`,
          answer: 5,
          explanation: "Very poor financial practice! This leaves you vulnerable for the rest of the month and can lead to debt. Budget throughout the month."
        }
      ],
      facts: [
        `Did you know? Your current monthly spending on ${financeData[0]?.category || 'expenses'} is €${financeData[0]?.monthly || '200'}. Saving just 10% would give you €${Math.round((financeData[0]?.monthly || 200) * 1.2)} extra per year! 💰`,
        `In ${userData.country || 'Finland'}, ${userData.role === 'student' ? 'students can save up to €600/year just by using student discounts!' : 'young adults who start saving early can build wealth faster thanks to compound interest!'}`,
        "Financial scams target young people the most - stay alert and always verify suspicious offers! 🛡️",
        "Creating a budget doesn't mean you can't have fun - it means you can enjoy guilt-free spending within your means! 🎉",
        "Small daily savings add up! Skipping one €4 coffee per week saves €208 per year - that's a weekend trip! ✈️"
      ]
    };
  }
}

// Evaluate open-ended text answer using AI
export async function evaluateTextAnswer(
  question: string,
  userAnswer: string,
  evaluationCriteria: string,
  userData: any
): Promise<{ score: number; feedback: string; xpEarned: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an AI evaluator for a financial literacy app. Evaluate this user's answer.

USER CONTEXT:
- Role: ${userData.role}
- Age group: ${userData.role === 'teen' ? 'teenager' : userData.role === 'student' ? 'young adult' : 'adult'}
- Financial level: ${userData.preparedness || 'beginner'}

QUESTION: ${question}

USER'S ANSWER: ${userAnswer}

EVALUATION CRITERIA: ${evaluationCriteria}

YOUR TASK:
1. Evaluate the answer quality on a scale of 0-100
2. Provide encouraging, constructive feedback (2-3 sentences max)
3. Calculate XP earned (0-25 XP based on quality)

SCORING GUIDE:
- 90-100: Excellent, comprehensive answer → 25 XP
- 70-89: Good answer with key points → 20 XP
- 50-69: Decent answer, missing some details → 15 XP
- 30-49: Basic answer, needs improvement → 10 XP
- 0-29: Poor or off-topic answer → 5 XP

TONE: Be encouraging and supportive. This is about learning, not judging.
- If answer is great: Celebrate their knowledge
- If answer is weak: Gently guide them with hints
- Always end with something positive or actionable

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "score": 85,
  "feedback": "Great thinking! You identified the key point about... To make this perfect, consider...",
  "xpEarned": 20
}

IMPORTANT: Return ONLY valid JSON, no markdown blocks`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const evaluation = JSON.parse(text);
    
    if (typeof evaluation.score !== 'number' || 
        typeof evaluation.feedback !== 'string' || 
        typeof evaluation.xpEarned !== 'number') {
      throw new Error('Invalid evaluation structure');
    }
    
    return evaluation;
  } catch (error) {
    console.error('Error evaluating text answer:', error);
    // Return fallback evaluation
    return {
      score: 50,
      feedback: "Thanks for your answer! Keep practicing to improve your financial knowledge.",
      xpEarned: 15
    };
  }
}

// Generate personalized fun facts based on spending
export async function generatePersonalizedFunFact(
  userData: any,
  financeData: any[],
  transactions: any[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const spendingContext = financeData.map(f => `${f.category}: €${f.monthly}/month`).join(', ');
  const recentTransactions = transactions.slice(0, 3).map(t => 
    `€${t.amount} at ${t.merchant} (${t.category})`
  ).join('; ');

  const prompt = `Generate ONE personalized, engaging fun fact about this user's spending.

USER DATA:
- Role: ${userData.role}
- Monthly spending: ${spendingContext}
- Recent purchases: ${recentTransactions}

EXAMPLES OF GREAT FUN FACTS:
- "If you saved that extra €15 you spent yesterday, you could fly to Milano in just 2 months! ✈️"
- "Your €${financeData[0]?.monthly || '200'}/month on ${financeData[0]?.category || 'groceries'} is actually 10% below the Finnish average. Nice work! 💪"
- "Fun fact: Cutting one €4 coffee per week would save you €208/year - that's a weekend trip to Stockholm! 🇸🇪"

REQUIREMENTS:
- Make it specific to THEIR spending
- Include concrete savings tips or comparisons
- Be encouraging and fun
- Use emojis
- Keep it under 150 characters

Return ONLY the fun fact text, no JSON, no quotes.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating fun fact:', error);
    return "Every euro saved today is a step toward your financial goals! 💰";
  }
}
