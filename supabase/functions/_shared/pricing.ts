export const bundles = {
  standard_4: { tier: 'standard', sessions: 4, priceEnv: 'STRIPE_MONTHLY_PRICE_STANDARD_4', amountCents: 14800, hourlyRateCents: 3700, tutorPayoutCents: 2405, apMarginCents: 1295 },
  standard_8: { tier: 'standard', sessions: 8, priceEnv: 'STRIPE_MONTHLY_PRICE_STANDARD_8', amountCents: 28000, hourlyRateCents: 3500, tutorPayoutCents: 2275, apMarginCents: 1225 },
  standard_12: { tier: 'standard', sessions: 12, priceEnv: 'STRIPE_MONTHLY_PRICE_STANDARD_12', amountCents: 39600, hourlyRateCents: 3300, tutorPayoutCents: 2145, apMarginCents: 1155 },
  test_prep_4: { tier: 'test_prep', sessions: 4, priceEnv: 'STRIPE_MONTHLY_PRICE_TEST_PREP_4', amountCents: 21200, hourlyRateCents: 5300, tutorPayoutCents: 3445, apMarginCents: 1855 },
  test_prep_8: { tier: 'test_prep', sessions: 8, priceEnv: 'STRIPE_MONTHLY_PRICE_TEST_PREP_8', amountCents: 40000, hourlyRateCents: 5000, tutorPayoutCents: 3250, apMarginCents: 1750 },
  test_prep_12: { tier: 'test_prep', sessions: 12, priceEnv: 'STRIPE_MONTHLY_PRICE_TEST_PREP_12', amountCents: 57600, hourlyRateCents: 4800, tutorPayoutCents: 3120, apMarginCents: 1680 },
  ap_direct_4: { tier: 'ap_direct', sessions: 4, priceEnv: 'STRIPE_MONTHLY_PRICE_AP_DIRECT_4', amountCents: 18800, hourlyRateCents: 4700, tutorPayoutCents: 0, apMarginCents: 4700 },
  ap_direct_8: { tier: 'ap_direct', sessions: 8, priceEnv: 'STRIPE_MONTHLY_PRICE_AP_DIRECT_8', amountCents: 35200, hourlyRateCents: 4400, tutorPayoutCents: 0, apMarginCents: 4400 },
  ap_direct_12: { tier: 'ap_direct', sessions: 12, priceEnv: 'STRIPE_MONTHLY_PRICE_AP_DIRECT_12', amountCents: 50400, hourlyRateCents: 4200, tutorPayoutCents: 0, apMarginCents: 4200 },
} as const;

export function getBundle(sku: unknown) {
  return typeof sku === 'string' ? bundles[sku as keyof typeof bundles] ?? null : null;
}
