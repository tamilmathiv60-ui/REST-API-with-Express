// ==========================================
// STACKSPACE — INTERACTIVE TASK DASHBOARD
// ==========================================

const tasks = [
  {
    id: 1,
    title: "Responsive landing page",
    category: "PROJECT",
    due: "27 Oct 2026",
    description:
      "Build a one-page site that looks right on a phone and on a laptop.",
    bullets: [
      "A mobile layout and a desktop layout",
      "Real content, not lorem ipsum",
      "Images that do not overflow the screen"
    ],
    outcome:
      "An HTML/CSS page with no horizontal scrolling at 375px."
  },
  {
    id: 2,
    title: "REST API with Express",
    category: "PROJECT",
    due: "02 Nov 2026",
    description:
      "Build an API with the four standard operations over one resource.",
    bullets: [
      "GET, POST, PUT and DELETE routes",
      "JSON in and JSON out",
      "Correct status codes for missing records"
    ],
    outcome:
      "A server you can exercise with curl or Postman."
  },
  {
    id: 3,
    title: "Database integration",
    category: "PROJECT",
    due: "07 Nov 2026",
    description:
      "Connect your application to a database and store real records.",
    bullets: [
      "Create and read records from a database",
      "Validate input before saving",
      "Handle errors with clear messages"
    ],
    outcome:
      "A small app that keeps data after the server restarts."
  },
  {
    id: 4,
    title: "Capstone: authenticated app, deployed",
    category: "PROJECT",
    due: "14 Nov 2026",
    description:
      "Build and deploy a full app where users sign in and only see their own data.",
    bullets: [
      "A sign-in flow and protected routes",
      "User-specific data",
      "A deployed app with setup instructions"
    ],
    outcome:
      "A deployed full-stack app with authentication and a clear README."
  },
  {
    id: 5,
    title: "Assessment: MCQ Quiz + Project Summary",
    category: "ASSESSMENT",
    due: "17 Nov 2026",
    description:
      "Review the concepts you practised and explain what you built.",
    bullets: [
      "Complete the multiple-choice quiz",
      "Summarise your project and decisions",
      "Include links to your code and deployed demo"
    ],
    outcome:
      "A completed assessment and concise project summary.",
    locked: true
  }
];

// ==========================================
// SAVE AND LOAD TASK PROGRESS
//
