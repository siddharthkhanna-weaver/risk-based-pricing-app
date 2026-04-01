// Base Rate Grid: customerProfile -> pricingProduct -> branchCategory -> rate
export const BASE_RATE_GRID = {
  'Formal Salaried': {
    'Home Loan': { 'Cat A': 10.99, 'Cat B': 11.25, 'Cat C': 11.50 },
    'Non Home Loan': { 'Cat A': 13.99, 'Cat B': 14.25, 'Cat C': 14.50 },
  },
  'Formal Salaried & (SE or IS)': {
    'Home Loan': { 'Cat A': 11.50, 'Cat B': 11.75, 'Cat C': 11.99 },
    'Non Home Loan': { 'Cat A': 14.99, 'Cat B': 15.25, 'Cat C': 15.50 },
  },
  'Self Employed': {
    'Home Loan': { 'Cat A': 11.99, 'Cat B': 12.25, 'Cat C': 12.50 },
    'Non Home Loan': { 'Cat A': 15.99, 'Cat B': 16.25, 'Cat C': 16.50 },
  },
  'SE & Informal Salaried': {
    'Home Loan': { 'Cat A': 12.50, 'Cat B': 12.75, 'Cat C': 12.99 },
    'Non Home Loan': null, // N/A
  },
  'Informal Salaried': {
    'Home Loan': { 'Cat A': 12.99, 'Cat B': 13.25, 'Cat C': 13.50 },
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
  { subProduct: 'HL - Top Up', condition: (amt) => amt <= 1000000, markup: 1.00, label: '≤ 10,00,000' },
  { subProduct: 'HL - Top Up', condition: (amt) => amt > 1000000, markup: 2.00, label: '> 10,00,000' },
  { subProduct: 'Plot + Construction', condition: (amt) => amt > 0, markup: 1.00, label: '> 0' },
  { subProduct: 'HL classified as NHL', condition: (amt) => amt > 0, markup: 0.50, label: '> 0' },
];

// Product Master
export const PRODUCT_MASTER = [
  { product: 'Home Loan', subProduct: 'Home Loan', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Extension / Improvement', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Home Loan - BT', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'Plot + Construction', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'OSL', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'HL - Top Up', pricingProduct: 'Home Loan' },
  { product: 'Home Loan', subProduct: 'HL classified as NHL', pricingProduct: 'Home Loan' },
  { product: 'Non Home Loan', subProduct: 'LAP', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'LAP - Top Up', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'LAP - BT', pricingProduct: 'Non Home Loan' },
  { product: 'Non Home Loan', subProduct: 'Non-Residential Premises (NRP)', pricingProduct: 'Non Home Loan' },
];

// Branch Categories
export const BRANCH_CATEGORIES = [
  { value: 'Cat A', label: 'Cat A' },
  { value: 'Cat B', label: 'Cat B' },
  { value: 'Cat C', label: 'Cat C' },
];

// Branch Master
export const BRANCH_MASTER = [
  { branch: 'Ahmedabad', category: 'Cat A' },
  { branch: 'Bangalore', category: 'Cat A' },
  { branch: 'Chennai', category: 'Cat A' },
  { branch: 'Delhi NCR', category: 'Cat A' },
  { branch: 'Delhi NSP', category: 'Cat A' },
  { branch: 'Faridabad', category: 'Cat A' },
  { branch: 'Ghaziabad', category: 'Cat A' },
  { branch: 'Gurgaon', category: 'Cat A' },
  { branch: 'Hyderabad', category: 'Cat A' },
  { branch: 'Indore', category: 'Cat A' },
  { branch: 'Jaipur', category: 'Cat A' },
  { branch: 'Kalyan', category: 'Cat A' },
  { branch: 'Laxmi Nagar', category: 'Cat A' },
  { branch: 'Lucknow', category: 'Cat A' },
  { branch: 'Noida', category: 'Cat A' },
  { branch: 'Panvel', category: 'Cat A' },
  { branch: 'Pune', category: 'Cat A' },
  { branch: 'Sahakarnagar', category: 'Cat A' },
  { branch: 'Vijayawada', category: 'Cat A' },
  { branch: 'Vijaywada', category: 'Cat A' },
  { branch: 'Virar', category: 'Cat A' },
  { branch: 'Agra', category: 'Cat B' },
  { branch: 'Bhopal', category: 'Cat B' },
  { branch: 'Coimbatore', category: 'Cat B' },
  { branch: 'Dehradun', category: 'Cat B' },
  { branch: 'Gwalior', category: 'Cat B' },
  { branch: 'Hisar', category: 'Cat B' },
  { branch: 'Jodhpur', category: 'Cat B' },
  { branch: 'Kanpur', category: 'Cat B' },
  { branch: 'Karnal', category: 'Cat B' },
  { branch: 'Kolhapur', category: 'Cat B' },
  { branch: 'Kurukshetra', category: 'Cat B' },
  { branch: 'Madurai', category: 'Cat B' },
  { branch: 'Mahbubnagar', category: 'Cat B' },
  { branch: 'Manesar', category: 'Cat B' },
  { branch: 'Meerut', category: 'Cat B' },
  { branch: 'Nagpur', category: 'Cat B' },
  { branch: 'Nashik', category: 'Cat B' },
  { branch: 'Nellore', category: 'Cat B' },
  { branch: 'Nizamabad', category: 'Cat B' },
  { branch: 'Panipat', category: 'Cat B' },
  { branch: 'Raipur', category: 'Cat B' },
  { branch: 'Rajahmundry', category: 'Cat B' },
  { branch: 'Rajkot', category: 'Cat B' },
  { branch: 'Surat', category: 'Cat B' },
  { branch: 'Suryapet', category: 'Cat B' },
  { branch: 'Tiruchirappalli', category: 'Cat B' },
  { branch: 'Udaipur', category: 'Cat B' },
  { branch: 'Vadodara', category: 'Cat B' },
  { branch: 'Varanasi', category: 'Cat B' },
  { branch: 'Visakhapatnam', category: 'Cat B' },
  { branch: 'Warangal', category: 'Cat B' },
  { branch: 'Zirakpur', category: 'Cat B' },
  { branch: 'Ahmednagar', category: 'Cat C' },
  { branch: 'Ajmer', category: 'Cat C' },
  { branch: 'Ambala', category: 'Cat C' },
  { branch: 'Amravati', category: 'Cat C' },
  { branch: 'Amreli', category: 'Cat C' },
  { branch: 'Aurangabad', category: 'Cat C' },
  { branch: 'Ayodhya', category: 'Cat C' },
  { branch: 'Azamgarh', category: 'Cat C' },
  { branch: 'Banswara', category: 'Cat C' },
  { branch: 'Baran', category: 'Cat C' },
  { branch: 'Belgaum', category: 'Cat C' },
  { branch: 'Bharuch', category: 'Cat C' },
  { branch: 'Bhavnagar', category: 'Cat C' },
  { branch: 'Bhilwara', category: 'Cat C' },
  { branch: 'Bikaner', category: 'Cat C' },
  { branch: 'Bilaspur', category: 'Cat C' },
  { branch: 'Bulandshahr', category: 'Cat C' },
  { branch: 'Chamarajanagar', category: 'Cat C' },
  { branch: 'Chhindwara', category: 'Cat C' },
  { branch: 'Chittorgarh', category: 'Cat C' },
  { branch: 'Dabra', category: 'Cat C' },
  { branch: 'Deesa', category: 'Cat C' },
  { branch: 'Deoli', category: 'Cat C' },
  { branch: 'Eluru', category: 'Cat C' },
  { branch: 'Godhra', category: 'Cat C' },
  { branch: 'Gorakhpur', category: 'Cat C' },
  { branch: 'Guna', category: 'Cat C' },
  { branch: 'Haridwar', category: 'Cat C' },
  { branch: 'Himmatnagar', category: 'Cat C' },
  { branch: 'Hosur', category: 'Cat C' },
  { branch: 'Hubali', category: 'Cat C' },
  { branch: 'Jabalpur', category: 'Cat C' },
  { branch: 'Jalgaon', category: 'Cat C' },
  { branch: 'Jalna', category: 'Cat C' },
  { branch: 'Jaunpur', category: 'Cat C' },
  { branch: 'Jhalawar', category: 'Cat C' },
  { branch: 'Jhansi', category: 'Cat C' },
  { branch: 'Kakinada', category: 'Cat C' },
  { branch: 'Kareem Nagar', category: 'Cat C' },
  { branch: 'Khammam', category: 'Cat C' },
  { branch: 'Kota', category: 'Cat C' },
  { branch: 'Mandsaur', category: 'Cat C' },
  { branch: 'Mathura', category: 'Cat C' },
  { branch: 'Mehsana', category: 'Cat C' },
  { branch: 'Mysore', category: 'Cat C' },
  { branch: 'Nagaur', category: 'Cat C' },
  { branch: 'Narsinghpur', category: 'Cat C' },
  { branch: 'Neem Ka Thana', category: 'Cat C' },
  { branch: 'Neemuch', category: 'Cat C' },
  { branch: 'Nimbahera', category: 'Cat C' },
  { branch: 'Pondicherry', category: 'Cat C' },
  { branch: 'Prayagraj', category: 'Cat C' },
  { branch: 'Ramanagara', category: 'Cat C' },
  { branch: 'Ratlam', category: 'Cat C' },
  { branch: 'Rewa', category: 'Cat C' },
  { branch: 'Rohtak', category: 'Cat C' },
  { branch: 'Roorkee', category: 'Cat C' },
  { branch: 'Rudrapur', category: 'Cat C' },
  { branch: 'Sagar', category: 'Cat C' },
  { branch: 'Saharanpur', category: 'Cat C' },
  { branch: 'Salem', category: 'Cat C' },
  { branch: 'Sangli', category: 'Cat C' },
  { branch: 'Satara', category: 'Cat C' },
  { branch: 'Satna', category: 'Cat C' },
  { branch: 'Shahpura', category: 'Cat C' },
  { branch: 'Sonipat', category: 'Cat C' },
  { branch: 'Surendranagar', category: 'Cat C' },
  { branch: 'Thiruvallur', category: 'Cat C' },
  { branch: 'Tirupathi', category: 'Cat C' },
  { branch: 'Tirupattur', category: 'Cat C' },
  { branch: 'Ujjain', category: 'Cat C' },
  { branch: 'Vellore', category: 'Cat C' },
  { branch: 'Vidisha', category: 'Cat C' },
  { branch: 'Vizianagaram', category: 'Cat C' },
  { branch: 'Yamuna Nagar', category: 'Cat C' },
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
