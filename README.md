# Campus Store POS Kiosk

IT415 – Application Development and Emerging Technologies  
Practical examination: **Touchscreen Point of Sale (POS) Kiosk System**  
Group **Gentiles** · BSIT 4D

**GitHub:** https://github.com/Yukata02/Gentiles-BSIT.4D  
**Live system:** https://yukata02.github.io/Gentiles-BSIT.4D/

A self-service kiosk for a campus food and merchandise outlet. Customers tap large product cards, review the order, pay with Cash / QR / Card, then view a digital receipt.

## How to run

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
```

Then go to `http://localhost:8080`.

## Technology and storage

| Choice | Why it fits |
| --- | --- |
| HTML, CSS, JavaScript | Simple kiosk UI, no build step, easy to demonstrate |
| Product catalog in `data/products.json` | Easy to edit items and prices; JS fallback if the file cannot be fetched |
| `localStorage` | Stores only the yearly transaction sequence so each receipt gets a unique `TXN-YYYY-#####` |

A full database is not required for this kiosk. Cart and payment live in memory and are cleared on **New Transaction**.

## Transaction flow

1. **Item Selection** — tap products, use + / −, or Remove  
2. **Order / Payment Summary** — review lines and total; Back keeps the cart  
3. **Payment Method** — Cash, QR Payment, Credit/Debit Card  
4. **Payment Processing** — cash keypad + validation, simulated QR confirm, simulated card processing  
5. **Payment Successful** — amount, method, unique reference, View Receipt  
6. **Receipt** — items, totals, method, amount paid, change  
7. **New Transaction** — empty cart, no previous payment details  

Cash rejects blank, invalid, negative, and insufficient amounts and stays on the payment screen. Exact cash produces ₱0.00 change. QR and card set amount paid equal to the total and change to ₱0.00.

## Instructor checklist

Use **[CHECKLIST.md](CHECKLIST.md)** during demo. It lists the required 7-step flow, all 20 required functions, instructor tests 1–15, user-feedback messages, and GitHub / AI rows.

## Group contributions

See [TEAM.md](TEAM.md) for the four members, feature branches, and screenshot links.

## Optional extras included

- On-screen cash keypad (less typing on a kiosk)  
- Simple stock check (cannot order more than available stock)  
- Toast messages for add / remove / errors / success  
