// Based on Studyond mock data schema (types.ts)
// Extend this file following the same pattern — IDs continue from expert-31

export interface Expert {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string // job role e.g. "Head of Data Science"
  companyId: string
  companyName: string // denormalized for convenience
  offerInterviews: boolean
  about: string | null
  fieldIds: string[]
  objectives?: string[] // Optional: recruiting, fresh_insights, education_collaboration, etc.
}

export const experts: Expert[] = [
  {
    id: 'expert-01',
    firstName: 'Nina',
    lastName: 'Braun',
    email: 'n.braun@ubs.com',
    title: 'Head of AI & Automation',
    companyId: 'company-01',
    companyName: 'UBS',
    offerInterviews: true,
    about: 'Leading AI strategy and implementation at UBS across wealth management and investment banking divisions. Keen to collaborate on research at the intersection of AI and financial services regulation.',
    fieldIds: ['field-03', 'field-05', 'field-01'],
  },
  {
    id: 'expert-02',
    firstName: 'Dominik',
    lastName: 'Schmid',
    email: 'd.schmid@novartis.com',
    title: 'Director, Data Science',
    companyId: 'company-02',
    companyName: 'Novartis',
    offerInterviews: true,
    about: 'Building ML infrastructure for drug discovery and clinical trial analysis. Looking for thesis students interested in applying data science to real biomedical challenges.',
    fieldIds: ['field-02', 'field-11', 'field-12'],
  },
  {
    id: 'expert-03',
    firstName: 'Julia',
    lastName: 'Hartmann',
    email: 'j.hartmann@swisscom.ch',
    title: 'Senior Product Manager, AI',
    companyId: 'company-03',
    companyName: 'Swisscom',
    offerInterviews: true,
    about: 'Responsible for AI product strategy across Swisscom\'s B2B portfolio. Interested in thesis topics around telecom AI, network optimization, and enterprise AI adoption.',
    fieldIds: ['field-01', 'field-03', 'field-04'],
  },
  {
    id: 'expert-04',
    firstName: 'Stefan',
    lastName: 'Roth',
    email: 's.roth@sbb.ch',
    title: 'Innovation Manager',
    companyId: 'company-04',
    companyName: 'SBB CFF FFS',
    offerInterviews: true,
    about: 'Running the innovation pipeline at Swiss Federal Railways. Active research areas include predictive maintenance, passenger flow optimization, and sustainability measurement.',
    fieldIds: ['field-07', 'field-08', 'field-09'],
  },
  {
    id: 'expert-05',
    firstName: 'Laura',
    lastName: 'Meier',
    email: 'l.meier@migros.ch',
    title: 'Head of Data & Analytics',
    companyId: 'company-05',
    companyName: 'Migros',
    offerInterviews: false,
    about: 'Leading analytics transformation across Switzerland\'s largest retailer. Interested in theses on demand forecasting, sustainability supply chains, and consumer behavior modeling.',
    fieldIds: ['field-02', 'field-06', 'field-07'],
  },
  {
    id: 'expert-06',
    firstName: 'Marc',
    lastName: 'Weber',
    email: 'm.weber@zurich.com',
    title: 'Chief Risk Officer, Digital',
    companyId: 'company-06',
    companyName: 'Zurich Insurance',
    offerInterviews: true,
    about: 'Overseeing digital and AI risk frameworks at Zurich Insurance Group. Open to thesis collaborations on risk modeling, explainable AI in insurance, and regulatory compliance.',
    fieldIds: ['field-05', 'field-03', 'field-14'],
  },
  {
    id: 'expert-07',
    firstName: 'Anna',
    lastName: 'Koch',
    email: 'a.koch@abb.com',
    title: 'Research Engineer, Robotics',
    companyId: 'company-07',
    companyName: 'ABB',
    offerInterviews: true,
    about: 'Working on next-generation collaborative robotics and industrial automation at ABB Research. Interested in theses combining control theory, computer vision, and human-robot interaction.',
    fieldIds: ['field-09', 'field-10', 'field-03'],
  },
  {
    id: 'expert-08',
    firstName: 'Felix',
    lastName: 'Baumann',
    email: 'f.baumann@mckinsey.com',
    title: 'Associate Partner, Digital',
    companyId: 'company-08',
    companyName: 'McKinsey & Company',
    offerInterviews: true,
    about: 'Consulting on digital transformation and AI strategy for Swiss corporates. Interested in academic research on organizational change, technology adoption, and digital business models.',
    fieldIds: ['field-04', 'field-01', 'field-13'],
  },
]
