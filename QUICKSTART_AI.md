# 🚀 Quick Start: Add Your Google Gemini API Key

## Step 1: Get Your API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key

## Step 2: Add It to Your Project

1. Open the file **`.env.local`** in your project root
2. Replace `your-gemini-api-key-here` with your actual key:

```
VITE_GEMINI_API_KEY=your-actual-key-here
```

3. Save the file

## Step 3: Restart Your Server

In your terminal:
```bash
# Stop the server (press Ctrl+C)
# Then restart:
npm run dev
```

## ✅ That's It!

Your app now has AI superpowers! 🎉

### What You'll Notice:

- **Arpa remembers you** - The AI coach adapts to your age, gender, country, and experience
- **Personalized questions** - Every lesson is tailored to YOUR profile
- **Smart explanations** - Complex topics explained in a way that makes sense to you
- **Research-informed** - Based on actual studies about financial literacy gaps

### Test It Out:

1. Start a new chat with Arpa
2. Notice how responses reference YOUR country (e.g., Finnish users get HSL, KELA references)
3. Try a lesson - questions are now personalized to your experience level
4. Click "Topic of the Day" in Learn tab for AI-generated explanations

---

## ❌ Don't Have an API Key Yet?

No problem! The app works with default content. Just get a key when you're ready to unlock personalized AI features.

**Free tier**: Generous free quota (60 requests per minute)

## 📖 Need More Details?

Check out **AI_SETUP.md** for complete documentation including:
- How the AI personalization works
- Research findings it's based on
- Privacy & security info
- Troubleshooting guide
- Cost breakdown

---

**Questions?** The app will show helpful error messages if something's not configured correctly.
