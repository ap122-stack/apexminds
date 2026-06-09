const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error("Missing STRIPE_SECRET_KEY. Use a test key first.");
  process.exit(1);
}

const bundles = [
  ["standard_4", "Standard", 4, 14800, 3700, 32],
  ["standard_8", "Standard", 8, 28000, 3500, 80],
  ["standard_12", "Standard", 12, 39600, 3300, 144],
  ["test_prep_4", "Test Prep", 4, 26700, 6700, 53],
  ["test_prep_8", "Test Prep", 8, 53300, 6700, 107],
  ["test_prep_12", "Test Prep", 12, 80000, 6700, 160],
  ["ap_direct_4", "AP Direct", 4, 18800, 4700, 32],
  ["ap_direct_8", "AP Direct", 8, 35200, 4400, 88],
  ["ap_direct_12", "AP Direct", 12, 50400, 4200, 156],
];

async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Stripe-Version": "2026-02-25.clover",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data));
  return data;
}

for (const [sku, tier, sessions, amount, hourlyRate, savings] of bundles) {
  const product = await stripe("products", {
    name: `${tier} ${sessions}-Session Monthly Package`,
    description: `${sessions} one-on-one tutoring sessions for the month at $${hourlyRate / 100}/hr. Save $${savings}.`,
    [`metadata[sku]`]: sku,
    [`metadata[tier]`]: tier,
    [`metadata[sessions]`]: String(sessions),
  });

  const price = await stripe("prices", {
    product: product.id,
    currency: "usd",
    unit_amount: String(amount),
    lookup_key: sku,
    [`metadata[sku]`]: sku,
  });

  console.log(`STRIPE_PRICE_${sku.toUpperCase()}=${price.id}`);
}
