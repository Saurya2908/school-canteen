# Prompts used with LLMs (for transparency)

1. "Generate an Express + Mongoose project implementing three models: Student, Snack, Order with Mongoose middleware pre-save for Student to generate referralCode, pre-validate for Order to compute payableAmount and validate quantity, and post-save for Order to update Snack.ordersCount and Student.totalSpent. Include routes /students POST, /snacks/seed and /snacks GET, /orders POST and /students/:id GET. Provide robust error handling and README."

2. "Write a generateReferralCode utility that produces 'EDZ' + 5 alphanumeric uppercase characters."

3. "Create middleware to centralize mongoose ValidationError handling and duplicate index (11000) handling."


