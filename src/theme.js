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
    url: "https://relationship-rescue.netlify.app",
  },
  {
    name: "The Paige Hospital",
    desc: "Family health & care hub",
    icon: "🏥",
    url: "https://paigehospital.netlify.app",
  },
];

export const SAMPLE_ITEMS = [
  {
    id: "sample-1",
    title: "Visit Ireland together",
    category: "travel",
    tier: 3,
    owner: "shared",
    stage: "planning",
    createdBy: "zach",
    createdAt: "2026-03-15T10:00:00Z",
    activityCount: 5,
    notes: [
      { text: "I found this incredible castle we could stay in — Ashford Castle in County Mayo. It's been on my mind since I saw photos.", by: "zach", at: "2026-03-15T10:00:00Z", stage: "dream" },
      { text: "OMG yes. Also want to see the Cliffs of Moher.", by: "stacey", at: "2026-03-18T14:00:00Z", stage: "planning" },
    ],
    media: [],
  },
  {
    id: "sample-2",
    title: "Learn to make fresh pasta from scratch",
    category: "food",
    tier: 1,
    owner: "shared",
    stage: "done",
    createdBy: "stacey",
    createdAt: "2026-01-10T09:00:00Z",
    completedAt: "2026-02-14T18:00:00Z",
    completedBy: "stacey",
    activityCount: 8,
    notes: [
      { text: "Valentine's Day pasta! Flour was EVERYWHERE but it was perfect.", by: "stacey", at: "2026-02-14T18:00:00Z", stage: "done" },
      { text: "Best meal we've ever made together. The sauce was all you.", by: "zach", at: "2026-02-14T20:00:00Z", stage: "done" },
    ],
    media: [],
  },
  {
    id: "sample-3",
    title: "Build a proper chicken coop expansion",
    category: "home",
    tier: 2,
    owner: "shared",
    stage: "doing",
    createdBy: "zach",
    createdAt: "2026-02-01T08:00:00Z",
    activityCount: 6,
    notes: [
      { text: "The girls need more space. Sketched out a design that doubles the run.", by: "zach", at: "2026-02-01T08:00:00Z", stage: "dream" },
    ],
    media: [],
  },
  {
    id: "sample-4",
    title: "See the Northern Lights",
    category: "travel",
    tier: 3,
    owner: "shared",
    stage: "dream",
    createdBy: "stacey",
    createdAt: "2026-04-01T12:00:00Z",
    activityCount: 2,
    notes: [
      { text: "Iceland or Norway? Either way — this one is a must.", by: "stacey", at: "2026-04-01T12:00:00Z", stage: "dream" },
    ],
    media: [],
  },
  {
    id: "sample-5",
    title: "Have a picnic at Garden of the Gods",
    category: "experiences",
    tier: 1,
    owner: "shared",
    stage: "dream",
    createdBy: "zach",
    createdAt: "2026-04-05T10:00:00Z",
    activityCount: 1,
    notes: [],
    media: [],
  },
  {
    id: "sample-6",
    title: "Learn to play guitar together",
    category: "skills",
    tier: 2,
    owner: "shared",
    stage: "dream",
    createdBy: "zach",
    createdAt: "2026-03-20T11:00:00Z",
    activityCount: 1,
    notes: [{ text: "I've been practicing on my own... maybe time to make this official.", by: "zach", at: "2026-03-20T11:00:00Z", stage: "dream" }],
    media: [],
  },
];

export const SAMPLE_MESSAGES = [
  { text: "I added Ireland to the sky tonight. Start dreaming.", author: "zach", createdAt: "2026-03-15T22:00:00Z" },
  { text: "Already am. Found some flight deals for September.", author: "stacey", createdAt: "2026-03-16T09:00:00Z" },
  { text: "September is perfect. We'll be past the summer heat here.", author: "zach", createdAt: "2026-03-16T10:30:00Z" },
];

export const SAMPLE_TRIGGERS = [
  {
    id: "trigger-1",
    plantedBy: "zach",
    targetUser: "stacey",
    triggerType: "keyword",
    condition: "Iceland",
    message: "You mentioned Iceland! I've been secretly researching the Blue Lagoon. It's happening. 💜",
    status: "planted",
    plantedAt: "2026-03-20T23:00:00Z",
  },
];
