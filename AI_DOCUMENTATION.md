# AI documentation (IT415)

This file records AI-assisted development for the Campus Store POS kiosk.

## Prompts used

1. Create the application described in `e:\njnn\IT415_Practical_Exam.pdf` (Touchscreen POS Kiosk).
2. Implement the required screens: item selection, order summary, cash / QR / card payment, success, receipt, and new transaction reset.
3. Match instructor tests for quantities, insufficient cash, change, unique transaction numbers, and receipt fields.

## AI output evaluation

The generated UI was kept because it uses large tap targets, a clear kiosk flow, and peso formatting. Payment logic was checked against the exam:

- Subtotal = unit price × quantity  
- Total = sum of subtotals  
- Cash change = amount paid − total  
- Insufficient cash stays on the payment screen  
- QR and card simulations use amount paid = total and change = ₱0.00  
- New Transaction clears cart and previous payment details  

## Modifications after AI output

- Cash keypad stores whole pesos (enter `200` for ₱200.00), matching instructor tests.  
- Product JSON plus an in-script fallback so the kiosk still runs if `fetch` is blocked.  
- Unique `TXN-YYYY-#####` sequence stored in `localStorage`.  
- Stock limit toasts (`Insufficient stock`) as an optional exam enhancement.  
