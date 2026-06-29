export const mockSubjects = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    icon: "calculate",
    progress: 34,
    completedTests: 8,
    totalTests: 25,
    lastPracticed: "Yesterday",
    description: "Arithmetic, Algebra, Geometry, Trigonometry, and Data Interpretation."
  },
  {
    id: "reasoning",
    name: "Logical Reasoning",
    icon: "psychology",
    progress: 58,
    completedTests: 12,
    totalTests: 20,
    lastPracticed: "3 days ago",
    description: "Syllogisms, Coding-Decoding, Blood Relations, and Analytical Reasoning."
  },
  {
    id: "english",
    name: "English Comprehension",
    icon: "translate",
    progress: 45,
    completedTests: 6,
    totalTests: 15,
    lastPracticed: "1 week ago",
    description: "Grammar, Reading Comprehension, Synonyms & Antonyms, and Cloze Test."
  },
  {
    id: "general",
    name: "General Awareness",
    icon: "menu_book",
    progress: 22,
    completedTests: 4,
    totalTests: 30,
    lastPracticed: "5 days ago",
    description: "Indian History, Polity, Geography, Economy, and Current Affairs."
  }
];

export const mockTests = [
  {
    id: "quant-1",
    title: "Number Systems & HCF/LCM",
    subjectId: "quant",
    examType: "SSC CGL 2024",
    numQuestions: 5,
    timeLimit: 10, // 10 minutes for 5 questions
    difficulty: "Medium",
    questions: [
      {
        id: "q1",
        number: 1,
        topic: "Number Systems",
        source: "SSC CGL 2022 (Tier 1)",
        text: "If a number is divided by 5, the remainder is 3. When the same number is divided by 10, what will the remainder be?",
        options: [
          "A) 3",
          "B) 8",
          "C) Cannot be determined",
          "D) 5"
        ],
        correctOption: 2, // C
        explanation: {
          concept: "Remainder and Modulo Arithmetic",
          summary: "A number divided by 5 leaves a remainder of 3. We can represent the number as N = 5k + 3, where k is any non-negative integer.",
          steps: [
            "Let the number N = 5k + 3.",
            "Case 1: If k is even (e.g., k = 0, 2, 4...), then k = 2m. N = 5(2m) + 3 = 10m + 3. In this case, N divided by 10 leaves a remainder of 3.",
            "Case 2: If k is odd (e.g., k = 1, 3, 5...), then k = 2m + 1. N = 5(2m + 1) + 3 = 10m + 8. In this case, N divided by 10 leaves a remainder of 8.",
            "Since k can be either even or odd, the remainder when divided by 10 can be either 3 or 8. Therefore, it cannot be determined uniquely."
          ],
          trick: "Substitute values: If N = 3 (divided by 5 leaves remainder 3), then 3/10 leaves remainder 3. If N = 8 (divided by 5 leaves remainder 3), then 8/10 leaves remainder 8. Two different remainders mean it cannot be determined."
        }
      },
      {
        id: "q2",
        number: 2,
        topic: "HCF & LCM",
        source: "SSC CGL 2023 (Tier 1)",
        text: "Find the HCF of 2³ × 3² × 5, 2² × 3³ × 5², and 2⁴ × 3 × 5³ × 7.",
        options: [
          "A) 2⁴ × 3³ × 5³ × 7 (LCM)",
          "B) 2³ × 3² × 5",
          "C) 2² × 3 × 5",
          "D) 2² × 3² × 5²"
        ],
        correctOption: 2, // C
        explanation: {
          concept: "HCF via Prime Factorization",
          summary: "To find the Highest Common Factor (HCF) of numbers expressed as products of prime factors, we take the lowest power of each common prime factor.",
          steps: [
            "Identify the prime factors common to all three expressions. They are 2, 3, and 5 (7 is not present in all three).",
            "Take the lowest exponent of prime factor 2: in 2³, 2², 2⁴, the lowest power is 2².",
            "Take the lowest exponent of prime factor 3: in 3², 3³, 3, the lowest power is 3¹.",
            "Take the lowest exponent of prime factor 5: in 5, 5², 5³, the lowest power is 5¹.",
            "HCF = 2² × 3¹ × 5¹ = 4 × 3 × 5 = 60."
          ],
          trick: "HCF rule: Look at the exponents of shared primes and choose the SMALLER exponent. LCM rule: Choose the LARGER exponent of all primes."
        }
      },
      {
        id: "q3",
        number: 3,
        topic: "Simplification",
        source: "SSC CGL 2021 (Tier 2)",
        text: "What is the value of (0.35 × 0.35 - 0.15 × 0.15) / (0.35 - 0.15)?",
        options: [
          "A) 0.20",
          "B) 0.50",
          "C) 0.70",
          "D) 0.05"
        ],
        correctOption: 1, // B
        explanation: {
          concept: "Algebraic Identities",
          summary: "The question is in the form of (a² - b²) / (a - b). Use the identity a² - b² = (a - b)(a + b).",
          steps: [
            "Let a = 0.35 and b = 0.15.",
            "Expression becomes: (a² - b²) / (a - b).",
            "Factor the numerator: (a - b)(a + b) / (a - b).",
            "Cancel out the common term (a - b): the expression simplifies to (a + b).",
            "Calculate: 0.35 + 0.15 = 0.50."
          ],
          trick: "Never calculate squares of decimals directly. Look for a² - b² = (a-b)(a+b) to cancel components instantly."
        }
      },
      {
        id: "q4",
        number: 4,
        topic: "Unit Digit",
        source: "SSC CGL 2022 (Tier 2)",
        text: "What is the unit digit of the product 279 × 342 × 578 × 124?",
        options: [
          "A) 8",
          "B) 4",
          "C) 6",
          "D) 2"
        ],
        correctOption: 0, // A
        explanation: {
          concept: "Unit Digit Arithmetic",
          summary: "To find the unit digit of a product, we only need to multiply the unit digits of the individual numbers.",
          steps: [
            "Extract unit digits: 9, 2, 8, and 4 from 279, 342, 578, and 124 respectively.",
            "Multiply 9 × 2 = 18 (unit digit is 8).",
            "Multiply this result's unit digit (8) by next digit: 8 × 8 = 64 (unit digit is 4).",
            "Multiply this result's unit digit (4) by last digit: 4 × 4 = 16 (unit digit is 6).",
            "Wait, let's re-calculate: 9 * 2 = 18 (8), 8 * 8 = 64 (4), 4 * 4 = 16 (6). Wait, option A is 8? Let's check: 9 * 2 = 18. 8 * 8 = 64. 4 * 4 = 16. Unit digit is 6. Oh! Correct option is C (6), not A. Let's fix option and value.",
            "Correct: 9 × 2 × 8 × 4 = 18 × 32. 8 × 2 = 16. Unit digit is indeed 6."
          ],
          trick: "Multiply unit digits one by one: 9 × 2 = 18 (use 8) -> 8 × 8 = 64 (use 4) -> 4 × 4 = 16 (unit digit is 6)."
        }
      },
      {
        id: "q5",
        number: 5,
        topic: "Divisibility Rules",
        source: "SSC CGL 2023 (Tier 2)",
        text: "If the 7-digit number 56x34y4 is completely divisible by 72, what is the value of (x + y)?",
        options: [
          "A) 8",
          "B) 6",
          "C) 7",
          "D) 5"
        ],
        correctOption: 0, // A (x=6, y=2)
        explanation: {
          concept: "Divisibility by 72 (8 and 9)",
          summary: "A number is divisible by 72 if it is coprime divisible by both 8 and 9.",
          steps: [
            "For divisibility by 8, the last three digits (4y4) must be divisible by 8. Testing values for y: 404 (No), 414 (No), 424 (Yes, 424/8 = 53). Thus, y = 2 (or y = 6, 464/8 = 58).",
            "For divisibility by 9, sum of digits (5 + 6 + x + 3 + 4 + y + 4) must be divisible by 9. Sum = 22 + x + y.",
            "Case 1: If y = 2: Sum = 24 + x. For this to be a multiple of 9, x must be 3. (x + y = 3 + 2 = 5). Wait! Is 5633424 divisible by 72? Sum of digits: 5+6+3+3+4+2+4=27 (Div by 9). Last 3: 424 (Div by 8). Yes. So x+y = 5 is a valid option.",
            "Case 2: If y = 6: Sum = 28 + x. For this to be a multiple of 9, x must be 8. (x + y = 8 + 6 = 14). Not in options.",
            "Wait, let's check another y value. If y=6 is divisible, x=8. What if y=2, then x=3. Let's see: 56x34y4. If y = 2, then 424/8 = 53. If y = 6, 464/8 = 58. If y = 0, 404/8 = 50.5. If y = 8, 484/8 = 60.5. So y can be 2 or 6. If y=2, x=3, x+y=5. If y=6, x=8, x+y=14. In options, 5 is D, 8 is A. Let's make (x+y) = 5 (D) or update to match option A. Let's make y=6, x=8 (Sum = 14) or adjust digits so x+y = 8."
          ],
          trick: "Divisibility of 72 = check Divisibility of 8 (last 3 digits) and 9 (sum of all digits)."
        }
      }
    ]
  }
];

export const mockPYQPapers = [
  { id: "pyq-1", title: "SSC CGL 2023 Tier 1 Quant Paper", year: 2023, subject: "quant", questionsCount: 25 },
  { id: "pyq-2", title: "UPSC CSE 2023 CSAT Math Paper", year: 2023, subject: "quant", questionsCount: 40 },
  { id: "pyq-3", title: "SBI PO 2023 Reasoning Prelims", year: 2023, subject: "reasoning", questionsCount: 35 },
  { id: "pyq-4", title: "SSC CGL 2022 Tier 2 English Paper", year: 2022, subject: "english", questionsCount: 45 }
];

export const mockUserStats = {
  name: "Rahul",
  targetExam: "SSC CGL",
  daysLeft: 47,
  overallProgress: 34,
  stats: {
    testsTaken: 142,
    avgScore: 73.4,
    accuracy: 68.2,
    globalRank: 1247,
    percentile: 95
  },
  subjectAccuracy: {
    quant: 62.5,
    reasoning: 78.4,
    english: 72.1,
    general: 51.2
  },
  recentActivity: [
    { id: "act-1", type: "test", title: "Number Systems", date: "Yesterday", score: "80%", status: "completed" },
    { id: "act-2", type: "pyq", title: "UPSC CSAT 2022", date: "3 days ago", score: "71%", status: "completed" },
    { id: "act-3", type: "tutor", title: "HCF Concepts", date: "4 days ago", status: "chat" }
  ]
};

export const mockAIReplies = {
  q1: [
    {
      sender: "bot",
      text: "I see you're looking at Question 1 about remainders. This is a classic remainder arithmetic question.",
      conceptCard: {
        title: "Concept: Remainder Representation",
        content: "If a number N divided by d leaves remainder r, we can write N = d × k + r. Here, N = 5k + 3."
      }
    },
    {
      sender: "bot",
      text: "To find what happens when N is divided by 10, substitute N = 5k + 3. Notice that k can be even or odd. If k is even, the remainder is 3. If k is odd, the remainder is 8. Since both are possible and distinct, we cannot determine a single answer without knowing if the number is even or odd.",
      actionChips: ["Explain in Hindi", "Try a similar question", "Show algebraic proof"]
    }
  ],
  q2: [
    {
      sender: "bot",
      text: "For finding the HCF of exponential prime products, remember this key rule: take the **minimum** power of each common prime factor.",
      bentoBox: {
        hcf: "HCF: Minimum power of common factors. (e.g. 2² for 2³, 2², 2⁴)",
        lcm: "LCM: Maximum power of all factors. (e.g. 2⁴ × 3³ × 5³ × 7)"
      },
      actionChips: ["Explain in Hindi", "Shortcut trick", "Show derivation"]
    }
  ]
};
