// Based on Studyond mock data schema (types.ts)
// Extend this file following the same pattern — IDs continue from supervisor-26

export interface Supervisor {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string // academic honorific e.g. "Prof. Dr."
  universityId: string
  researchInterests: string[]
  about: string | null
  fieldIds: string[]
}

export const supervisors: Supervisor[] = [
  {
    id: 'supervisor-01',
    firstName: 'Elena',
    lastName: 'Müller',
    email: 'e.mueller@ethz.ch',
    title: 'Prof. Dr.',
    universityId: 'uni-01',
    researchInterests: ['NLP', 'knowledge graphs', 'information retrieval', 'large language models'],
    about: 'Leading researcher in applied NLP and knowledge representation at ETH Zurich. Supervises 4-6 MSc theses per year on topics at the intersection of AI and real-world systems.',
    fieldIds: ['field-01', 'field-03'],
  },
  {
    id: 'supervisor-02',
    firstName: 'Thomas',
    lastName: 'Becker',
    email: 't.becker@unisg.ch',
    title: 'Prof. Dr.',
    universityId: 'uni-02',
    researchInterests: ['platform economics', 'digital marketplaces', 'two-sided markets', 'fintech'],
    about: 'Expert on digital platform strategy and marketplace design at HSG. Frequently collaborates with Swiss financial institutions on research projects.',
    fieldIds: ['field-04', 'field-05', 'field-13'],
  },
  {
    id: 'supervisor-03',
    firstName: 'Lena',
    lastName: 'Fischer',
    email: 'l.fischer@epfl.ch',
    title: 'Dr.',
    universityId: 'uni-03',
    researchInterests: ['machine learning', 'computer vision', 'edge AI', 'robotics'],
    about: 'Research scientist at EPFL with a focus on deploying ML models in resource-constrained environments. Previously at Google Brain.',
    fieldIds: ['field-03', 'field-01', 'field-09'],
  },
  {
    id: 'supervisor-04',
    firstName: 'Markus',
    lastName: 'Hoffmann',
    email: 'm.hoffmann@uzh.ch',
    title: 'Prof. Dr.',
    universityId: 'uni-04',
    researchInterests: ['supply chain resilience', 'operations research', 'sustainability', 'logistics'],
    about: 'Professor of Supply Chain Management at UZH. Current research focuses on sustainability trade-offs in global supply chains.',
    fieldIds: ['field-07', 'field-08', 'field-04'],
  },
  {
    id: 'supervisor-05',
    firstName: 'Sophie',
    lastName: 'Werner',
    email: 's.werner@fhnw.ch',
    title: 'Dr.',
    universityId: 'uni-05',
    researchInterests: ['consumer behavior', 'digital marketing', 'social commerce', 'brand strategy'],
    about: 'Applied researcher bridging academic marketing theory and industry practice. Runs the Digital Consumer Lab at FHNW.',
    fieldIds: ['field-06', 'field-04'],
  },
  {
    id: 'supervisor-06',
    firstName: 'Andreas',
    lastName: 'Keller',
    email: 'a.keller@ethz.ch',
    title: 'Prof. Dr.',
    universityId: 'uni-01',
    researchInterests: ['federated learning', 'privacy-preserving AI', 'distributed systems', 'data governance'],
    about: 'Expert in privacy-aware machine learning. Works closely with Swiss banks and healthcare providers on data collaboration without centralization.',
    fieldIds: ['field-03', 'field-01', 'field-05'],
  },
  {
    id: 'supervisor-07',
    firstName: 'Claudia',
    lastName: 'Vogel',
    email: 'c.vogel@unisg.ch',
    title: 'Prof. Dr.',
    universityId: 'uni-02',
    researchInterests: ['ESG investing', 'sustainable finance', 'impact measurement', 'corporate governance'],
    about: 'Chair of Sustainable Finance at HSG. Actively seeking theses on ESG data quality and impact investing frameworks.',
    fieldIds: ['field-05', 'field-08', 'field-13'],
  },
  {
    id: 'supervisor-08',
    firstName: 'Patrick',
    lastName: 'Zimmermann',
    email: 'p.zimmermann@epfl.ch',
    title: 'Dr.',
    universityId: 'uni-03',
    researchInterests: ['human-computer interaction', 'UX research', 'accessibility', 'AR/VR'],
    about: 'HCI researcher with strong industry connections. Supervises design-led theses that combine user research methods with technical prototyping.',
    fieldIds: ['field-01', 'field-18'],
  },
]
