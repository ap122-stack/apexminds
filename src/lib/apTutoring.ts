import { BUNDLES_BY_TIER, TutoringTier } from "@/lib/pricing";

export const tierCopy: Record<
  TutoringTier,
  {
    label: string;
    short: string;
    detail: string;
    subjects: string;
  }
> = {
  standard: {
    label: "Standard",
    short: "School support with steady momentum.",
    detail: "Math, science, humanities, and homework support for students who need a consistent rhythm.",
    subjects: "STEM, humanities, school support",
  },
  test_prep: {
    label: "Test Prep",
    short: "SAT/ACT practice with score strategy.",
    detail: "Timed drills, pacing, review cycles, and test strategy for SAT/ACT students.",
    subjects: "SAT/ACT only",
  },
  advanced: {
    label: "Advanced Placement",
    short: "AP course support and exam strategy.",
    detail: "AP subject support, FRQ practice, MCQ review, and month-by-month exam prep.",
    subjects: "AP courses",
  },
};

export const pricingTiers = (Object.keys(tierCopy) as TutoringTier[]).map((tier) => ({
  tier,
  ...tierCopy[tier],
  bundles: BUNDLES_BY_TIER[tier],
}));

export const admissionsPackage = {
  price: 400,
  label: "$400 seasonal package (was $550)",
  stripeLink: "https://buy.stripe.com/dRm14n0Z25Xc8gkbIh0sU0a",
  includes: [
    "Application strategy",
    "College list direction",
    "Essay brainstorming and review guidance",
    "Activity positioning",
    "Deadline roadmap",
    "Parent/student planning check-in",
  ],
};

export const tutorProfiles = [
  {
    id: "stem",
    checkoutTier: "standard",
    label: "STEM Tutor",
    tier: "Standard",
    subjects: "Algebra, Precalculus, Chemistry, Physics",
    style: "Structured problem solving",
    bestFor: "Students who need clean steps, practice reps, and stronger fundamentals.",
    availability: ["Mon 5:00 PM", "Wed 6:30 PM", "Sun 11:00 AM"],
  },
  {
    id: "test-prep",
    checkoutTier: "test_prep",
    label: "Test Prep Tutor",
    tier: "Test Prep",
    subjects: "SAT/ACT math, reading pacing, drills, score strategy",
    style: "Timed practice and review",
    bestFor: "Students who need pacing, targeted drills, and repeatable test habits.",
    availability: ["Tue 7:00 PM", "Thu 6:00 PM", "Sat 10:00 AM"],
  },
  {
    id: "humanities",
    checkoutTier: "standard",
    label: "Humanities Tutor",
    tier: "Standard",
    subjects: "Writing, reading, history",
    style: "Essay structure and close reading",
    bestFor: "Students who need clearer writing, reading confidence, and revision support.",
    availability: ["Mon 7:00 PM", "Fri 4:30 PM", "Sat 1:00 PM"],
  },
];

export const matchFields = [
  "Subject",
  "Student grade",
  "Goal",
  "Learning style",
  "Availability",
  "Preferred tutor traits",
  "Urgency",
];
