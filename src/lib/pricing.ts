export type TutoringTier = "standard" | "test_prep" | "advanced";

export type BundleSku =
  | "standard_4"
  | "standard_8"
  | "standard_12"
  | "test_prep_4"
  | "test_prep_8"
  | "test_prep_12"
  | "advanced_4"
  | "advanced_8"
  | "advanced_12";

export type Bundle = {
  sku: BundleSku;
  tier: TutoringTier;
  tierLabel: string;
  name: string;
  sessions: number;
  price: number;
  walkInRate: number;
  hourlyRate: number;
  savings: number;
  featured?: boolean;
};

export const BUNDLES: Bundle[] = [
  { sku: "standard_4", tier: "standard", tierLabel: "Standard", name: "4-session bundle", sessions: 4, price: 148, walkInRate: 45, hourlyRate: 37, savings: 32 },
  { sku: "standard_8", tier: "standard", tierLabel: "Standard", name: "8-session bundle", sessions: 8, price: 280, walkInRate: 45, hourlyRate: 35, savings: 80, featured: true },
  { sku: "standard_12", tier: "standard", tierLabel: "Standard", name: "12-session bundle", sessions: 12, price: 396, walkInRate: 45, hourlyRate: 33, savings: 144 },
  { sku: "test_prep_4", tier: "test_prep", tierLabel: "Test Prep", name: "4-session bundle", sessions: 4, price: 292, walkInRate: 80, hourlyRate: 67, savings: 53 },
  { sku: "test_prep_8", tier: "test_prep", tierLabel: "Test Prep", name: "8-session bundle", sessions: 8, price: 560, walkInRate: 80, hourlyRate: 67, savings: 107, featured: true },
  { sku: "test_prep_12", tier: "test_prep", tierLabel: "Test Prep", name: "12-session bundle", sessions: 12, price: 816, walkInRate: 80, hourlyRate: 67, savings: 160 },
  { sku: "advanced_4", tier: "advanced", tierLabel: "Advanced Placement", name: "4-session bundle", sessions: 4, price: 188, walkInRate: 55, hourlyRate: 47, savings: 32 },
  { sku: "advanced_8", tier: "advanced", tierLabel: "Advanced Placement", name: "8-session bundle", sessions: 8, price: 352, walkInRate: 55, hourlyRate: 44, savings: 88, featured: true },
  { sku: "advanced_12", tier: "advanced", tierLabel: "Advanced Placement", name: "12-session bundle", sessions: 12, price: 504, walkInRate: 55, hourlyRate: 42, savings: 156 },
];

export const BUNDLES_BY_TIER = BUNDLES.reduce<Record<TutoringTier, Bundle[]>>(
  (acc, bundle) => {
    acc[bundle.tier].push(bundle);
    return acc;
  },
  { standard: [], test_prep: [], advanced: [] },
);

export const getBundle = (sku: string | null | undefined) =>
  BUNDLES.find((bundle) => bundle.sku === sku);

export const getPaymentLink = (sku: string | null | undefined) => {
  if (!sku) return "";
  const key = `VITE_STRIPE_LINK_${sku.toUpperCase()}`;
  // Official env var override, otherwise use built-in fallback links for convenience
  const envLink = String(import.meta.env[key] || "");
  if (envLink) return envLink;

  const FALLBACK_LINKS: Record<string, string> = {
    TEST_PREP_12: "https://buy.stripe.com/14AfZhazCfxMfIM9A90sU0d",
    TEST_PREP_8: "https://buy.stripe.com/cNi3cvbDG2L0bswdQp0sU0b",
    TEST_PREP_4: "https://buy.stripe.com/5kQ8wP4be99o2W08w50sU0c",
  };

  return FALLBACK_LINKS[sku.toUpperCase()] || "";
};
