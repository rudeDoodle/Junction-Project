# AI Integration Setup Guide

## Overview

This app now includes AI-powered personalization using **Google Gemini AI**. The AI system:

- **Remembers your personality traits** from onboarding (age, gender, experience, country, role)
- **Personalizes conversations** with Arpa based on your profile
- **Generates custom questions** tailored to your financial literacy level
- **Adapts to research findings** about financial literacy gaps in different demographics

## Research-Based Personalization

The AI is trained on key findings from financial literacy research:

### Finnish Context
- 40% of Finnish youth have high financial literacy, but gaps exist for women and rural/lower-income youth
- 18% gender gap exists (men outperforming women in knowledge)
- 91% participate in simulated business villages, but more practical skills are needed

### Personalization Features

1. **Gender-Aware Coaching**
   - For female users: More encouraging language, practical examples, focuses on building confidence
   - Research shows women often underestimate their abilities but excel in financial behaviors

2. **Experience-Based Content**
   - Beginners get informal, friendly language without jargon
   - Focus on day-to-day scenarios: managing budgets, subscriptions, avoiding scams

3. **Country-Specific Context**
   - Finnish users get references to: KELA, HSL transport, Finnish banks, S-Market, K-Market
   - Mentions student housing, Finnish tax system for young workers

4. **Role-Play & Scenario Learning**
   - Interactive questions based on real-world situations
   - Practical skills emphasis over theoretical knowledge

## Setup Instructions

### 1. Get Your Google Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Select "Create API key in new project" (or choose existing project)
5. Copy the API key
6. **Important**: Save it somewhere safe!

### 2. Configure the API Key

1. Open the `.env.local` file in the project root
2. Replace `your-gemini-api-key-here` with your actual API key:

```env
VITE_GEMINI_API_KEY=your-actual-key-here
```

3. Save the file

### 3. Restart the Development Server

If your dev server is already running:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## How It Works

### 1. Chat with Arpa (AI Coach)

When you start the onboarding chat:
- Arpa introduces herself and asks personalized questions
- The AI remembers your personality traits from onboarding
- Responses are tailored to your country, experience level, and profile
- Conversations feel natural and supportive

**Example personalization:**
- **For women**: "Research shows women often underestimate their financial abilities but excel in behaviors. You're probably doing better than you think! 😊"
- **For beginners**: Uses everyday analogies like managing a weekly budget or comparing coffee costs
- **For Finnish users**: References HSL passes, S-Market, KELA benefits

### 2. Personalized Questions

During lessons, the app generates questions specifically for you:
- Difficulty adjusted to your experience level
- Topics relevant to your country and role
- Scenarios based on your daily life
- Gender-sensitive language and examples

**Example for Finnish female student:**
- "You're apartment hunting in Helsinki. The landlord asks for 3 months' rent upfront via bank transfer to a personal account. What's your move?"

### 3. Learning Path Recommendations

Based on your performance and profile:
- AI suggests topics you should focus on
- Prioritizes practical skills over theory
- Addresses confidence gaps for women
- Includes country-specific financial education

## API Usage & Costs

### Model Used
- **All functions**: `gemini-2.0-flash-exp` (latest Gemini 2.0, fast, cost-effective, high quality)

### Costs & Free Tier
**Google Gemini is FREE for most users!**

- **Free tier**: 15 requests per minute, 1500 requests per day
- **Free quota**: 1 million tokens per month
- **No credit card required** for free tier

For this app:
- Chat message: ~500 tokens
- Question generation: ~1500 tokens
- **Daily usage: Completely FREE** for typical usage
- The free tier is more than enough for personal projects

### Going Beyond Free Tier
If you exceed the free limits (unlikely for personal use):
- Pay-as-you-go pricing available
- Very affordable rates
- Monitor usage at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## Testing Without API Key

If you don't have an API key yet, the app will:
- Show fallback messages in chat
- Use default questions instead of personalized ones
- Display a friendly error message

The app remains fully functional with static content.

## Privacy & Security

### What We Do
- ✅ Store API key in `.env.local` (not committed to git)
- ✅ Use HTTPS for all API calls
- ✅ Only send necessary user profile data to OpenAI
- ✅ No storage of conversation history on servers

### What We Don't Do
- ❌ Never share your API key
- ❌ Don't store personal financial data
- ❌ Don't send sensitive information to AI

### Data Sent to Google Gemini
Only these profile fields are sent:
- Age (optional)
- Gender (optional)
- Experience level
- Country
- Role (student/worker)

No personally identifiable information is sent.

## Troubleshooting

### "API key not found" Error

**Problem**: The app can't find your Gemini API key

**Solution**:
1. Check `.env.local` exists in project root
2. Verify the variable name is `VITE_GEMINI_API_KEY`
3. Make sure there are no extra spaces
4. Restart the dev server

### "Rate limit exceeded" Error

**Problem**: Too many API requests in short time

**Solution**:
1. Free tier: 15 requests/minute, 1500/day
2. Wait a minute before trying again
3. Check your usage at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### "Invalid API key" Error

**Problem**: Your API key is not valid

**Solution**:
1. Verify you copied the entire key
2. Check for extra spaces or characters
3. Generate a new key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
4. Make sure API key restrictions allow your domain (or set to "None" for testing)

### AI Responses Are Generic

**Problem**: AI doesn't seem personalized

**Solution**:
1. Complete the full onboarding process
2. Ensure you selected your age, gender, and experience
3. Check that userData is being passed correctly
4. Verify API key is valid and has credits

## Development Notes

### AI Service Location
`src/services/aiService.ts`

### Key Functions
- `getArpaResponse()` - Get personalized chat responses
- `generatePersonalizedQuestions()` - Create custom questions
- `getPersonalizedLearningPath()` - Suggest learning topics
- `explainConcept()` - Explain financial concepts in simple terms

### System Prompt
The system prompt is research-informed and adapts based on:
- Gender (addresses confidence gaps for women)
- Experience level (informal language for beginners)
- Country (local context and examples)
- Research findings about financial literacy gaps

### Customization
You can modify the system prompt in `aiService.ts` to:
- Add more country-specific contexts
- Adjust personality and tone
- Include additional research findings
- Change difficulty levels

## Future Enhancements

Potential improvements:
- [ ] Voice input/output for accessibility
- [ ] Multi-language support
- [ ] Progress tracking with AI insights
- [ ] Peer comparison with anonymized data
- [ ] Teacher dashboard for classroom use
- [ ] Integration with real banking APIs for transaction analysis
- [ ] Gamified challenges generated by AI

## Support

If you encounter issues:
1. Check this guide first
2. Review Google AI Studio documentation: [ai.google.dev/docs](https://ai.google.dev/docs)
3. Check browser console for error messages
4. Verify `.env.local` is properly configured

## Credits

This implementation is based on:
- Research findings on financial literacy gaps in Finland and the EU
- Google Gemini AI technology for natural language understanding
- Best practices in youth financial education
- Inclusive design principles for diverse learners

---

**Built with ❤️ to make financial literacy accessible, personalized, and practical for everyone.**
