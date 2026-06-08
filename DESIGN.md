# AP Tutoring Design System

## Product
AP Tutoring is a premium one-on-one tutoring business selling monthly session packages. The public checkout experience should feel as polished and trustworthy as Stripe Checkout: calm, minimal, spacious, and conversion-focused.

## Visual Direction
- Use a clean split-checkout layout on desktop.
- Left pane: product/package summary, large price, visual session card, order details.
- Right pane: tier selector, session stepper, student information, and Stripe handoff button.
- Overall feel: Stripe-hosted checkout meets private academic coaching.
- Avoid playful cartoons, heavy gradients, oversized marketing fluff, and decorative blobs.

## Layout
Desktop:
- Two equal columns, full viewport height.
- Left column background: near-white #FBFBFC.
- Right column background: white.
- Left content max width around 430px.
- Right checkout form max width around 560px.

Mobile:
- Single column.
- Product summary first, form second.
- Keep all controls large enough for touch.

## Colors
- Ink: #2B2B31
- Deep plum: #363146
- Soft page: #FBFBFC
- Border: #DCDCDF
- Muted text: #77777F
- Success green: #178F63
- Accent blue surface: #DBE7FF
- Light violet admission panel: #FAF8FF

## Typography
- Use Inter or system sans-serif.
- Large package price should be 52-60px desktop.
- Section headings should be 22-28px.
- Form labels and control text should be clear and compact.

## Components
### Tier Selector
Three selectable cards:
- Standard
- Test Prep
- AP Direct
Selected state uses a dark plum border and subtle inset border.

### Session Stepper
A horizontal control with minus button, current session count, and plus button.
Allowed values: 4, 8, 12.
Default value: 8.
8 sessions should read as recommended.

### Product Summary
Show:
- Tier name
- Total monthly price
- Sessions per month
- Effective hourly rate
- Walk-in rate with strikethrough
- Savings

### Payment Button
Primary CTA text should include the selected monthly price, for example:
Pay $280/month

## Business Rules
- Standard: $45/hr walk-in; 4=$148, 8=$280, 12=$396.
- Test Prep: $60/hr walk-in; 4=$212, 8=$400, 12=$576.
- AP Direct: $55/hr walk-in; 4=$188, 8=$352, 12=$504.
- Admissions consulting: $250 flat, inquiry-only, no direct checkout.
- Inner circle clients remain manual/Zelle and should not be pushed through Stripe.

## Stripe Checkout
Use hosted Stripe Checkout after the user selects a package and enters student details. Keep the local page as a pre-checkout package selector. Stripe should handle card/wallet/payment-method UI.

## Accessibility
- Use visible focus states.
- Buttons must have readable contrast.
- Do not rely on color alone for selected state.
- Text must not overlap on mobile.
