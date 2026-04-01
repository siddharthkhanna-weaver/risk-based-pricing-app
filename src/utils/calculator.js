import {
  BASE_RATE_GRID,
  R1_BANDS,
  R1_NTC_ADDON,
  R2_DEVIATIONS,
  R3_PROPERTY_LOCATION,
  R3_LTV_DEVIATION_ADDON,
  RISK_ADDON_CAP,
  SPECIAL_PRICING_RULES,
  PRODUCT_MASTER,
  CUSTOMER_PROFILES,
} from '../data/pricingRules';

// Map front-end label to internal profile name
function toInternal(profileLabel) {
  const found = CUSTOMER_PROFILES.find((p) => p.value === profileLabel);
  return found ? found.internal : profileLabel;
}

// Resolve combined customer profile across all borrowers
export function resolveCustomerProfile(borrowers) {
  const internals = new Set(borrowers.map((b) => toInternal(b.customerProfile)));

  const hasFormal = internals.has('Formal Salaried');
  const hasSE = internals.has('Self Employed');
  const hasInformal = internals.has('Informal Salaried');

  if (hasFormal && !hasSE && !hasInformal) return 'Formal Salaried';
  if (hasFormal && (hasSE || hasInformal)) return 'Formal Salaried & (SE or IS)';
  if (hasSE && !hasFormal && !hasInformal) return 'Self Employed';
  if (hasSE && hasInformal && !hasFormal) return 'SE & Informal Salaried';
  if (hasInformal && !hasFormal && !hasSE) return 'Informal Salaried';

  return 'Formal Salaried'; // fallback
}

// Get the pricing product from the product master
export function getPricingProduct(product, subProduct) {
  const entry = PRODUCT_MASTER.find(
    (p) => p.product === product && p.subProduct === subProduct
  );
  return entry ? entry.pricingProduct : 'Home Loan';
}

// Get the base rate
export function getBaseRate(resolvedProfile, branchCategory, pricingProduct) {
  const profileGrid = BASE_RATE_GRID[resolvedProfile];
  if (!profileGrid) return { rate: null, source: 'Profile not found', error: true };

  const productGrid = profileGrid[pricingProduct];
  if (!productGrid) {
    return {
      rate: null,
      source: `${resolvedProfile} is not eligible for ${pricingProduct} pricing`,
      error: true,
    };
  }

  const rate = productGrid[branchCategory];
  if (rate === undefined) return { rate: null, source: 'Branch category not found', error: true };

  return { rate, source: `Grid: ${resolvedProfile} × ${pricingProduct} × ${branchCategory}` };
}

// R0: Select the borrower with the worst (lowest) credit score among those with income > 0
// NTC is treated as lowest credit score
export function selectR0Borrower(borrowers) {
  const eligible = borrowers.filter((b) => parseFloat(b.income) > 0);
  if (eligible.length === 0) return borrowers[0];

  let worstAddon = -Infinity;
  let selected = eligible[0];
  for (const b of eligible) {
    const r1 = calculateR1(b);
    if (r1.addon > worstAddon) {
      worstAddon = r1.addon;
      selected = b;
    }
  }
  return selected;
}

// R1: Credit Score Risk Band
export function calculateR1(borrower) {
  if (borrower.newToCredit) {
    return { addon: R1_NTC_ADDON, label: 'NTC / NTB', score: 'N/A' };
  }

  const score = parseInt(borrower.crifScore);
  if (score >= -50 && score <= 300) {
    return { addon: R1_NTC_ADDON, label: 'NTC / NTB', score };
  }

  for (const band of R1_BANDS) {
    if (score >= band.min && score <= band.max) {
      return { addon: band.addon, label: band.label, score };
    }
  }
  return { addon: 0, label: 'Unknown', score };
}

// R2: Policy Deviations (common, deal-level)
export function calculateR2(policyDeviations) {
  let total = 0;
  const details = [];

  for (const dev of R2_DEVIATIONS) {
    if (policyDeviations?.[dev.key]) {
      total += dev.addon;
      details.push({ label: dev.label, addon: dev.addon });
    }
  }

  return { addon: total, details };
}

// R3: Property Location + LTV (common, deal-level)
export function calculateR3(propertyLocation, ltvDeviation) {
  const details = [];

  const locationAddon = R3_PROPERTY_LOCATION[propertyLocation] ?? 0;
  details.push({ label: `Property: ${propertyLocation}`, addon: locationAddon });

  let ltvAddon = 0;
  if (ltvDeviation) {
    ltvAddon = R3_LTV_DEVIATION_ADDON;
    details.push({ label: 'Deviation of LTV', addon: ltvAddon });
  }

  return { addon: locationAddon + ltvAddon, details };
}

// Special Product Pricing
export function getSpecialPricing(subProduct, loanAmount) {
  const rule = SPECIAL_PRICING_RULES.find(
    (r) => r.subProduct === subProduct && r.condition(loanAmount)
  );
  if (rule) {
    return { markup: rule.markup, label: `${subProduct} (${rule.label})` };
  }
  return { markup: 0, label: 'None' };
}

// Main calculation function
export function calculateROI({
  borrowers,
  product,
  subProduct,
  branchCategory,
  loanAmount,
  policyDeviations,
  propertyLocation,
  ltvDeviation,
}) {
  // Resolve profile
  const resolvedProfile = resolveCustomerProfile(borrowers);
  const pricingProduct = getPricingProduct(product, subProduct);

  // Base Rate
  const baseResult = getBaseRate(resolvedProfile, branchCategory, pricingProduct);
  if (baseResult.error) {
    return { error: baseResult.source, resolvedProfile, pricingProduct };
  }

  // R0 - Select borrower
  const r0Borrower = selectR0Borrower(borrowers);
  const r0Label = `${r0Borrower.name || 'Applicant'} (highest income: ₹${Number(r0Borrower.income).toLocaleString('en-IN')})`;

  // R1
  const r1 = calculateR1(r0Borrower);

  // R2
  const r2 = calculateR2(policyDeviations);

  // R3
  const r3 = calculateR3(propertyLocation, ltvDeviation);

  // Risk Add-On total
  const uncappedRiskAddon = r1.addon + r2.addon + r3.addon;
  const riskAddonCapped = uncappedRiskAddon > RISK_ADDON_CAP;
  const riskAddon = riskAddonCapped ? RISK_ADDON_CAP : uncappedRiskAddon;

  // Special Pricing
  const specialPricing = getSpecialPricing(subProduct, loanAmount);

  // Final ROI
  const finalROI = baseResult.rate + riskAddon + specialPricing.markup;

  return {
    resolvedProfile,
    pricingProduct,
    baseRate: baseResult.rate,
    baseRateSource: baseResult.source,
    r0: r0Label,
    r1,
    r2,
    r3,
    uncappedRiskAddon,
    riskAddonCapped,
    riskAddon,
    specialPricing,
    finalROI,
  };
}
