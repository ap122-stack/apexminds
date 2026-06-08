# AP Tutoring

Premium tutoring website with a Stripe-style monthly package checkout, Framer Motion interactions, Supabase Edge Functions, and session/payout tracking foundations.

## Current build

- Checkout-first website, not a generic landing page
- Stripe-inspired split payment page
- Framer Motion UI polish and responsive animation states
- Tier selector: Standard, Test Prep, AP Direct
- Plus/minus package selector for 4, 8, or 12 sessions/month
- 8 sessions/month is the recommended default
- Stripe subscription Checkout handoff
- Admissions consulting is inquiry-only
- Supabase schema/functions for clients, purchases, bookings, and payout tracking
- Google Stitch project/design system created separately for AI design iteration

## Design direction

This repo uses a premium fintech/private-coaching style: clean split pane, large price hierarchy, precise borders, restrained color, and motion that supports clarity instead of decoration. 21st.dev is best treated as a component/pattern reference for future shadcn/Tailwind upgrades; the current app stays lightweight and deploy-safe with custom CSS and Framer Motion.

## Required environment variables

Frontend:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_CAL_STANDARD_URL=
VITE_CAL_TEST_PREP_URL=
VITE_CAL_AP_DIRECT_URL=
```

Supabase function secrets:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SITE_URL=
RESEND_API_KEY=
FROM_EMAIL=
CAL_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_STANDARD_4=price_1TfvReI3oMAvo1GDNESS0Ot5
STRIPE_MONTHLY_PRICE_STANDARD_8=price_1TfvReI3oMAvo1GD2H3RFUxB
STRIPE_MONTHLY_PRICE_STANDARD_12=price_1TfvRfI3oMAvo1GDfHPtyKUX
STRIPE_MONTHLY_PRICE_TEST_PREP_4=price_1TfvRfI3oMAvo1GDuG5x25wu
STRIPE_MONTHLY_PRICE_TEST_PREP_8=price_1TfvRgI3oMAvo1GD2KaYLOVs
STRIPE_MONTHLY_PRICE_TEST_PREP_12=price_1TfvRgI3oMAvo1GDe3eLukmY
STRIPE_MONTHLY_PRICE_AP_DIRECT_4=price_1TfvRhI3oMAvo1GDP7tUr99q
STRIPE_MONTHLY_PRICE_AP_DIRECT_8=price_1TfvRhI3oMAvo1GDiby3JBOD
STRIPE_MONTHLY_PRICE_AP_DIRECT_12=price_1TfvRiI3oMAvo1GDRoiUykvB
```

## Stripe Dashboard notes

Hosted Checkout controls the payment UI. Apple Pay, Cash App Pay, Affirm, and other methods are enabled from Stripe Dashboard payment method settings and may require domain verification. The code already sends users to Stripe Checkout in subscription mode with promo codes, phone collection, billing address auto, and the latest configured Stripe API header.
