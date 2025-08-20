// VTU Engineering Subjects organized by Cycle, Branch and Semester
// Based on 2022 Scheme (CBCS) - Customized for specific requirements

export interface Subject {
  code: string
  name: string
  credits: number
  type: 'theory' | 'lab' | 'project' | 'seminar'
  category: 'core' | 'elective' | 'mandatory'
  description?: string
  modules?: string[]
}

export interface SemesterData {
  semester: number | string
  subjects: Subject[]
  totalCredits: number
  name: string
}

export interface CycleData {
  code: string
  name: string
  fullName: string
  icon: string
  color: string
  description: string
  semesters: SemesterData[]
}

export interface BranchData {
  code: string
  name: string
  fullName: string
  icon: string
  color: string
  description: string
  semesters: SemesterData[]
}

// First Year Cycles
const PHYSICS_CYCLE_SUBJECTS: Subject[] = [
  { 
    code: 'M1', 
    name: 'Calculus and Differential Equations', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Differential Calculus', 'Integral Calculus', 'Differential Equations', 'Series and Sequences', 'Applications']
  },
  { 
    code: 'PHY', 
    name: 'Engineering Physics', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Mechanics', 'Waves and Oscillations', 'Thermodynamics', 'Optics', 'Modern Physics']
  },
  { 
    code: 'EEE', 
    name: 'Basic Electrical Engineering', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['DC Circuits', 'AC Circuits', 'Magnetic Circuits', 'Transformers', 'Electrical Machines']
  },
  { 
    code: 'ENG', 
    name: 'Communicative English', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills', 'Communication Skills']
  },
  { 
    code: 'CS', 
    name: 'Introduction to Programming', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Programming Basics', 'Data Types', 'Control Structures', 'Functions', 'Problem Solving']
  },
  { 
    code: 'PHYL', 
    name: 'Engineering Physics Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['Mechanics Experiments', 'Wave Experiments', 'Optics Experiments', 'Modern Physics Lab', 'Error Analysis']
  },
  { 
    code: 'EEEL', 
    name: 'Basic Electrical Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['DC Circuit Analysis', 'AC Circuit Analysis', 'Electrical Measurements', 'Machine Experiments', 'Safety Practices']
  },
  { 
    code: 'CSL', 
    name: 'Programming Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['C Programming', 'Problem Solving', 'Debugging', 'Algorithm Implementation', 'Project Work']
  }
]

const CHEMISTRY_CYCLE_SUBJECTS: Subject[] = [
  { 
    code: 'M2', 
    name: 'Advanced Calculus and Numerical Methods', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Vector Calculus', 'Multiple Integrals', 'Numerical Methods', 'Fourier Series', 'Partial Differential Equations']
  },
  { 
    code: 'CHE', 
    name: 'Engineering Chemistry', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Atomic Structure', 'Chemical Bonding', 'Thermochemistry', 'Electrochemistry', 'Polymers and Materials']
  },
  { 
    code: 'ECE', 
    name: 'Basic Electronics Engineering', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Semiconductor Devices', 'Amplifiers', 'Digital Electronics', 'Communication Systems', 'Integrated Circuits']
  },
  { 
    code: 'ME', 
    name: 'Elements of Mechanical Engineering', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Materials Science', 'Machine Design']
  },
  { 
    code: 'CE', 
    name: 'Elements of Civil Engineering', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Building Materials', 'Surveying', 'Structural Analysis', 'Environmental Engineering', 'Transportation Engineering']
  },
  { 
    code: 'CHEL', 
    name: 'Engineering Chemistry Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['Chemical Analysis', 'Synthesis Experiments', 'Instrumental Methods', 'Material Testing', 'Quality Control']
  },
  { 
    code: 'ECEL', 
    name: 'Basic Electronics Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['Circuit Assembly', 'Amplifier Circuits', 'Digital Logic', 'Measurement Techniques', 'Project Design']
  },
  { 
    code: 'ENGL', 
    name: 'English Communication Lab', 
    credits: 1, 
    type: 'lab', 
    category: 'core',
    modules: ['Presentation Skills', 'Group Discussions', 'Interview Techniques', 'Report Writing', 'Technical Communication']
  }
]

// Computer Science Engineering (CSE)
const CSE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { code: 'M3', name: 'Transform Calculus, Fourier Series and Numerical Techniques', credits: 4, type: 'theory', category: 'core' },
    { code: 'DS', name: 'Data Structures and Applications', credits: 4, type: 'theory', category: 'core' },
    { code: 'ADE', name: 'Analog and Digital Electronics', credits: 4, type: 'theory', category: 'core' },
    { code: 'CO', name: 'Computer Organization', credits: 4, type: 'theory', category: 'core' },
    { code: 'OS', name: 'Operating Systems', credits: 3, type: 'theory', category: 'core' },
    { code: 'DSL', name: 'Data Structures Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'ADEL', name: 'Analog and Digital Electronics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'OSL', name: 'Operating Systems Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  4: [
    { code: 'M4', name: 'Complex Analysis, Probability and Statistical Methods', credits: 4, type: 'theory', category: 'core' },
    { code: 'DAA', name: 'Design and Analysis of Algorithms', credits: 4, type: 'theory', category: 'core' },
    { code: 'MP', name: 'Microprocessors and Microcontrollers', credits: 4, type: 'theory', category: 'core' },
    { code: 'OOP', name: 'Object Oriented Programming with JAVA', credits: 3, type: 'theory', category: 'core' },
    { code: 'UCD', name: 'User Interface Design', credits: 3, type: 'theory', category: 'core' },
    { code: 'DAAL', name: 'Design and Analysis of Algorithms Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MPL', name: 'Microprocessors Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'OOPL', name: 'Object Oriented Programming Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'UCDL', name: 'User Interface Design Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  5: [
    { code: 'CN', name: 'Computer Networks', credits: 4, type: 'theory', category: 'core' },
    { code: 'DBMS', name: 'Database Management System', credits: 4, type: 'theory', category: 'core' },
    { code: 'ATFL', name: 'Automata Theory and Formal Languages', credits: 4, type: 'theory', category: 'core' },
    { code: 'AI', name: 'Artificial Intelligence', credits: 3, type: 'theory', category: 'core' },
    { code: 'SE', name: 'Software Engineering', credits: 3, type: 'theory', category: 'core' },
    { code: 'CNL', name: 'Computer Networks Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DBMSL', name: 'DBMS Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'AIL', name: 'AI Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'SEL', name: 'Software Engineering Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  6: [
    { code: 'SS', name: 'System Software', credits: 4, type: 'theory', category: 'core' },
    { code: 'CG', name: 'Computer Graphics and Visualization', credits: 4, type: 'theory', category: 'core' },
    { code: 'CD', name: 'Compiler Design', credits: 4, type: 'theory', category: 'core' },
    { code: 'WEB', name: 'Web Programming', credits: 3, type: 'theory', category: 'core' },
    { code: 'ML', name: 'Machine Learning', credits: 3, type: 'theory', category: 'core' },
    { code: 'SSL', name: 'System Software Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'CGL', name: 'Computer Graphics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'WEBL', name: 'Web Programming Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MLL', name: 'Machine Learning Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  7: [
    { code: 'IOT', name: 'Internet of Things', credits: 3, type: 'theory', category: 'core' },
    { code: 'BDA', name: 'Big Data Analytics', credits: 3, type: 'theory', category: 'core' },
    { code: 'CS', name: 'Cyber Security', credits: 3, type: 'theory', category: 'core' },
    { code: 'PES1', name: 'Professional Elective Subject 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES2', name: 'Professional Elective Subject 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES1', name: 'Open Elective Subject 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'IOTL', name: 'IoT Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'BDAL', name: 'Big Data Analytics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'CSL', name: 'Cyber Security Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  8: [
    { code: 'PES3', name: 'Professional Elective Subject 3', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES4', name: 'Professional Elective Subject 4', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES2', name: 'Open Elective Subject 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PROJECT', name: 'Major Project', credits: 6, type: 'project', category: 'core' },
    { code: 'SEMINAR', name: 'Technical Seminar', credits: 2, type: 'seminar', category: 'core' },
    { code: 'INTERN', name: 'Internship', credits: 3, type: 'project', category: 'core' }
  ]
}

// Information Science Engineering (ISE)
const ISE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { code: 'M3', name: 'Transform Calculus, Fourier Series and Numerical Techniques', credits: 4, type: 'theory', category: 'core' },
    { code: 'DS', name: 'Data Structures and Applications', credits: 4, type: 'theory', category: 'core' },
    { code: 'ADE', name: 'Analog and Digital Electronics', credits: 4, type: 'theory', category: 'core' },
    { code: 'CO', name: 'Computer Organization and Architecture', credits: 4, type: 'theory', category: 'core' },
    { code: 'JAVA', name: 'JAVA Programming', credits: 3, type: 'theory', category: 'core' },
    { code: 'DSL', name: 'Data Structures Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'ADEL', name: 'Analog and Digital Electronics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'JAVAL', name: 'JAVA Programming Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  4: [
    { code: 'M4', name: 'Complex Analysis, Probability and Statistical Methods', credits: 4, type: 'theory', category: 'core' },
    { code: 'DAA', name: 'Design and Analysis of Algorithms', credits: 4, type: 'theory', category: 'core' },
    { code: 'OS', name: 'Operating Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'PY', name: 'Python Programming', credits: 3, type: 'theory', category: 'core' },
    { code: 'SE', name: 'Software Engineering', credits: 3, type: 'theory', category: 'core' },
    { code: 'DAAL', name: 'Design and Analysis of Algorithms Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'OSL', name: 'Operating Systems Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'PYL', name: 'Python Programming Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  5: [
    { code: 'CN', name: 'Computer Networks', credits: 4, type: 'theory', category: 'core' },
    { code: 'DBMS', name: 'Database Management System', credits: 4, type: 'theory', category: 'core' },
    { code: 'IS', name: 'Information Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'AI', name: 'Artificial Intelligence', credits: 3, type: 'theory', category: 'core' },
    { code: 'WEB', name: 'Web Technologies', credits: 3, type: 'theory', category: 'core' },
    { code: 'CNL', name: 'Computer Networks Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DBMSL', name: 'DBMS Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'WEBL', name: 'Web Technologies Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  6: [
    { code: 'CD', name: 'Compiler Design', credits: 4, type: 'theory', category: 'core' },
    { code: 'CG', name: 'Computer Graphics', credits: 4, type: 'theory', category: 'core' },
    { code: 'ML', name: 'Machine Learning', credits: 4, type: 'theory', category: 'core' },
    { code: 'DM', name: 'Data Mining', credits: 3, type: 'theory', category: 'core' },
    { code: 'NS', name: 'Network Security', credits: 3, type: 'theory', category: 'core' },
    { code: 'CDL', name: 'Compiler Design Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'CGL', name: 'Computer Graphics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MLL', name: 'Machine Learning Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  7: [
    { code: 'BDA', name: 'Big Data Analytics', credits: 3, type: 'theory', category: 'core' },
    { code: 'IOT', name: 'Internet of Things', credits: 3, type: 'theory', category: 'core' },
    { code: 'CC', name: 'Cloud Computing', credits: 3, type: 'theory', category: 'core' },
    { code: 'PES1', name: 'Professional Elective Subject 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES2', name: 'Professional Elective Subject 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES1', name: 'Open Elective Subject 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'BDAL', name: 'Big Data Analytics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'IOTL', name: 'IoT Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  8: [
    { code: 'PES3', name: 'Professional Elective Subject 3', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES4', name: 'Professional Elective Subject 4', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES2', name: 'Open Elective Subject 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PROJECT', name: 'Major Project', credits: 6, type: 'project', category: 'core' },
    { code: 'SEMINAR', name: 'Technical Seminar', credits: 2, type: 'seminar', category: 'core' },
    { code: 'INTERN', name: 'Internship', credits: 3, type: 'project', category: 'core' }
  ]
}

// Electronics & Communication Engineering (ECE)
const ECE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { code: 'M3', name: 'Transform Calculus, Fourier Series and Numerical Techniques', credits: 4, type: 'theory', category: 'core' },
    { code: 'ETE', name: 'Electronic Devices and Circuits', credits: 4, type: 'theory', category: 'core' },
    { code: 'DSD', name: 'Digital System Design', credits: 4, type: 'theory', category: 'core' },
    { code: 'NTW', name: 'Network Analysis', credits: 4, type: 'theory', category: 'core' },
    { code: 'LIC', name: 'Linear IC Applications', credits: 3, type: 'theory', category: 'core' },
    { code: 'ETEL', name: 'Electronic Devices Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DSDL', name: 'Digital System Design Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'LICL', name: 'Linear IC Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  4: [
    { code: 'M4', name: 'Complex Analysis, Probability and Statistical Methods', credits: 4, type: 'theory', category: 'core' },
    { code: 'CS', name: 'Control Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'ADC', name: 'Analog and Digital Communication', credits: 4, type: 'theory', category: 'core' },
    { code: 'MP', name: 'Microprocessors and Microcontrollers', credits: 4, type: 'theory', category: 'core' },
    { code: 'EM', name: 'Electromagnetic Fields', credits: 3, type: 'theory', category: 'core' },
    { code: 'CSL', name: 'Control Systems Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'ADCL', name: 'Communication Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MPL', name: 'Microprocessors Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  5: [
    { code: 'DSP', name: 'Digital Signal Processing', credits: 4, type: 'theory', category: 'core' },
    { code: 'DCS', name: 'Digital Communication Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'ANT', name: 'Antennas and Wave Propagation', credits: 4, type: 'theory', category: 'core' },
    { code: 'VLSI', name: 'VLSI Design', credits: 3, type: 'theory', category: 'core' },
    { code: 'POM', name: 'Principles of Management', credits: 3, type: 'theory', category: 'core' },
    { code: 'DSPL', name: 'DSP Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DCSL', name: 'Digital Communication Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'VLSIL', name: 'VLSI Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  6: [
    { code: 'CNW', name: 'Computer Networks', credits: 4, type: 'theory', category: 'core' },
    { code: 'IOT', name: 'Internet of Things', credits: 4, type: 'theory', category: 'core' },
    { code: 'MWE', name: 'Microwave Engineering', credits: 4, type: 'theory', category: 'core' },
    { code: 'PES1', name: 'Professional Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES1', name: 'Open Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'CNWL', name: 'Computer Networks Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'IOTL', name: 'IoT Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MWEL', name: 'Microwave Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  7: [
    { code: 'OFC', name: 'Optical Fiber Communication', credits: 3, type: 'theory', category: 'core' },
    { code: 'EC', name: 'Embedded Computing', credits: 3, type: 'theory', category: 'core' },
    { code: 'PES2', name: 'Professional Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES3', name: 'Professional Elective 3', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES2', name: 'Open Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OFCL', name: 'Optical Communication Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'ECL', name: 'Embedded Computing Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MINI', name: 'Mini Project', credits: 2, type: 'project', category: 'core' }
  ],
  8: [
    { code: 'PES4', name: 'Professional Elective 4', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES5', name: 'Professional Elective 5', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PROJECT', name: 'Major Project', credits: 6, type: 'project', category: 'core' },
    { code: 'SEMINAR', name: 'Technical Seminar', credits: 2, type: 'seminar', category: 'core' },
    { code: 'INTERN', name: 'Internship', credits: 3, type: 'project', category: 'core' }
  ]
}

// Electrical & Electronics Engineering (EEE)
const EEE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { code: 'M3', name: 'Transform Calculus, Fourier Series and Numerical Techniques', credits: 4, type: 'theory', category: 'core' },
    { code: 'DC', name: 'DC Machines and Transformers', credits: 4, type: 'theory', category: 'core' },
    { code: 'NTW', name: 'Network Analysis', credits: 4, type: 'theory', category: 'core' },
    { code: 'EDE', name: 'Electronic Devices and Circuits', credits: 4, type: 'theory', category: 'core' },
    { code: 'EFT', name: 'Electric Field Theory', credits: 3, type: 'theory', category: 'core' },
    { code: 'DCL', name: 'DC Machines Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'NTWL', name: 'Network Analysis Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'EDEL', name: 'Electronic Devices Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  4: [
    { code: 'M4', name: 'Complex Analysis, Probability and Statistical Methods', credits: 4, type: 'theory', category: 'core' },
    { code: 'AC', name: 'AC Machines', credits: 4, type: 'theory', category: 'core' },
    { code: 'CS', name: 'Control Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'PE', name: 'Power Electronics', credits: 4, type: 'theory', category: 'core' },
    { code: 'MP', name: 'Microprocessors and Microcontrollers', credits: 3, type: 'theory', category: 'core' },
    { code: 'ACL', name: 'AC Machines Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'CSL', name: 'Control Systems Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'PEL', name: 'Power Electronics Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  5: [
    { code: 'PS', name: 'Power Systems', credits: 4, type: 'theory', category: 'core' },
    { code: 'ED', name: 'Electrical Drives', credits: 4, type: 'theory', category: 'core' },
    { code: 'DSP', name: 'Digital Signal Processing', credits: 4, type: 'theory', category: 'core' },
    { code: 'HVPE', name: 'High Voltage Engineering', credits: 3, type: 'theory', category: 'core' },
    { code: 'POM', name: 'Principles of Management', credits: 3, type: 'theory', category: 'core' },
    { code: 'PSL', name: 'Power Systems Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'EDL', name: 'Electrical Drives Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DSPL', name: 'DSP Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  6: [
    { code: 'PSA', name: 'Power System Analysis', credits: 4, type: 'theory', category: 'core' },
    { code: 'RE', name: 'Renewable Energy Sources', credits: 4, type: 'theory', category: 'core' },
    { code: 'SM', name: 'Smart Materials', credits: 4, type: 'theory', category: 'core' },
    { code: 'PES1', name: 'Professional Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES1', name: 'Open Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PSAL', name: 'Power System Analysis Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'REL', name: 'Renewable Energy Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'SML', name: 'Smart Materials Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  7: [
    { code: 'PSP', name: 'Power System Protection', credits: 3, type: 'theory', category: 'core' },
    { code: 'EHV', name: 'Extra High Voltage AC Transmission', credits: 3, type: 'theory', category: 'core' },
    { code: 'PES2', name: 'Professional Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES3', name: 'Professional Elective 3', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES2', name: 'Open Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PSPL', name: 'Power System Protection Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'EHVL', name: 'EHV Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MINI', name: 'Mini Project', credits: 2, type: 'project', category: 'core' }
  ],
  8: [
    { code: 'PES4', name: 'Professional Elective 4', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES5', name: 'Professional Elective 5', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PROJECT', name: 'Major Project', credits: 6, type: 'project', category: 'core' },
    { code: 'SEMINAR', name: 'Technical Seminar', credits: 2, type: 'seminar', category: 'core' },
    { code: 'INTERN', name: 'Internship', credits: 3, type: 'project', category: 'core' }
  ]
}

// Mechanical Engineering (ME)
const ME_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { code: 'M3', name: 'Transform Calculus, Fourier Series and Numerical Techniques', credits: 4, type: 'theory', category: 'core' },
    { code: 'SOM', name: 'Strength of Materials', credits: 4, type: 'theory', category: 'core' },
    { code: 'KTG', name: 'Kinematics of Machines', credits: 4, type: 'theory', category: 'core' },
    { code: 'EME', name: 'Elements of Mechanical Engineering', credits: 4, type: 'theory', category: 'core' },
    { code: 'MMC', name: 'Metal Casting and Welding', credits: 3, type: 'theory', category: 'core' },
    { code: 'SOML', name: 'Strength of Materials Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'KTGL', name: 'Kinematics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MMCL', name: 'Metal Casting Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  4: [
    { code: 'M4', name: 'Complex Analysis, Probability and Statistical Methods', credits: 4, type: 'theory', category: 'core' },
    { code: 'TOM', name: 'Theory of Machines', credits: 4, type: 'theory', category: 'core' },
    { code: 'FM', name: 'Fluid Mechanics', credits: 4, type: 'theory', category: 'core' },
    { code: 'MT', name: 'Materials Testing', credits: 4, type: 'theory', category: 'core' },
    { code: 'MP', name: 'Manufacturing Processes', credits: 3, type: 'theory', category: 'core' },
    { code: 'TOML', name: 'Theory of Machines Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'FML', name: 'Fluid Mechanics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MTL', name: 'Materials Testing Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  5: [
    { code: 'MD', name: 'Machine Design', credits: 4, type: 'theory', category: 'core' },
    { code: 'TH', name: 'Thermodynamics', credits: 4, type: 'theory', category: 'core' },
    { code: 'HMT', name: 'Heat and Mass Transfer', credits: 4, type: 'theory', category: 'core' },
    { code: 'IE', name: 'Industrial Engineering', credits: 3, type: 'theory', category: 'core' },
    { code: 'CAD', name: 'Computer Aided Design', credits: 3, type: 'theory', category: 'core' },
    { code: 'MDL', name: 'Machine Design Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'THL', name: 'Thermodynamics Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'HMTL', name: 'Heat Transfer Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  6: [
    { code: 'IC', name: 'Internal Combustion Engines', credits: 4, type: 'theory', category: 'core' },
    { code: 'TM', name: 'Turbo Machines', credits: 4, type: 'theory', category: 'core' },
    { code: 'DME', name: 'Design of Machine Elements', credits: 4, type: 'theory', category: 'core' },
    { code: 'PES1', name: 'Professional Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES1', name: 'Open Elective 1', credits: 3, type: 'theory', category: 'elective' },
    { code: 'ICL', name: 'IC Engines Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'TML', name: 'Turbo Machines Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'DMEL', name: 'Design Lab', credits: 1, type: 'lab', category: 'core' }
  ],
  7: [
    { code: 'CAM', name: 'Computer Aided Manufacturing', credits: 3, type: 'theory', category: 'core' },
    { code: 'OR', name: 'Operations Research', credits: 3, type: 'theory', category: 'core' },
    { code: 'PES2', name: 'Professional Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES3', name: 'Professional Elective 3', credits: 3, type: 'theory', category: 'elective' },
    { code: 'OES2', name: 'Open Elective 2', credits: 3, type: 'theory', category: 'elective' },
    { code: 'CAML', name: 'CAM Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'ORL', name: 'OR Lab', credits: 1, type: 'lab', category: 'core' },
    { code: 'MINI', name: 'Mini Project', credits: 2, type: 'project', category: 'core' }
  ],
  8: [
    { code: 'PES4', name: 'Professional Elective 4', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PES5', name: 'Professional Elective 5', credits: 3, type: 'theory', category: 'elective' },
    { code: 'PROJECT', name: 'Major Project', credits: 6, type: 'project', category: 'core' },
    { code: 'SEMINAR', name: 'Technical Seminar', credits: 2, type: 'seminar', category: 'core' },
    { code: 'INTERN', name: 'Internship', credits: 3, type: 'project', category: 'core' }
  ]
}

export const VTU_CURRICULUM: BranchData[] = [
  {
    code: 'CSE',
    name: 'Computer Science Engineering',
    fullName: 'Computer Science and Engineering',
    icon: '💻',
    color: 'bg-blue-500',
    description: 'Software development, algorithms, and computing systems',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      { semester: 3, subjects: CSE_SUBJECTS[3], totalCredits: 23 },
      { semester: 4, subjects: CSE_SUBJECTS[4], totalCredits: 23 },
      { semester: 5, subjects: CSE_SUBJECTS[5], totalCredits: 23 },
      { semester: 6, subjects: CSE_SUBJECTS[6], totalCredits: 23 },
      { semester: 7, subjects: CSE_SUBJECTS[7], totalCredits: 21 },
      { semester: 8, subjects: CSE_SUBJECTS[8], totalCredits: 20 }
    ]
  },
  {
    code: 'ISE',
    name: 'Information Science Engineering',
    fullName: 'Information Science and Engineering',
    icon: '🌐',
    color: 'bg-cyan-500',
    description: 'Information systems, data management, and software solutions',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      { semester: 3, subjects: ISE_SUBJECTS[3], totalCredits: 23 },
      { semester: 4, subjects: ISE_SUBJECTS[4], totalCredits: 23 },
      { semester: 5, subjects: ISE_SUBJECTS[5], totalCredits: 23 },
      { semester: 6, subjects: ISE_SUBJECTS[6], totalCredits: 23 },
      { semester: 7, subjects: ISE_SUBJECTS[7], totalCredits: 21 },
      { semester: 8, subjects: ISE_SUBJECTS[8], totalCredits: 20 }
    ]
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    fullName: 'Electronics and Communication Engineering',
    icon: '📡',
    color: 'bg-purple-500',
    description: 'Electronics, communication systems, and signal processing',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      { semester: 3, subjects: ECE_SUBJECTS[3], totalCredits: 23 },
      { semester: 4, subjects: ECE_SUBJECTS[4], totalCredits: 23 },
      { semester: 5, subjects: ECE_SUBJECTS[5], totalCredits: 23 },
      { semester: 6, subjects: ECE_SUBJECTS[6], totalCredits: 23 },
      { semester: 7, subjects: ECE_SUBJECTS[7], totalCredits: 21 },
      { semester: 8, subjects: ECE_SUBJECTS[8], totalCredits: 20 }
    ]
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    fullName: 'Electrical and Electronics Engineering',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Electrical systems, power engineering, and control systems',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      { semester: 3, subjects: EEE_SUBJECTS[3], totalCredits: 23 },
      { semester: 4, subjects: EEE_SUBJECTS[4], totalCredits: 23 },
      { semester: 5, subjects: EEE_SUBJECTS[5], totalCredits: 23 },
      { semester: 6, subjects: EEE_SUBJECTS[6], totalCredits: 23 },
      { semester: 7, subjects: EEE_SUBJECTS[7], totalCredits: 21 },
      { semester: 8, subjects: EEE_SUBJECTS[8], totalCredits: 20 }
    ]
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    fullName: 'Mechanical Engineering',
    icon: '⚙️',
    color: 'bg-orange-500',
    description: 'Machines, manufacturing, and mechanical systems',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      { semester: 3, subjects: ME_SUBJECTS[3], totalCredits: 23 },
      { semester: 4, subjects: ME_SUBJECTS[4], totalCredits: 23 },
      { semester: 5, subjects: ME_SUBJECTS[5], totalCredits: 23 },
      { semester: 6, subjects: ME_SUBJECTS[6], totalCredits: 23 },
      { semester: 7, subjects: ME_SUBJECTS[7], totalCredits: 21 },
      { semester: 8, subjects: ME_SUBJECTS[8], totalCredits: 20 }
    ]
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    fullName: 'Civil Engineering',
    icon: '🏗️',
    color: 'bg-green-500',
    description: 'Construction, infrastructure, and structural design',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      // Add CE specific subjects for semesters 3-8
      { semester: 3, subjects: [], totalCredits: 23 },
      { semester: 4, subjects: [], totalCredits: 23 },
      { semester: 5, subjects: [], totalCredits: 23 },
      { semester: 6, subjects: [], totalCredits: 23 },
      { semester: 7, subjects: [], totalCredits: 21 },
      { semester: 8, subjects: [], totalCredits: 20 }
    ]
  },
  {
    code: 'CHE',
    name: 'Chemical Engineering',
    fullName: 'Chemical Engineering',
    icon: '🧪',
    color: 'bg-red-500',
    description: 'Chemical processes, material science, and process engineering',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      // Add CHE specific subjects for semesters 3-8
      { semester: 3, subjects: [], totalCredits: 23 },
      { semester: 4, subjects: [], totalCredits: 23 },
      { semester: 5, subjects: [], totalCredits: 23 },
      { semester: 6, subjects: [], totalCredits: 23 },
      { semester: 7, subjects: [], totalCredits: 21 },
      { semester: 8, subjects: [], totalCredits: 20 }
    ]
  },
  {
    code: 'AE',
    name: 'Aeronautical Engineering',
    fullName: 'Aeronautical Engineering',
    icon: '✈️',
    color: 'bg-indigo-500',
    description: 'Aircraft design, aerospace technology, and flight systems',
    semesters: [
      { semester: 1, subjects: COMMON_SUBJECTS[1], totalCredits: 26 },
      { semester: 2, subjects: COMMON_SUBJECTS[2], totalCredits: 25 },
      // Add AE specific subjects for semesters 3-8
      { semester: 3, subjects: [], totalCredits: 23 },
      { semester: 4, subjects: [], totalCredits: 23 },
      { semester: 5, subjects: [], totalCredits: 23 },
      { semester: 6, subjects: [], totalCredits: 23 },
      { semester: 7, subjects: [], totalCredits: 21 },
      { semester: 8, subjects: [], totalCredits: 20 }
    ]
  }
]

// Helper functions
export function getBranchByCode(code: string): BranchData | undefined {
  return VTU_CURRICULUM.find(branch => branch.code === code)
}

export function getSubjectsBySemester(branchCode: string, semester: number): Subject[] {
  const branch = getBranchByCode(branchCode)
  if (!branch) return []
  
  const semesterData = branch.semesters.find(sem => sem.semester === semester)
  return semesterData?.subjects || []
}

export function getSubjectByCode(branchCode: string, semester: number, subjectCode: string): Subject | undefined {
  const subjects = getSubjectsBySemester(branchCode, semester)
  return subjects.find(subject => subject.code === subjectCode)
}

export function getTotalCredits(branchCode: string, semester: number): number {
  const branch = getBranchByCode(branchCode)
  if (!branch) return 0
  
  const semesterData = branch.semesters.find(sem => sem.semester === semester)
  return semesterData?.totalCredits || 0
}

export function getAllBranches(): BranchData[] {
  return VTU_CURRICULUM
}

export function searchSubjects(query: string): { branch: string, semester: number, subject: Subject }[] {
  const results: { branch: string, semester: number, subject: Subject }[] = []
  
  VTU_CURRICULUM.forEach(branch => {
    branch.semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        if (
          subject.name.toLowerCase().includes(query.toLowerCase()) ||
          subject.code.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            branch: branch.code,
            semester: semester.semester,
            subject
          })
        }
      })
    })
  })
  
  return results
}
