# AP Tutoring Deploy Checklist

## 1. Vercel

Run once on this machine:

```bash
vercel login
```

Then from this folder:

```bash
npx vercel deploy --prod
```

Production URL:

```text
https://ap-tutoring.vercel.app
```

Vercel env vars:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_CAL_STANDARD_URL=
VITE_CAL_TEST_PREP_URL=
VITE_CAL_AP_DIRECT_URL=
VITE_STRIPE_LINK_STANDARD_4=
VITE_STRIPE_LINK_STANDARD_8=
VITE_STRIPE_LINK_STANDARD_12=
VITE_STRIPE_LINK_TEST_PREP_4=https://buy.stripe.com/5kQ8wP4be99o2W08w50sU0c
VITE_STRIPE_LINK_TEST_PREP_8=https://buy.stripe.com/cNi3cvbDG2L0bswdQp0sU0b
VITE_STRIPE_LINK_TEST_PREP_12=https://buy.stripe.com/14AfZhazCfxMfIM9A90sU0d
VITE_STRIPE_LINK_AP_DIRECT_4=
VITE_STRIPE_LINK_AP_DIRECT_8=
VITE_STRIPE_LINK_AP_DIRECT_12=
VITE_STRIPE_LINK_ADMISSIONS_PACKAGE=https://buy.stripe.com/dRm14n0Z25Xc8gkbIh0sU0a
```

## 2. Supabase Function Secrets

Set these in Supabase, not Vercel frontend:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SITE_URL=https://your-vercel-domain
RESEND_API_KEY=
FROM_EMAIL=
CAL_WEBHOOK_SECRET=
```

Supabase CLI needs:

```bash
npx supabase login --token YOUR_SUPABASE_ACCESS_TOKEN
```

## 3. Microsoft Teams

Use Cal.com as the booking layer.

1. Connect AP's Microsoft calendar to Cal.com.
2. Set Cal.com video location to Microsoft Teams.
3. Create separate event types:
   - Standard Tutor
   - Test Prep Tutor
   - AP Direct
4. Put each event URL into the matching Vercel env var.
5. Add the Cal.com webhook URL to Supabase function `api-cal-webhook`.

## 4. Session Policy

- 12+ hour cancellation: usually return session credit.
- Under 12 hours: usually count session unless AP excuses it.
- No-show after 15 minutes: count session.
- Tutor cancels: return credit and priority reschedule.
- AP/tutor marks sessions complete manually for now.
