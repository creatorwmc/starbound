// ============================================================
// STARBOUND — Theme, Constants, and Configuration
// ============================================================

export const THEMES = {
  zach: {
    name: "Zach",
    primary: "#6C5CE7",
    secondary: "#A29BFE",
    accent: "#FFEAA7",
    bg: "linear-gradient(135deg, #0c0c2e 0%, #1a1045 50%, #0d1b3e 100%)",
    cardBg: "rgba(108, 92, 231, 0.12)",
    cardBorder: "rgba(108, 92, 231, 0.3)",
    glow: "rgba(108, 92, 231, 0.4)",
    starColor: "#A29BFE",
    textPrimary: "#F0EDFF",
    textSecondary: "#B8B0D9",
    initial: "Z",
  },
  stacey: {
    name: "Stacey",
    primary: "#E17055",
    secondary: "#FAB1A0",
    accent: "#55E6C1",
    bg: "linear-gradient(135deg, #1a0c0c 0%, #2d1520 50%, #1b1a0d 100%)",
    cardBg: "rgba(225, 112, 85, 0.12)",
    cardBorder: "rgba(225, 112, 85, 0.3)",
    glow: "rgba(225, 112, 85, 0.4)",
    starColor: "#FAB1A0",
    textPrimary: "#FFF0EB",
    textSecondary: "#D9B8AE",
    initial: "S",
  },
  shared: {
    starColor: "#FFEAA7",
  },
};

export const CATEGORIES = [
  { id: "travel", label: "Travel & Adventure", icon: "✈️", color: "#74B9FF" },
  { id: "skills", label: "Skills & Learning", icon: "📚", color: "#A29BFE" },
  { id: "food", label: "Food & Cooking", icon: "🍳", color: "#FDCB6E" },
  { id: "experiences", label: "Experiences & Events", icon: "🎪", color: "#FF7675" },
  { id: "home", label: "Home & Farm", icon: "🏡", color: "#55E6C1" },
  { id: "creative", label: "Creative Projects", icon: "🎨", color: "#E17055" },
  { id: "relationships", label: "Relationships & People", icon: "💜", color: "#D980FA" },
  { id: "wildcard", label: "Wild Cards", icon: "🃏", color: "#FD79A8" },
];

export const TIERS = [
  { id: 1, label: "Afternoon Adventure", icon: "⭐", size: 3 },
  { id: 2, label: "Big Dream", icon: "🌟", size: 5 },
  { id: 3, label: "Once in a Lifetime", icon: "💫", size: 8 },
];

export const STAGES = [
  { id: "dream", label: "Dream", icon: "✧", color: "#74B9FF" },
  { id: "planning", label: "Planning", icon: "☆", color: "#FFEAA7" },
  { id: "doing", label: "Doing", icon: "★", color: "#55E6C1" },
  { id: "done", label: "Done", icon: "✦", color: "#FF7675" },
  { id: "released", label: "Released", icon: "☁", color: "#636E72" },
];

export const GUIDED_PROMPTS = {
  travel: [
    "What season feels right for this trip?",
    "How long would you want to be there?",
    "What's a rough budget range?",
    "Any must-see experiences within this trip?",
    "What would make this legendary vs. just good?",
  ],
  skills: [
    "What does success look like?",
    "Do you need supplies, equipment, or classes?",
    "Who would you want to learn with?",
    "Is there a natural timeline for this?",
  ],
  food: [
    "Any recipe research needed?",
    "Special ingredients to source?",
    "Who would you cook for or eat with?",
    "One-time adventure or ongoing skill?",
  ],
  experiences: [
    "Is this time-sensitive or seasonal?",
    "Tickets or reservations needed?",
    "Who else would be part of this?",
    "Any travel involved?",
  ],
  creative: [
    "What materials or tools are needed?",
    "Is there a learning curve?",
    "What would the finished product look like?",
  ],
  home: [
    "What's the scope of this project?",
    "Any seasonal timing to consider?",
    "Rough budget estimate?",
    "DIY or hire help?",
  ],
};

export const OUR_APPS = [
  {
    name: "Practice Space",
    desc: "Spiritual practice & growth",
    icon: "🕯️",
    url: "https://practicespace.netlify.app",
  },
  {
    name: "Relationship Refuge",
    desc: "Games & date night toolkit",
    icon: "💜",
    url: "https://relationship-refuge.netlify.app",
  },
  {
    name: "The Paige Hospital",
    desc: "Family health & care hub",
    icon: "🏥",
    url: "https://paigehospital.netlify.app",
  },
  {
    name: "Solitaire Plus",
    desc: "Classic card games",
    icon: "🃏",
    url: "https://solitaire-plus.netlify.app",
  },
];

// No sample data — blank slate for real use
export const SAMPLE_ITEMS = [];
export const SAMPLE_MESSAGES = [];
export const SAMPLE_TRIGGERS = [];
