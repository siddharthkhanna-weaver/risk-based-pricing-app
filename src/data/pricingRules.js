// Base Rate Grid: customerProfile -> pricingProduct -> branchCategory -> rate
export const BASE_RATE_GRID = {
  'Formal Salaried': {
    'Home Loan': { 'Cat A': 12.00, 'Cat B': 12.25, 'Cat C': 12.50 },
    'Non Home Loan': { 'Cat A': 15.00, 'Cat B': 15.25, 'Cat C': 15.50 },
  },
  'Formal Salaried & (SE or IS)': {
    'Home Loan': { 'Cat A': 12.50, 'Cat B': 12.75, 'Cat C': 13.00 },
    'Non Home Loan': { 'Cat A': 16.50, 'Cat B': 16.75, 'Cat C': 17.00 },
  },
  'Self Employed': {
    'Home Loan': { 'Cat A': 13.25, 'Cat B': 13.50, 'Cat C': 13.75 },
    'Non Home Loan': { 'Cat A': 18.00, 'Cat B': 18.25, 'Cat C': 18.50 },
  },
  'SE & Informal Salaried': {
    'Home Loan': { 'Cat A': 13.75, 'Cat B': 14.00, 'Cat C': 14.25 },
    'Non Home Loan': null, // N/A
  },
  'Informal Salaried': {
    'Home Loan': { 'Cat A': 14.00, 'Cat B': 14.25, 'Cat C': 14.50 },
    'Non Home Loan': null, // N/A
  },
};

// R1 - Credit Score Risk Bands
export const R1_BANDS = [
  { label: '≥ 800', min: 800, max: 900, addon: -0.25 },
  { label: '750 – 799', min: 750, max: 799, addon: 0.00 },
  { label: '676 – 749 / NTC / NTB', min: 676, max: 749, addon: 0.50 },
  { label: '≤ 675', min: 300, max: 675, addon: 1.50 },
];

export const R1_NTC_ADDON = 0.50;

// R2 - Policy Deviation Add-ons
export const R2_DEVIATIONS = [
  { key: 'bankSalariedWithoutStatutory', label: 'Bank Salaried without statutory deductions', addon: 0.50 },
  { key: 'deviationOnFOIR', label: 'Deviation on FOIR', addon: 0.50 },
  { key: 'nonListedCreditPropertyDeviation', label: 'Non-Listed Credit / Property Deviation', addon: 1.00 },
];

// R3 - Property Location Risk
export const R3_PROPERTY_LOCATION = {
  'Within MC Limits': -0.25,
  'Beyond MC Limits': 0.50,
};

export const R3_LTV_DEVIATION_ADDON = 0.50;

// Risk Add-On Cap
export const RISK_ADDON_CAP = 2.00;

// Special Product Pricing
export const SPECIAL_PRICING_RULES = [
  { subProduct: 'Home Loan - Top Up', condition: (amt) => amt <= 1000000, markup: 1.00, label: '≤ 10,00,000' },
  { subProduct: 'Home Loan - Top Up', condition: (amt) => amt > 1000000, markup: 2.00, label: '> 10,00,000' },
  { subProduct: 'Plot + Construction', condition: (amt) => amt > 0, markup: 2.00, label: '> 0' },
  { subProduct: 'Home Loan classified as NHL', condition: (amt) => amt > 0, markup: 0.50, label: '> 0' },
];

// Product Master
export const PRODUCT_MASTER = [
  { product: 'Home Loan', subProduct: 'Home Loan', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Extension / Improvement', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Home Loan - BT', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Plot + Construction', pricingProduct: 'Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Loan against Property', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Loan against Property - Top Up', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Loan against Property - BT', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Other Secured Loan', pricingProduct: 'Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Home Loan - Top Up', pricingProduct: 'Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Home Loan classified as NHL', pricingProduct: 'Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Non-Residential Premises (NRP)', pricingProduct: 'Non Home Loan' },
];

// Branch Categories
export const BRANCH_CATEGORIES = [
  { value: 'Cat A', label: 'Cat A - Metro / Tier-1' },
  { value: 'Cat B', label: 'Cat B - Tier-2' },
  { value: 'Cat C', label: 'Cat C - Tier-3 / Rural' },
];

// Customer Profile front-end labels
export const CUSTOMER_PROFILES = [
  { value: 'Bank Salaried', label: 'Bank Salaried', internal: 'Formal Salaried' },
  { value: 'Cash Salaried', label: 'Cash Salaried', internal: 'Informal Salaried' },
  { value: 'Self Employed', label: 'Self Employed', internal: 'Self Employed' },
];

// Default login credentials
export const DEFAULT_CREDENTIALS = {
  email: 'credit.manager@peoplehome.com',
  otp: '1234',
  name: 'Credit Manager',
  role: 'Credit Manager',
};
