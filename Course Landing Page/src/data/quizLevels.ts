// Pre-created quiz questions organized by difficulty level (1-5)
// Each level has 10 unique questions tailored to user's financial situation and personality
// Questions unlock progressively - Level 2 unlocks after completing Level 1, etc.
// Includes role-specific questions (student/teen/adult) and AI-graded open-ended questions

interface RoleVariant {
  type: string;
  prompt: string;
  choices?: string[];
  correct?: number | boolean;
  explanations?: string[];
  explanation?: string;
  answer?: any;
  evaluationCriteria?: string;
}

interface Question {
  id: number;
  type: string;
  prompt?: string;
  choices?: string[];
  correct?: number | boolean;
  explanations?: string[];
  explanation?: string;
  answer?: any;
  evaluationCriteria?: string;
  roleVariants?: {
    student?: RoleVariant;
    teen?: RoleVariant;
    adult?: RoleVariant;
  };
}

export const quizLevels = {
  level1: {
    title: "Financial Basics - Getting Started",
    questions: [
      {
        id: 1,
        type: "trueFalse",
        prompt: "True or False: It's okay to share your bank card PIN with a close friend if you trust them.",
        correct: false,
        explanation: "Never share your PIN with anyone! Even people you trust can accidentally compromise your security, and banks won't cover fraud if you've shared your PIN."
      },
      {
        id: 2,
        type: "scam",
        prompt: "You're buying a used phone online. The seller asks: 'Can you pay via bank transfer before I ship it?' What do you do?",
        choices: ["Send the money immediately", "Use a secure payment platform instead", "Ask for their address first", "Negotiate a lower price"],
        correct: 1,
        explanations: [
          "Risky! Bank transfers offer no buyer protection. The phone might never arrive.",
          "Smart! Payment platforms like PayPal or marketplace escrow services protect both buyer and seller.",
          "Still risky even with an address. Use secure payment methods with buyer protection.",
          "Price doesn't matter if you never get the item! Secure payment first."
        ]
      },
      {
        id: 3,
        type: "slider",
        prompt: "Rate the risk 0–100: Keeping all your savings in cash under your mattress instead of a bank account.",
        answer: 85,
        explanation: "Very risky! Cash can be stolen, lost in a fire, or lose value to inflation. Bank accounts are insured up to €100,000 in Finland and often earn interest."
      },
      {
        id: 4,
        type: "textInput",
        prompt: "If you spend €4 on coffee every weekday, how much would you spend in a month (4 weeks)?",
        answer: "80",
        explanation: "€4 × 5 days × 4 weeks = €80/month! That's €960/year on coffee. Making it at home could save you serious money for things you really want."
      },
      {
        id: 5,
        type: "scam",
        prompt: "A friend suggests splitting a Netflix subscription to save money. Is this a good idea?",
        choices: ["Yes, great way to save!", "No, it violates terms of service", "Only if Netflix doesn't find out", "Yes, but use separate profiles"],
        correct: 1,
        explanations: [
          "Actually, most streaming services have rules against sharing outside your household. You could lose access.",
          "Correct! While tempting, account sharing often violates terms of service. Consider family plans or student discounts instead.",
          "If it violates terms, it's not worth the risk of losing your account permanently.",
          "Separate profiles don't make it legal if you're sharing outside permitted users."
        ]
      },
      {
        id: 6,
        type: "trueFalse",
        prompt: "True or False: Student discounts in Finland typically save you 10-50% on transport, food, and entertainment.",
        correct: true,
        explanation: "True! Always carry your student card. You can save 50% on public transport, get discounts at restaurants, museums, movies, and more. It adds up to hundreds of euros yearly!"
      },
      {
        id: 7,
        type: "slider",
        prompt: "Rate the risk 0–100: Buying the latest iPhone on a payment plan when you're a student with limited income.",
        answer: 70,
        explanation: "Pretty risky! Payment plans lock you into monthly costs that eat into your budget. Consider a good mid-range phone instead—you'll get 90% of the features for half the price."
      },
      {
        id: 8,
        type: "scam",
        prompt: "You see a social media ad: 'Invest €100, get €500 back in a week!' What's your reaction?",
        choices: ["Invest immediately", "Research the company first", "It's definitely a scam", "Ask friends if it's legit"],
        correct: 2,
        explanations: [
          "Stop! Legitimate investments never guarantee 500% returns in a week. This is a classic scam.",
          "No legitimate company offers these returns. Save your research time—it's a scam.",
          "Exactly! No real investment can guarantee 5x returns in a week. Classic Ponzi scheme or scam.",
          "Don't put friends at risk! These 'investments' are always scams designed to steal your money."
        ]
      },
      {
        id: 9,
        type: "roleVariants",
        roleVariants: {
          student: {
            type: "textInput",
            prompt: "If rent is €450/month and you have €850 to spend monthly, what percentage of your budget goes to rent?",
            answer: "53",
            explanation: "€450 ÷ €850 = 52.9% (about 53%). Financial experts recommend keeping housing costs under 30% of income when possible, but for students, 40-50% is more realistic."
          },
          teen: {
            type: "textInput",
            prompt: "You want to save for a €300 gaming console. If you can save €25/month from your allowance, how many months until you can buy it?",
            answer: "12",
            explanation: "€300 ÷ €25 = 12 months. Saving for goals teaches delayed gratification—a crucial financial skill. You could also look for part-time work to reach your goal faster!"
          },
          adult: {
            type: "textInput",
            prompt: "Your monthly take-home pay is €2,200 and rent is €900. What percentage of your income goes to housing?",
            answer: "41",
            explanation: "€900 ÷ €2,200 = 40.9% (about 41%). This is above the recommended 30%, but common in expensive cities. Look for ways to increase income or reduce other expenses."
          }
        }
      },
      {
        id: 10,
        type: "trueFalse",
        prompt: "True or False: You should check your bank transactions at least once a week to catch unauthorized charges.",
        correct: true,
        explanation: "True! Regular monitoring helps you catch fraud early, track spending patterns, and stay within budget. Most banks have apps that make this easy—check every few days!"
      }
    ],
    facts: [
      "The average Finnish student spends €800-900 per month, including rent. Creating a budget helps you stay on track!",
      "Kela provides study grants (€250-€500/month) and housing supplements. Make sure you've applied for everything you're eligible for!",
      "Finland's student loan interest rates are among the lowest in Europe—around 0.5-1%—making them safer than most other types of debt.",
      "Using contactless payments? Set a PIN requirement for amounts over €50 to reduce fraud risk if your card is stolen.",
      "S-Market, K-Market, and Lidl loyalty programs can save €10-20/month on groceries if you use them strategically!"
    ]
  },

  level2: {
    title: "Smart Spending - Level Up Your Skills",
    questions: [
      {
        id: 11,
        type: "scam",
        prompt: "Looking at your €23.50 grocery receipt from S-Market, which strategy saves most money long-term?",
        choices: ["Always buy the cheapest option", "Plan meals before shopping", "Shop when hungry for motivation", "Buy in bulk every time"],
        correct: 1,
        explanations: [
          "Not always! Sometimes cheap items are lower quality and you waste money replacing them.",
          "Perfect! Meal planning prevents impulse buys and food waste. You'll save 20-30% on groceries!",
          "Actually, shopping hungry leads to impulse purchases and overspending. Eat first!",
          "Bulk buying only saves money if you'll actually use it before it expires. Plan first!"
        ]
      },
      {
        id: 12,
        type: "slider",
        prompt: "Rate the risk 0–100: Lending €50 to a classmate you barely know who promises to pay back 'next week.'",
        answer: 75,
        explanation: "Quite risky! Only lend money you can afford to never see again. If they're not a close friend, this is basically a gift. Consider it lost money."
      },
      {
        id: 13,
        type: "textInput",
        prompt: "You spend €11.99 on Netflix and €5.99 on Spotify monthly. How much per year on these subscriptions?",
        answer: "215.76",
        explanation: "(€11.99 + €5.99) × 12 = €215.76/year. That's over €200! Consider student discounts or family plans to cut this by 50%."
      },
      {
        id: 14,
        type: "trueFalse",
        prompt: "True or False: Buying items on sale always saves you money.",
        correct: false,
        explanation: "False! Sales can trick you into buying things you don't need. You only save money if you were already planning to buy it. Otherwise, you're spending money, not saving it!"
      },
      {
        id: 15,
        type: "scam",
        prompt: "An Instagram influencer promotes a 'financial freedom course' for €299. They show luxury cars and promise you'll make thousands. Should you buy it?",
        choices: ["Buy it immediately", "Check reviews first", "It's likely a scam", "Ask for a discount"],
        correct: 2,
        explanations: [
          "Stop! These 'get rich quick' courses rarely deliver value. They make money from selling courses, not the advice in them.",
          "Reviews are often fake on these schemes. Better to learn from free resources like libraries and official financial sites.",
          "Correct! Real financial education is available free from banks, government sites, and libraries. Flashy lifestyle = red flag.",
          "Even at a discount, you're wasting money. Use free financial literacy resources instead."
        ]
      },
      {
        id: 16,
        type: "slider",
        prompt: "Rate the risk 0–100: Using a debit card instead of credit card for all purchases as a student.",
        answer: 30,
        explanation: "Lower risk! Debit cards prevent debt since you can only spend what you have. However, credit cards offer better fraud protection. If you're disciplined, a credit card can be safer for online shopping."
      },
      {
        id: 17,
        type: "textInput",
        prompt: "If you cut your €85/month transport costs by 30% through biking more, how much would you save yearly?",
        answer: "306",
        explanation: "€85 × 0.30 = €25.50/month savings. €25.50 × 12 = €306/year! That's a nice vacation fund or emergency savings."
      },
      {
        id: 18,
        type: "scam",
        prompt: "You see a website selling concert tickets 40% cheaper than official sites. What should you do?",
        choices: ["Buy immediately before they sell out", "Check if the website is legitimate", "Compare with official ticket sites", "Both B and C"],
        correct: 3,
        explanations: [
          "Dangerous! Fake ticket sites are common. You might buy non-existent tickets.",
          "Good start! But also verify the actual ticket price on official sites.",
          "Smart! But also check if this site is legitimate—could be fake tickets.",
          "Perfect! Always verify both the site's legitimacy AND compare prices with official sellers. If it seems too good to be true, it usually is."
        ]
      },
      {
        id: 19,
        type: "roleVariants",
        roleVariants: {
          student: {
            type: "trueFalse",
            prompt: "True or False: As a student, you should always buy used textbooks instead of new ones to save money.",
            correct: false,
            explanation: "Not always! Sometimes new editions have important updates, or digital versions with access codes are required. Check with professors first, then compare library reserves, rentals, and used options."
          },
          teen: {
            type: "trueFalse",
            prompt: "True or False: It's smart to spend all your birthday money right away on things you want.",
            correct: false,
            explanation: "False! Smart move: save at least 30-50% for future goals or emergencies, then enjoy spending the rest. This builds good financial habits while still letting you have fun!"
          },
          adult: {
            type: "trueFalse",
            prompt: "True or False: Brand-name groceries are always better quality than store brands.",
            correct: false,
            explanation: "False! Many store brands are made by the same manufacturers. Blind taste tests often show no difference. Try store brands—you might save 30-50% on groceries!"
          }
        }
      },
      {
        id: 20,
        type: "textInput",
        prompt: "Describe in one sentence: What's the first thing you should do when you receive money (allowance, paycheck, etc.)?",
        answer: "save|savings|emergency|fund|budget|plan|set aside",
        evaluationCriteria: "Award points for mentioning saving first, setting money aside, budgeting, or planning. The concept of 'pay yourself first' is key.",
        explanation: "Best practice: 'Pay yourself first!' Set aside savings (10-20%) before spending on anything else. This builds wealth automatically and ensures you prioritize your future!"
      }
    ],
    facts: [
      "Meal prepping on Sundays can cut your weekly food costs by €20-30. That's up to €1,560 saved per year!",
      "Finland's public libraries offer free access to books, movies, music, and even video games—saving hundreds on entertainment.",
      "Setting up automatic transfers of even €20/month to savings builds an emergency fund without you thinking about it.",
      "The '50/30/20 rule': spend 50% on needs, 30% on wants, 20% on savings. Adjust based on your budget!",
      "Many gyms offer student discounts of 30-50%. Even better, university gyms are often the cheapest option!"
    ]
  },

  level3: {
    title: "Financial Strategy - Build Your Future",
    questions: [
      {
        id: 21,
        type: "scam",
        prompt: "Based on your €210/month grocery spending, which approach builds better long-term habits?",
        choices: ["Track every purchase in an app", "Just try to spend less", "Only check bank balance weekly", "Shop only when needed"],
        correct: 0,
        explanations: [
          "Excellent! Tracking creates awareness and helps identify spending patterns. People who track spending save 15-20% more.",
          "Vague goals don't work. Without tracking, you won't know where money goes or how to improve.",
          "Weekly checks miss problems. Track purchases in real-time to stay aware of spending habits.",
          "Shopping only when needed is good, but without tracking, you won't optimize your spending patterns."
        ]
      },
      {
        id: 22,
        type: "slider",
        prompt: "Rate the risk 0–100: Taking a €10,000 student loan when you're unsure about finishing your degree.",
        answer: 85,
        explanation: "Very risky! Student loans must be repaid even if you don't finish. Only borrow what you absolutely need, and have a solid plan for completing your studies."
      },
      {
        id: 23,
        type: "textInput",
        prompt: "Your monthly budget: €450 rent, €210 food, €85 transport, €45 subscriptions. What's your minimum monthly income needed with a 10% buffer?",
        answer: "869",
        explanation: "€450 + €210 + €85 + €45 = €790. With 10% buffer: €790 × 1.10 = €869. Always budget for unexpected expenses!"
      },
      {
        id: 24,
        type: "trueFalse",
        prompt: "True or False: Investing in stocks is always riskier than keeping money in a savings account.",
        correct: false,
        explanation: "False! While stocks have short-term volatility, over 10+ years they typically outperform savings accounts significantly. The key is your time horizon and risk tolerance. Diversified long-term investing often beats inflation better than low-interest savings."
      },
      {
        id: 25,
        type: "scam",
        prompt: "A cryptocurrency 'expert' on TikTok promises 300% returns with their trading strategy. They want you to invest via their special platform. What do you do?",
        choices: ["Invest a small amount to test", "Research the platform independently", "Recognize it as a scam", "Ask them to guarantee returns"],
        correct: 2,
        explanations: [
          "No! Even 'small amounts' add up, and this is clearly a scam. Legitimate investments never guarantee 300% returns.",
          "Don't waste time researching obvious scams. No platform can guarantee 300% returns—it's mathematically impossible without extreme risk.",
          "Exactly! Guaranteed high returns + pressure to use their platform = scam. Real crypto experts don't need to promise unrealistic returns.",
          "Legitimate investments never guarantee returns. Anyone offering guarantees is either lying or running a Ponzi scheme."
        ]
      },
      {
        id: 26,
        type: "slider",
        prompt: "Rate the risk 0–100: Buying a €1,200 laptop on credit when you have €800 in savings and €850 monthly income.",
        answer: 65,
        explanation: "Moderately risky! You'd drain most of your emergency fund. Better to buy a €800 laptop now, or save 2-3 more months for the €1,200 one. Credit should be for emergencies, not wants."
      },
      {
        id: 27,
        type: "textInput",
        prompt: "If you save €100/month for 12 months at 2% annual interest (compounded monthly), approximately how much will you have?",
        answer: "1212",
        explanation: "With compound interest: approximately €1,212. The interest earns interest! This is why starting to save early matters—compound growth accelerates over time."
      },
      {
        id: 28,
        type: "textInput",
        prompt: "Explain in 2-3 sentences what 'compound interest' means and why it matters for young people.",
        answer: "interest|earn|growth|time|invest|money|exponential|principal",
        evaluationCriteria: "Full points for explaining compound interest as earning interest on interest, and mentioning that time/starting early maximizes growth. Partial credit for basic understanding.",
        explanation: "Compound interest is earning interest on both your principal AND previously earned interest. Starting young gives money exponentially more time to grow—€100/month from age 20 becomes much more than starting at age 30!"
      },
      {
        id: 29,
        type: "roleVariants",
        roleVariants: {
          student: {
            type: "scam",
            prompt: "Your campus has a new 'textbook rental service' on Facebook offering all your course books for €50/semester via bank transfer. Red flags?",
            choices: ["Great deal - pay now!", "Check if it's university-affiliated", "Likely a scam - verify first", "Compare with official bookstore"],
            correct: 2,
            explanations: [
              "Wait! Unofficial services asking for bank transfers are often scams. Verify through official channels.",
              "Good thinking! But unless it's officially affiliated and uses secure payment, it's risky.",
              "Smart! Scammers target students with 'deals' on expensive textbooks. Use official bookstores, library reserves, or verified exchanges.",
              "Comparing is wise, but also verify legitimacy. Real savings aren't worth the risk of losing money."
            ]
          },
          teen: {
            type: "scam",
            prompt: "A Snapchat friend asks you to 'test' a money transfer app by sending €20 back and forth for a €50 bonus. What's happening?",
            choices: ["Try it - free money!", "This is a scam", "Ask friends if they did it", "Send €10 instead to test"],
            correct: 1,
            explanations: [
              "Stop! This is a money mule scam. You'll send real money but never get bonuses, and could be involved in money laundering.",
              "Exactly! Money transfer 'testing' schemes are scams or use you to launder money. Never participate!",
              "Don't involve friends! Report this scam to Snapchat and warn people without participating.",
              "Any amount is risky! You could lose money and potentially face legal issues."
            ]
          },
          adult: {
            type: "scam",
            prompt: "LinkedIn message: 'Work-from-home job, €45/hour, flexible. Apply by paying €80 for background check.' Legitimate?",
            choices: ["Pay for the background check", "This is likely a scam", "Negotiate the fee", "Ask for company details"],
            correct: 1,
            explanations: [
              "No! Legitimate employers pay for background checks, never employees. This is a scam.",
              "Correct! Real companies never make you pay for background checks. Report this scam.",
              "There's nothing to negotiate—it's a scam. Legitimate employers cover all hiring costs.",
              "More details won't help—it's a scam. Real jobs don't require payment for background checks."
            ]
          }
        }
      },
      {
        id: 30,
        type: "trueFalse",
        prompt: "True or False: Having multiple bank accounts (checking, savings, emergency fund) helps organize finances better than one account.",
        correct: true,
        explanation: "True! Separate accounts create 'mental buckets' that prevent you from accidentally spending savings. Many people use: 1) Daily spending, 2) Bills/rent, 3) Emergency fund, 4) Goals/savings."
      }
    ],
    facts: [
      "The 'pay yourself first' principle: Save/invest 10-20% of income before spending on anything else. Automate it!",
      "Emergency funds should cover 3-6 months of expenses. As a student, start with 1 month and build from there.",
      "Index funds typically return 7-10% annually over long periods, beating inflation and savings accounts significantly.",
      "Your credit score affects loan rates, apartment applications, and more. Pay bills on time to build good credit!",
      "Tax returns in Finland: Students often get refunds! File even if you earned little—you might get money back."
    ]
  },

  level4: {
    title: "Advanced Finance - Master Your Money",
    questions: [
      {
        id: 31,
        type: "scam",
        prompt: "Analyzing your €120/month 'Other' expenses category, you notice irregular spikes. What's the best financial detective work?",
        choices: ["Ignore small amounts", "Categorize every transaction", "Only track large purchases", "Check monthly totals only"],
        correct: 1,
        explanations: [
          "Small amounts add up! A €3 daily coffee is €90/month. Track everything to find leaks.",
          "Perfect! Detailed categorization reveals spending patterns and helps identify unnecessary subscriptions or impulse purchases. This is how people find €50-100+ in monthly savings.",
          "Big purchases are obvious. The real budget killers are small frequent expenses that fly under the radar.",
          "Monthly totals hide the details. You need transaction-level data to optimize spending."
        ]
      },
      {
        id: 32,
        type: "slider",
        prompt: "Rate the risk 0–100: Using BNPL (Buy Now Pay Later) services like Klarna for a €80 purchase when you have €120 available.",
        answer: 55,
        explanation: "Moderate risk! While you can afford it now, BNPL encourages overspending and can lead to late fees. Studies show BNPL users spend 20-30% more than if they paid upfront. If you have the money, pay now."
      },
      {
        id: 33,
        type: "textInput",
        prompt: "Your investments grow at 8% annually. Using the Rule of 72, how many years until your money doubles?",
        answer: "9",
        explanation: "72 ÷ 8 = 9 years. The Rule of 72 is a quick way to estimate doubling time: divide 72 by the interest rate. This shows why starting investing early matters!"
      },
      {
        id: 34,
        type: "trueFalse",
        prompt: "True or False: Diversifying investments across different sectors and asset types reduces overall risk.",
        correct: true,
        explanation: "True! 'Don't put all eggs in one basket.' Diversification means if one investment drops, others might rise. This is why index funds (holding hundreds of stocks) are less risky than individual stocks."
      },
      {
        id: 35,
        type: "scam",
        prompt: "You receive an email: 'Your package is stuck in customs. Pay €12 customs fee within 24 hours or it will be returned.' The link looks like Posti's site. What do you do?",
        choices: ["Pay immediately to avoid losing the package", "Call Posti's official number to verify", "Reply asking for more details", "Check tracking on official Posti app"],
        correct: 3,
        explanations: [
          "Stop! This is likely a phishing scam. Posti doesn't demand immediate payment via email links.",
          "Good instinct to verify! But even faster: check the official app first. If nothing shows, it's definitely a scam.",
          "Never reply to suspicious emails—it confirms your email is active and invites more scams.",
          "Perfect! Official tracking shows real package status. Scammers can't fake that. Posti also notifies through their app, not just random emails with urgent deadlines."
        ]
      },
      {
        id: 36,
        type: "slider",
        prompt: "Rate the risk 0–100: Investing 100% of your savings in a single cryptocurrency because 'it's going to the moon.'",
        answer: 95,
        explanation: "Extremely risky! Crypto is highly volatile and speculative. Investing everything in one asset—especially crypto—can result in total loss. Never invest more than 5-10% of portfolio in high-risk assets."
      },
      {
        id: 37,
        type: "textInput",
        prompt: "You have €2,000 in credit card debt at 18% APR. If you only pay €50/month minimum, approximately how much interest will you pay in year one?",
        answer: "360",
        explanation: "Roughly €360 in interest (18% of €2,000). With minimum payments, you're mostly paying interest, not principal. This is why credit card debt is so dangerous—always pay more than the minimum!"
      },
      {
        id: 38,
        type: "textInput",
        prompt: "Write a brief strategy: You have €5,000 to invest. Considering age, risk tolerance, and time horizon, what's your approach?",
        answer: "diversify|stocks|bonds|index|fund|emergency|long-term|allocation|risk",
        evaluationCriteria: "Full points for mentioning diversification, time horizon, risk assessment, emergency fund separation, specific allocation. Bonus for index funds/ETFs.",
        explanation: "Smart strategy: Keep emergency fund separate first. Young investors (10+ years): 80-90% stocks (low-cost index funds), 10-20% bonds. Older: more bonds. Key: diversify, long-term focus, don't time the market!"
      },
      {
        id: 39,
        type: "roleVariants",
        roleVariants: {
          student: {
            type: "textInput",
            prompt: "You graduate with €15,000 in student loans at 1.5% interest and get a job paying €2,200/month. What's your repayment strategy?",
            answer: "minimum|invest|emergency|balance|low|interest|fund|priority",
            evaluationCriteria: "Full points for: emergency fund first, then balanced approach considering low interest rate vs. investing returns. Deduct for ignoring emergency fund.",
            explanation: "Smart: 1) Build 3-month emergency fund, 2) Pay minimums on low-interest (1.5%) loans, 3) Invest difference (stocks return 7-10%), 4) Increase payments when stable. Balance psychology vs. math!"
          },
          teen: {
            type: "scam",
            prompt: "Your favorite YouTuber promotes a 'teen investment app' with 'guaranteed no losses.' What's wrong here?",
            choices: ["Sounds perfect!", "Too good to be true", "YouTuber is scamming fans", "Check reviews first"],
            correct: 2,
            explanations: [
              "Red flags! No investment guarantees no losses, and minors need parental involvement for real investing.",
              "Close! Definitely too good to be true, and the YouTuber is either scamming or being scammed.",
              "Correct! YouTubers get paid for promotions. 'Guaranteed no losses' is impossible—scam targeting young fans!",
              "Scammers fake reviews. The 'guaranteed no losses' is the dealbreaker—not how investing works."
            ]
          },
          adult: {
            type: "textInput",
            prompt: "Explain your retirement planning approach. What percentage of income and what accounts/strategies would you use?",
            answer: "15|20|percent|pension|retirement|IRA|compound|employer|match|early",
            evaluationCriteria: "Full points for 15-20% savings rate, tax-advantaged accounts, employer match, starting early, compound interest. Partial for general understanding.",
            explanation: "Solid plan: 15-20% of income. Finland: maximize TyEL pension, consider voluntary pension. Elsewhere: max employer match (free money!), then IRA. Start early—compound interest is powerful!"
          }
        }
      },
      {
        id: 40,
        type: "trueFalse",
        prompt: "True or False: Checking your credit report regularly helps spot identity theft and can improve your credit score.",
        correct: true,
        explanation: "True! Regular checks catch fraud, identify errors, monitor financial health. In Finland: check via Suomen Asiakastieto. Checking your own report doesn't hurt your score!"
      }
    ],
    facts: [
      "The difference between saving €100/month starting at age 20 vs age 30: approximately €76,000 more at retirement due to compound interest!",
      "Lifestyle inflation—spending more as you earn more—is why many high earners still live paycheck to paycheck. Avoid it!",
      "Insurance you might need as an adult: health, home/renters, liability, and life (if you have dependents). Insurance protects your financial foundation.",
      "Your net worth = assets - liabilities. Track it quarterly to measure financial progress beyond just income.",
      "The best time to start investing was 10 years ago. The second best time is today. Even €25/month makes a difference!"
    ]
  },

  level5: {
    title: "Financial Mastery - Expert Level",
    questions: [
      {
        id: 41,
        type: "textInput",
        prompt: "Looking at your complete finances (€850 income, €790 expenses), what's the most sophisticated wealth-building strategy? Explain your reasoning.",
        answer: "emergency|fund|debt|invest|foundation|security|surplus|save|buffer",
        evaluationCriteria: "Full points for prioritizing emergency fund FIRST, then addressing debt, then investing surplus. Deduct for skipping emergency fund or risky strategies like investing borrowed money.",
        explanation: "Foundation first: 1) Build 1-month emergency fund, 2) Pay high-interest debt, 3) Invest surplus. This protects you from derailing financial progress during emergencies. Security before optimization!"
      },
      {
        id: 42,
        type: "slider",
        prompt: "Rate the risk 0–100: A family member asks to list you as co-owner on their bank account 'just in case something happens.'",
        answer: 75,
        explanation: "High risk! As co-owner, you're liable for their debts, creditors can claim the money, and it affects your taxes/benefits. Suggest Power of Attorney instead—safer for both!"
      },
      {
        id: 43,
        type: "textInput",
        prompt: "You invest €200/month for 30 years at 8% annual return. Approximately how much will you have?",
        answer: "298000",
        explanation: "Approximately €298,000! This demonstrates the power of consistent investing and compound returns. Even modest monthly investments become substantial over decades."
      },
      {
        id: 44,
        type: "trueFalse",
        prompt: "True or False: Paying off low-interest student loans early is always better than investing that money.",
        correct: false,
        explanation: "False! If loan interest is 1% but investments return 8%, you mathematically gain more by investing. However, consider psychological factors—some people value debt freedom over maximum returns."
      },
      {
        id: 45,
        type: "scam",
        prompt: "'Microsoft Support' calls saying your computer is hacked. They can fix it remotely for €99. They sound professional and know some info. What's happening?",
        choices: ["Let them help—they sound legit", "This is a tech support scam", "Ask them to prove they're Microsoft", "Hang up and call Microsoft directly"],
        correct: 3,
        explanations: [
          "It's a scam! They'll install malware or charge for useless 'fixes.' Real Microsoft never cold-calls.",
          "Correct it's a scam, but hanging up and calling official Microsoft is the best action.",
          "Scammers have convincing 'proof.' Don't engage—they're trained manipulators. Just hang up.",
          "Perfect! Real Microsoft NEVER calls unsolicited. Hang up, find official number yourself, call if concerned. Their 'knowledge' is from data breaches."
        ]
      },
      {
        id: 46,
        type: "slider",
        prompt: "Rate the risk 0–100: Using all disposable income to pay off 1.5% student loan instead of building investments.",
        answer: 45,
        explanation: "Moderate risk! While debt-free feels good, you're missing years of compound growth. With rates this low, consider splitting: pay minimums while building investments. Balance psychology and mathematics."
      },
      {
        id: 47,
        type: "textInput",
        prompt: "A rental property costs €150,000, earns €1,000/month rent with €400/month expenses. What's the annual ROI percentage (ignoring appreciation)?",
        answer: "4.8",
        explanation: "Net income: (€1,000 - €400) × 12 = €7,200/year. ROI: €7,200 ÷ €150,000 = 4.8%. Real estate ROI must factor in maintenance, vacancies, appreciation, and leverage for complete picture."
      },
      {
        id: 48,
        type: "scam",
        prompt: "An advisor offers 'guaranteed 15% annual returns with zero risk' via 'proprietary algorithm.' They manage €10M+ for clients. Red flags?",
        choices: ["Sounds legitimate with that track record", "Zero risk + high returns = impossible", "Ask to see the algorithm first", "Request client references"],
        correct: 1,
        explanations: [
          "Track records are easily faked. Bernie Madoff managed billions before his Ponzi collapsed. High returns + zero risk = scam, always.",
          "Exactly! Finance rule #1: higher returns = higher risk. Anyone claiming high returns with zero risk is lying or running a Ponzi. Report them!",
          "They won't show it (trade secret excuse) or show fake code. 'Zero risk + high return' is mathematically impossible.",
          "References will be fake or other victims who haven't realized it yet. No legitimate investment offers zero risk with high returns."
        ]
      },
      {
        id: 49,
        type: "textInput",
        prompt: "Explain in your own words: What is 'rebalancing' a portfolio and why does it matter? Give a specific example.",
        answer: "rebalance|allocation|target|sell|buy|risk|diversification|adjust|maintain",
        evaluationCriteria: "Full points for explaining rebalancing as adjusting holdings back to target allocation, mentioning sell high/buy low benefit, and risk management. Partial for basic concept.",
        explanation: "Rebalancing: periodically adjusting portfolio back to target allocation (e.g., 80% stocks/20% bonds). If stocks boom to 90%, you sell some and buy bonds. This forces 'sell high, buy low' and maintains your risk tolerance!"
      },
      {
        id: 50,
        type: "roleVariants",
        roleVariants: {
          student: {
            type: "slider",
            prompt: "Rate the wisdom 0–100: As a student, investing €50/month into low-cost index funds rather than saving it in a regular savings account.",
            answer: 90,
            explanation: "Very wise! Starting early with even small amounts leverages compound growth. Over 40 years, €50/month at 8% becomes ~€175,000 vs. ~€24,000 in savings. Time is your biggest advantage!"
          },
          teen: {
            type: "slider",
            prompt: "Rate the risk 0–100: As a teen, putting all your savings into your friend's startup idea because they promise you'll be rich together.",
            answer: 95,
            explanation: "Extremely risky! Most startups fail (90%+), and mixing money with friendships often ends badly. Support friends in other ways. If you invest, use only 'fun money' (5% max) you can afford to lose completely."
          },
          adult: {
            type: "slider",
            prompt: "Rate the risk 0–100: Quitting your job to pursue a 'passive income' crypto staking opportunity promising €500/month.",
            answer: 92,
            explanation: "Extremely risky! 'Passive income' schemes often collapse. Crypto staking has volatility, platform, and regulatory risks—no guarantees. Never quit reliable income for speculation. Build passive income WHILE working!"
          }
        }
      }
    ],
    facts: [
      "The 4% rule: In retirement, withdrawing 4% of your portfolio annually provides sustainable income. Plan accordingly for long-term financial independence!",
      "Geographic arbitrage: Living in lower-cost areas while earning from higher-paying markets is a powerful wealth-building strategy for remote workers.",
      "Tax-loss harvesting: Selling losing investments to offset gains reduces tax bills. Advanced investors save thousands annually with this strategy.",
      "Asset location matters: Keep tax-inefficient investments (bonds, REITs) in tax-advantaged accounts; stocks in taxable accounts. Optimizes after-tax returns.",
      "The best financial plan balances mathematics and psychology. Technically optimal isn't always personally sustainable—find what works for you long-term!"
    ]
  }
};

export type QuizLevel = keyof typeof quizLevels;

// Helper function to get quiz for a specific level with role-based personalization
export const getQuizForLevel = (level: number, userRole?: string) => {
  const levelKey = `level${Math.min(Math.max(level, 1), 5)}` as QuizLevel;
  const levelData = quizLevels[levelKey];
  
  // Process questions to handle role-specific variants
  const processedQuestions = levelData.questions.map((question: Question) => {
    if (question.roleVariants && userRole) {
      const role = userRole.toLowerCase() as 'student' | 'teen' | 'adult';
      const variant = question.roleVariants[role] || question.roleVariants.student;
      
      if (variant) {
        return {
          id: question.id,
          ...variant
        };
      }
    }
    return question;
  });
  
  return {
    ...levelData,
    questions: processedQuestions
  };
};

// Helper to check if a level is unlocked based on completed levels
export const isLevelUnlocked = (level: number, completedLevels: number[]): boolean => {
  if (level === 1) return true; // Level 1 always unlocked
  return completedLevels.includes(level - 1); // Level N unlocks after completing Level N-1
};

// Get all unlocked levels for a user
export const getUnlockedLevels = (completedLevels: number[]): number[] => {
  const unlocked = [1]; // Level 1 always unlocked
  
  for (let i = 2; i <= 5; i++) {
    if (completedLevels.includes(i - 1)) {
      unlocked.push(i);
    } else {
      break; // Stop when we hit a locked level
    }
  }
  
  return unlocked;
};
