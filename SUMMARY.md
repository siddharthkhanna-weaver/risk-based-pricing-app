# Risk Based Pricing Calculator - Phase 1

## Overview
A frontend-only React (Vite) calculator for the PeopleHome Enterprise Portal that determines the Rate of Interest (ROI) for loan deals using:

**Final ROI = Base Rate + Risk Add-On (capped at 2%) + Special Product Pricing**

## Screens
1. **Login** — OTP-based with default credentials:
   - Email: `credit.manager@peoplehome.com`
   - OTP: `1234`
2. **Dashboard** — "New Deal Calculation" action card
3. **New Deal Calculation** — Full calculator form with:
   - Case Details (Deal Number, Applicant Name, Loan Amount, Product, Sub-Product, Branch Category)
   - Borrower Details (Customer Profile, NTC toggle, CRIF Score, Income, Policy Deviations, Property Location, LTV Deviation)
   - Add/remove co-applicants
   - Calculate ROI with full validation
   - ROI Result card with complete breakdown
   - Finalize ROI to lock the deal (in-memory only)

## Calculation Logic (per PRD)
- **Base Rate** — Looked up from a 5×6 grid (Customer Profile × Branch Category × Pricing Product). Special case: "Home Loan - Top Up" uses user-entered HL ROI.
- **R0** — Credit score selection: uses the borrower with the highest income.
- **R1** — Credit score risk bands: -0.25% (≥800), 0.00% (750–799), +0.50% (676–749 / NTC), +1.50% (≤675).
- **R2** — Policy deviations (additive across all borrowers): Bank Salaried without statutory (+0.50%), Deviation on FOIR (+0.50%), Non-Listed Credit / Property Deviation (+1.00%).
- **R3** — Property location: Within MC Limits (-0.25%), Beyond MC Limits (+0.50%), Deviation of LTV (+0.50%).
- **Risk Add-On Cap** — Total of R1 + R2 + R3 is capped at 2.00%.
- **Special Product Pricing** — Sub-product specific markups: HL Top Up ≤10L (+1.00%), HL Top Up >10L (+2.00%), Plot + Construction (+2.00%), HL classified as NHL (+0.50%).
- **Customer Profile Resolution** — Resolved across all borrowers (Formal Salaried, Formal & SE/IS, Self Employed, SE & Informal Salaried, Informal Salaried).

## Phase 1 Scope
- Frontend-only (no backend, no database)
- All pricing rules and grids maintained in `src/data/pricingRules.js`
- No master/rules configuration panel
- No data persistence — deals exist only in current session
- Default hardcoded login credentials

## Tech Stack
- React 19 + Vite
- React Router DOM
- Plain CSS (no UI framework)

## Project Structure
```
src/
├── data/
│   └── pricingRules.js       # All grids, rules, product master, constants
├── utils/
│   └── calculator.js          # ROI calculation engine
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── NewDeal.jsx            # Main calculator page
├── components/
│   ├── BorrowerForm.jsx       # Reusable borrower input form
│   └── ROIResult.jsx          # ROI breakdown display
├── styles/
│   ├── App.css                # Global styles & shared components
│   ├── Login.css
│   ├── Dashboard.css
│   ├── NewDeal.css
│   └── ROIResult.css
├── App.jsx                    # Router & layout
├── main.jsx                   # Entry point
└── index.css
```

## How to Run
```bash
cd risk-based-pricing-app
npm install
npm run dev
```
