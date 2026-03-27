// All text that appears in the UI lives here.
// Non-coder 1: this is yours to edit freely.
// Change labels, descriptions, button text — whatever sounds better.

export const STAGES = [
  {
    id: 'orientation',
    label: 'Finding Your Topic',
    shortLabel: 'Topic',
    description: 'Figuring out what you actually want to research',
    icon: '🔭',
    weeks: 'Weeks 1-4',
  },
  {
    id: 'application',
    label: 'Applying to Projects',
    shortLabel: 'Application',
    description: 'Choose and apply to a company project or a university project that fits you best',
    icon: '🧩',
    weeks: 'Weeks 6-10',
  },
  {
    id: 'supervisor',
    label: 'Locking In a Supervisor',
    shortLabel: 'Supervisor',
    description: 'Finding the professor who will guide and grade your thesis',
    icon: '🎓',
    weeks: 'Weeks 2-8',
  },
  {
    id: 'planning',
    label: 'Building Your Plan',
    shortLabel: 'Planning',
    description: 'Methodology, timeline, and aligning with your company partner',
    icon: '🗺️',
    weeks: 'Weeks 4-10',
  },
  {
    id: 'execution',
    label: 'Doing the Research',
    shortLabel: 'Research',
    description: 'Expert interviews, data collection, and iterating on your findings',
    icon: '⚗️',
    weeks: 'Weeks 6-20',
  },
  {
    id: 'writing',
    label: 'Writing the Thesis',
    shortLabel: 'Writing',
    description: 'Pulling your research into a clear, defensible narrative',
    icon: '📄',
    weeks: 'Weeks 16-22',
  },
  {
    id: 'submission',
    label: 'Submission and Defense',
    shortLabel: 'Submission',
    description: 'Final checks, submission, and preparing for review or defense',
    icon: '✅',
    weeks: 'Weeks 22-24',
  },
  {
    id: 'apply_jobs',
    label: 'Apply for Jobs',
    shortLabel: 'Jobs',
    description: 'Turn your thesis into a strong work sample for job applications',
    icon: '💼',
    weeks: 'Weeks 24+',
  },
]

export const INTAKE = {
  title: 'Where are you in your thesis journey?',
  subtitle: 'Tell us where you are right now. We will handle the rest.',
  topicLabel: 'What is your thesis about?',
  topicPlaceholder: 'e.g. AI in supply chain, fintech regulation, sustainable packaging...',
  topicHint: 'No idea yet? Just write your field of study.',
  universityLabel: 'Your university',
  universityPlaceholder: 'e.g. ETH Zurich, HSG, EPFL...',
  stageLabel: 'Which stage are you at right now?',
  deadlineLabel: 'When is your submission deadline?',
  submitButton: 'Show me my route',
}

export const JOURNEY = {
  currentStageLabel: 'You are here',
  completedLabel: 'Done',
  upNextLabel: 'Up next',
  weeksLeft: (n: number) => `${n} weeks left`,
  urgentWarning: 'Your deadline is close. The map has been adjusted.',
  markDoneButton: 'Mark as done',
  stuckButton: "I'm stuck",
  recalculatingLabel: 'Recalculating your route...',
}

export const MATCH = {
  sectionTitle: 'Recommended connections',
  supervisorBadge: 'Supervisor',
  expertBadge: 'Industry Expert',
  fitLabel: (score: number) => `${score}% match`,
  outreachButton: 'Draft an email',
  viewProfileButton: 'View profile',
}

export const STUCK = {
  dialogTitle: "What's blocking you?",
  dialogSubtitle: 'Tell us what is going on. We will help you figure out the next move.',
  inputPlaceholder: "e.g. I can't find a supervisor, my company partner is not responding...",
  submitButton: 'Help me get unstuck',
  loadingMessage: 'Diagnosing your blocker...',
}

export const OUTREACH = {
  dialogTitle: 'Your outreach email',
  copyButton: 'Copy to clipboard',
  copiedButton: 'Copied!',
  regenerateButton: 'Try a different version',
  editHint: 'Edit this before sending — add a personal detail if you have one.',
}

export const URGENCY_MESSAGES = {
  urgent: 'You have less than 4 weeks left. Focus on what matters most.',
  moderate: 'You have around 2 months. Keep the momentum going.',
  calm: 'You have good runway. Use it to do this properly.',
}
