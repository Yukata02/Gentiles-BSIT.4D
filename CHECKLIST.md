# Instructor acceptance checklist

IT415 – Touchscreen Point of Sale (POS) Kiosk System  
App: **Campus Store POS** (`index.html`)

Mark **Done** when the live demo matches the expected result. GitHub rows stay blank until the group fills in real evidence.

## Required transaction flow

| Step | Screen / action | Expected | Done |
| --- | --- | --- | --- |
| 1 | Item Selection | Tap products and adjust quantities | [x] |
| 2 | Order / Payment Summary | Review the complete order | [x] |
| 3 | Payment Method | Cash, QR Payment, Credit/Debit Card | [x] |
| 4 | Payment Processing | Validate and complete the selected payment | [x] |
| 5 | Payment Successful | Confirmation and a transaction number | [x] |
| 6 | Receipt | Display the completed transaction | [x] |
| 7 | New Transaction | Reset and return to Item Selection | [x] |

Sequence: **Select Items → Review Order → Select Payment Method → Complete Payment → View Receipt → Start New Transaction**

## Required functionality

| # | Requirement | How this app meets it | Done |
| --- | --- | --- | --- |
| 1 | At least six selectable products | Coffee, Sandwich, Soft Drink, Cookies, Bottled Water, Chocolate | [x] |
| 2 | Select by tapping / clicking | Large product cards | [x] |
| 3 | Quantity adjustment | − and + on the cart | [x] |
| 4 | Removal of products | Remove on each cart line | [x] |
| 5 | Automatic item subtotals | Subtotal = unit price × quantity | [x] |
| 6 | Automatic transaction total | Total = sum of subtotals | [x] |
| 7 | Order Summary | Screen 2 lists names, qty, unit prices, subtotals, total | [x] |
| 8 | Return and modify the order | Back from summary keeps the cart | [x] |
| 9 | At least three payment methods | Cash, QR Payment, Credit/Debit Card | [x] |
| 10 | Process Cash | Amount-paid input, keypad, Pay Now | [x] |
| 11 | Validate insufficient Cash | Stays on payment; message with minimum due | [x] |
| 12 | Calculate correct change | Change = amount paid − total | [x] |
| 13 | Simulate QR | QR placeholder, scan instruction, Confirm Payment | [x] |
| 14 | Simulate Credit/Debit Card | Tap/insert/swipe text, Process Payment, Processing payment… | [x] |
| 15 | Payment Successful confirmation | Amount, amount paid, method, reference, View Receipt | [x] |
| 16 | Transaction number | Unique `TXN-YYYY-#####` per completed sale | [x] |
| 17 | Digital receipt | Items, qty × unit price, subtotals, total, method, amount paid, change, status | [x] |
| 18 | Start a new transaction | New Transaction on the receipt | [x] |
| 19 | Proper reset | Cart, payment fields, previous receipt, and totals are cleared | [x] |
| 20 | Meaningful user feedback | Toasts and on-screen payment errors | [x] |

## Touchscreen interface

| Requirement | Done |
| --- | --- |
| Large buttons and item cards | [x] |
| Readable text and spacing | [x] |
| Clear Back and Continue | [x] |
| Minimal typing (tap products; cash keypad) | [x] |
| No tiny links, complex menus, or required product-name typing | [x] |
| Looks like a kiosk, not a desktop-only form | [x] |

## User feedback

| Message / behavior | When | Done |
| --- | --- | --- |
| Product added | Item tapped | [x] |
| Item removed | Remove or qty to 0 | [x] |
| Invalid quantity | Quantity would go negative | [x] |
| Insufficient stock | Qty would exceed stock | [x] |
| Invalid payment | Blank, invalid, or negative cash | [x] |
| Insufficient payment. Please enter at least ₱… | Cash below total | [x] |
| Transaction completed successfully | Payment accepted | [x] |
| Incomplete / invalid payment does not create a receipt | Cash reject stays on payment | [x] |

## Instructor tests — selection and order

Use sample prices, or equivalent math with the same products.

| Test | Action | Pass condition | Done |
| --- | --- | --- | --- |
| 1. Startup and touch selection | Open the app. Tap product cards. | App runs. Six products show names and prices. Large controls. No typing of product names. | [x] |
| 2. Add multiple products | Coffee × 2 (₱45), Sandwich × 1 (₱50), Soft Drink × 1 (₱35) | Subtotals ₱90, ₱50, ₱35. Total ₱175. | [x] |
| 3. Quantity controls | Increase Coffee 2 → 3, then back to 2 | Coffee subtotal ₱135, total ₱220; then total ₱175. Quantity never negative. | [x] |
| 4. Remove item | Remove Soft Drink from the ₱175 order | Soft Drink gone. Total ₱140. | [x] |
| 5. Order Summary | Continue to Order Summary | Coffee ₱90, Sandwich ₱50, total ₱140. Qty, unit prices, and subtotals match Item Selection. | [x] |
| 6. Back navigation | Back from Order Summary | Returns to Item Selection with the same items and quantities. | [x] |
| 7. Payment Method | Continue to Payment | Cash, QR Payment, and Credit/Debit Card as large buttons. | [x] |

## Instructor tests — payment and receipt

| Test | Action | Pass condition | Done |
| --- | --- | --- | --- |
| 8. Insufficient Cash | Total ₱140, Cash, enter ₱100, Pay Now | Rejected with a clear message. Remain on payment. No success screen or receipt. | [x] |
| 9. Successful Cash | Same ₱140 order, enter ₱200 | Change ₱60. Payment Successful. Exact cash (₱140) also valid with ₱0.00 change. | [x] |
| 10. Confirmation | Inspect success screen | Transaction amount, payment method, transaction number, View Receipt. | [x] |
| 11. Receipt | View Receipt after Cash | Reference, items, qty or unit prices, total ₱140, amount paid ₱200, change ₱60, method Cash, status Payment Successful. | [x] |
| 12. QR Payment | New Transaction, add items, QR, Confirm Payment | Amount, QR placeholder, Confirm Payment. Receipt method = QR Payment. Amount paid = total. Change ₱0.00. | [x] |
| 13. Card Payment | New Transaction, Credit/Debit Card, Process Payment | Tap/insert/swipe instruction and Processing payment…. Receipt method = Credit/Debit Card. Amount paid = total. Change ₱0.00. | [x] |
| 14. New Transaction | New Transaction from receipt | Item Selection. Cart empty. Total ₱0. Previous order and payment details gone. | [x] |
| 15. Transaction number | Complete two different transactions | Different references, e.g. TXN-2026-00001 and TXN-2026-00002. | [x] |

## Sample complete-sale numbers (exam example)

| Line | Computation | Subtotal |
| --- | --- | --- |
| Coffee × 2 | 2 × ₱45.00 | ₱90.00 |
| Sandwich × 1 | 1 × ₱50.00 | ₱50.00 |
| Soft Drink × 1 | 1 × ₱35.00 | ₱35.00 |
| **TOTAL** | | **₱175.00** |

Cash ₱200.00 → change ₱25.00. Receipt must show those three lines, total ₱175.00, method Cash, amount paid ₱200.00, change ₱25.00.

## Data and technology (explain at demo)

| Choice | Why it is appropriate | Done |
| --- | --- | --- |
| HTML, CSS, JavaScript | Kiosk UI with no build step | [x] |
| `data/products.json` plus in-script fallback | Easy to edit catalog; still runs if fetch is blocked | [x] |
| `localStorage` for TXN sequence only | Unique references without a database | [x] |
| Cart and payment in memory | Cleared on New Transaction | [x] |

Database is not required by this exam unless the instructor separately requires it.

## Optional extras (do not replace required features)

| Extra | Status |
| --- | --- |
| Cash keypad | Included |
| Remaining stock on cards | Included |
| Block qty above stock | Included |
| Toast feedback | Included |
| Product categories / search / discounts / admin / print | Not required |

Inventory deduction after payment is **not** implemented (optional). Rejected cash payments therefore cannot reduce stock.

## AI documentation

| Item | Location | Done |
| --- | --- | --- |
| Prompts used | `AI_DOCUMENTATION.md` | [x] |
| Evaluation of AI output | `AI_DOCUMENTATION.md` | [x] |
| Changes made after AI output | `AI_DOCUMENTATION.md` | [x] |

## GitHub version control

| Item | Evidence (name / URL) | Done |
| --- | --- | --- |
| Repository | https://github.com/Yukata02/Gentiles-BSIT.4D | [x] |
| Commits | https://github.com/Yukata02/Gentiles-BSIT.4D/commits/main | [x] |
| Feature branches | https://github.com/Yukata02/Gentiles-BSIT.4D/branches | [x] |
| Pull request(s) | Create from each `feature/*` branch on GitHub if the instructor requires PR screenshots | [ ] |
| Review | Review each PR before merge | [ ] |
| Merge | Merge commits on `main` after the four feature branches | [x] |

| Member name | GitHub username | Branch / PR | Contribution |
| --- | --- | --- | --- |
| Yukata02 | Yukata02 | `feature/item-selection` | Kiosk UI, products, cart, quantities |
| Gentiles-Review | Gentiles-Review | `feature/order-summary` | Order summary and back navigation |
| Gentiles-Pay | Gentiles-Pay | `feature/payment` | Cash / QR / card payment |
| Gentiles-Receipt | Gentiles-Receipt | `feature/receipt-and-docs` | Receipt, reset, docs, hosting |
