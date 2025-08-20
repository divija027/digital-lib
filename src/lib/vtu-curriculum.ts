// VTU Engineering Curriculum - Customized Structure
// Physics/Chemistry Cycles + Specific Engineering Branches
// Semesters 3-7 for each branch, 5 modules per subject

export interface Subject {
  code: string
  name: string
  credits: number
  type: 'theory' | 'lab' | 'project' | 'seminar'
  category: 'core' | 'elective' | 'mandatory'
  modules: string[]
  description?: string
}

export interface SemesterData {
  semester: number | string
  name: string
  subjects: Subject[]
  totalCredits: number
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
    modules: ['Differential Calculus', 'Integral Calculus', 'Differential Equations', 'Series and Sequences', 'Applications of Calculus']
  },
  { 
    code: 'PHY', 
    name: 'Engineering Physics', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['Mechanics and Properties of Matter', 'Waves and Oscillations', 'Thermodynamics', 'Optics and Lasers', 'Modern Physics']
  },
  { 
    code: 'EEE', 
    name: 'Basic Electrical Engineering', 
    credits: 4, 
    type: 'theory', 
    category: 'core',
    modules: ['DC Circuits', 'AC Circuits', 'Magnetic Circuits', 'Transformers', 'Electrical Machines Basics']
  },
  { 
    code: 'ENG', 
    name: 'Communicative English', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Grammar and Usage', 'Vocabulary Building', 'Reading Comprehension', 'Writing Skills', 'Oral Communication']
  },
  { 
    code: 'CS', 
    name: 'Introduction to Programming', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Programming Fundamentals', 'Data Types and Variables', 'Control Structures', 'Functions and Arrays', 'Problem Solving Techniques']
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
    modules: ['Atomic Structure and Bonding', 'Thermochemistry', 'Electrochemistry', 'Polymers and Advanced Materials', 'Environmental Chemistry']
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
    modules: ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Materials Science', 'Machine Design Basics']
  },
  { 
    code: 'CE', 
    name: 'Elements of Civil Engineering', 
    credits: 3, 
    type: 'theory', 
    category: 'core',
    modules: ['Building Materials', 'Surveying', 'Structural Analysis', 'Environmental Engineering', 'Transportation Engineering']
  }
]

// Computer Science Engineering (CSE) - Semesters 3-7
const CSE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { 
      code: 'M3', 
      name: 'Transform Calculus and Numerical Techniques', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Fourier Series', 'Laplace Transform', 'Z-Transform', 'Numerical Methods', 'Applications in Engineering']
    },
    { 
      code: 'DS', 
      name: 'Data Structures and Applications', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Arrays and Strings', 'Linked Lists', 'Stacks and Queues', 'Trees and Graphs', 'Sorting and Searching']
    },
    { 
      code: 'ADE', 
      name: 'Analog and Digital Electronics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Analog Circuits', 'Digital Logic Design', 'Sequential Circuits', 'Memory Systems', 'ADC and DAC']
    },
    { 
      code: 'CO', 
      name: 'Computer Organization and Architecture', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Number Systems', 'Processor Design', 'Memory Organization', 'I/O Systems', 'Performance Metrics']
    },
    { 
      code: 'OS', 
      name: 'Operating Systems', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization', 'Deadlocks']
    }
  ],
  4: [
    { 
      code: 'M4', 
      name: 'Complex Analysis and Statistics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Complex Functions', 'Residue Theory', 'Probability Theory', 'Statistical Methods', 'Random Variables']
    },
    { 
      code: 'DAA', 
      name: 'Design and Analysis of Algorithms', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Algorithm Fundamentals', 'Divide and Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'Graph Algorithms']
    },
    { 
      code: 'MP', 
      name: 'Microprocessors and Microcontrollers', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['8086 Architecture', 'Assembly Programming', 'Microcontroller Basics', 'Interfacing', 'Applications']
    },
    { 
      code: 'OOP', 
      name: 'Object Oriented Programming with JAVA', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['OOP Concepts', 'Classes and Objects', 'Inheritance', 'Polymorphism', 'Exception Handling']
    },
    { 
      code: 'UCD', 
      name: 'User Interface Design', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['UI Principles', 'Design Patterns', 'User Experience', 'Prototyping', 'Usability Testing']
    }
  ],
  5: [
    { 
      code: 'CN', 
      name: 'Computer Networks', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Network Fundamentals', 'Protocol Stack', 'Routing Algorithms', 'Network Security', 'Wireless Networks']
    },
    { 
      code: 'DBMS', 
      name: 'Database Management Systems', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Database Models', 'SQL and Queries', 'Normalization', 'Transaction Management', 'Distributed Databases']
    },
    { 
      code: 'ATFL', 
      name: 'Automata Theory and Formal Languages', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Finite Automata', 'Regular Languages', 'Context-Free Grammars', 'Turing Machines', 'Computability']
    },
    { 
      code: 'AI', 
      name: 'Artificial Intelligence', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Search Algorithms', 'Knowledge Representation', 'Machine Learning Basics', 'Expert Systems', 'Neural Networks']
    },
    { 
      code: 'SE', 
      name: 'Software Engineering', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['SDLC Models', 'Requirements Analysis', 'Design Principles', 'Testing Methods', 'Project Management']
    }
  ],
  6: [
    { 
      code: 'SS', 
      name: 'System Software', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Assemblers', 'Loaders and Linkers', 'Macros', 'Compilers', 'Interpreters']
    },
    { 
      code: 'CG', 
      name: 'Computer Graphics and Visualization', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Graphics Primitives', '2D Transformations', '3D Graphics', 'Rendering Techniques', 'Animation']
    },
    { 
      code: 'CD', 
      name: 'Compiler Design', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Code Generation', 'Optimization']
    },
    { 
      code: 'WEB', 
      name: 'Web Programming', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['HTML/CSS', 'JavaScript', 'Server-side Programming', 'Database Integration', 'Web Services']
    },
    { 
      code: 'ML', 
      name: 'Machine Learning', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning', 'Model Evaluation']
    }
  ],
  7: [
    { 
      code: 'IOT', 
      name: 'Internet of Things', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['IoT Architecture', 'Sensors and Actuators', 'Communication Protocols', 'Cloud Integration', 'Security in IoT']
    },
    { 
      code: 'BDA', 
      name: 'Big Data Analytics', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Big Data Concepts', 'Hadoop Ecosystem', 'Data Mining', 'NoSQL Databases', 'Analytics Tools']
    },
    { 
      code: 'CS', 
      name: 'Cyber Security', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Security Fundamentals', 'Cryptography', 'Network Security', 'Web Security', 'Ethical Hacking']
    },
    { 
      code: 'PES1', 
      name: 'Professional Elective 1', 
      credits: 3, 
      type: 'theory', 
      category: 'elective',
      modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
    },
    { 
      code: 'PROJECT', 
      name: 'Major Project', 
      credits: 6, 
      type: 'project', 
      category: 'core',
      modules: ['Project Planning', 'Literature Survey', 'Design Phase', 'Implementation', 'Testing and Documentation']
    }
  ]
}

// Information Science Engineering (ISE) - Similar structure to CSE
const ISE_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { 
      code: 'M3', 
      name: 'Transform Calculus and Numerical Techniques', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Fourier Series', 'Laplace Transform', 'Z-Transform', 'Numerical Methods', 'Applications in Engineering']
    },
    { 
      code: 'DS', 
      name: 'Data Structures and Applications', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Arrays and Strings', 'Linked Lists', 'Stacks and Queues', 'Trees and Graphs', 'Sorting and Searching']
    },
    { 
      code: 'ADE', 
      name: 'Analog and Digital Electronics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Analog Circuits', 'Digital Logic Design', 'Sequential Circuits', 'Memory Systems', 'ADC and DAC']
    },
    { 
      code: 'CO', 
      name: 'Computer Organization and Architecture', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Number Systems', 'Processor Design', 'Memory Organization', 'I/O Systems', 'Performance Metrics']
    },
    { 
      code: 'JAVA', 
      name: 'JAVA Programming', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Java Basics', 'OOP in Java', 'Exception Handling', 'Multithreading', 'GUI Programming']
    }
  ],
  4: [
    { 
      code: 'M4', 
      name: 'Complex Analysis and Statistics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Complex Functions', 'Residue Theory', 'Probability Theory', 'Statistical Methods', 'Random Variables']
    },
    { 
      code: 'DAA', 
      name: 'Design and Analysis of Algorithms', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Algorithm Fundamentals', 'Divide and Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'Graph Algorithms']
    },
    { 
      code: 'OS', 
      name: 'Operating Systems', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization', 'Deadlocks']
    },
    { 
      code: 'PY', 
      name: 'Python Programming', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Python Fundamentals', 'Data Structures in Python', 'File Handling', 'Libraries and Modules', 'Web Development']
    },
    { 
      code: 'SE', 
      name: 'Software Engineering', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['SDLC Models', 'Requirements Analysis', 'Design Principles', 'Testing Methods', 'Project Management']
    }
  ],
  5: [
    { 
      code: 'CN', 
      name: 'Computer Networks', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Network Fundamentals', 'Protocol Stack', 'Routing Algorithms', 'Network Security', 'Wireless Networks']
    },
    { 
      code: 'DBMS', 
      name: 'Database Management Systems', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Database Models', 'SQL and Queries', 'Normalization', 'Transaction Management', 'Distributed Databases']
    },
    { 
      code: 'IS', 
      name: 'Information Systems', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['System Analysis', 'System Design', 'Database Systems', 'Security Management', 'Decision Support Systems']
    },
    { 
      code: 'AI', 
      name: 'Artificial Intelligence', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Search Algorithms', 'Knowledge Representation', 'Machine Learning Basics', 'Expert Systems', 'Neural Networks']
    },
    { 
      code: 'WEB', 
      name: 'Web Technologies', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['HTML/CSS/JavaScript', 'Server Technologies', 'Web Services', 'Security in Web', 'Mobile Web Development']
    }
  ],
  6: [
    { 
      code: 'CD', 
      name: 'Compiler Design', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Code Generation', 'Optimization']
    },
    { 
      code: 'CG', 
      name: 'Computer Graphics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Graphics Primitives', '2D Transformations', '3D Graphics', 'Rendering Techniques', 'Animation']
    },
    { 
      code: 'ML', 
      name: 'Machine Learning', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning', 'Model Evaluation']
    },
    { 
      code: 'DM', 
      name: 'Data Mining', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Data Preprocessing', 'Classification', 'Clustering', 'Association Rules', 'Advanced Techniques']
    },
    { 
      code: 'NS', 
      name: 'Network Security', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Cryptography', 'Network Protocols', 'Firewalls', 'Intrusion Detection', 'Wireless Security']
    }
  ],
  7: [
    { 
      code: 'BDA', 
      name: 'Big Data Analytics', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Big Data Concepts', 'Hadoop Ecosystem', 'Data Mining', 'NoSQL Databases', 'Analytics Tools']
    },
    { 
      code: 'IOT', 
      name: 'Internet of Things', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['IoT Architecture', 'Sensors and Actuators', 'Communication Protocols', 'Cloud Integration', 'Security in IoT']
    },
    { 
      code: 'CC', 
      name: 'Cloud Computing', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Cloud Models', 'Virtualization', 'Storage and Security', 'Platform Services', 'Cloud Applications']
    },
    { 
      code: 'PES1', 
      name: 'Professional Elective 1', 
      credits: 3, 
      type: 'theory', 
      category: 'elective',
      modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
    },
    { 
      code: 'PROJECT', 
      name: 'Major Project', 
      credits: 6, 
      type: 'project', 
      category: 'core',
      modules: ['Project Planning', 'Literature Survey', 'Design Phase', 'Implementation', 'Testing and Documentation']
    }
  ]
}

// AI/ML Subjects
const AIML_SUBJECTS: { [key: number]: Subject[] } = {
  3: [
    { 
      code: 'M3', 
      name: 'Transform Calculus and Statistics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Linear Algebra', 'Probability Theory', 'Statistical Methods', 'Optimization', 'Mathematical Foundations']
    },
    { 
      code: 'DS', 
      name: 'Data Structures and Algorithms', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Linear Data Structures', 'Trees and Graphs', 'Sorting and Searching', 'Algorithm Complexity', 'Advanced Data Structures']
    },
    { 
      code: 'PY', 
      name: 'Python Programming for AI', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Python Fundamentals', 'NumPy and Pandas', 'Data Visualization', 'Scientific Computing', 'AI Libraries']
    },
    { 
      code: 'DM', 
      name: 'Discrete Mathematics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Set Theory', 'Logic and Proofs', 'Graph Theory', 'Combinatorics', 'Number Theory']
    },
    { 
      code: 'DBMS', 
      name: 'Database Management Systems', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Database Models', 'SQL and Queries', 'Normalization', 'Transaction Management', 'NoSQL Databases']
    }
  ],
  4: [
    { 
      code: 'ML', 
      name: 'Machine Learning', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Supervised Learning', 'Unsupervised Learning', 'Model Selection', 'Feature Engineering', 'Ensemble Methods']
    },
    { 
      code: 'AI', 
      name: 'Artificial Intelligence', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Search Algorithms', 'Knowledge Representation', 'Logic and Reasoning', 'Expert Systems', 'Planning']
    },
    { 
      code: 'NLP', 
      name: 'Natural Language Processing', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Text Processing', 'Language Models', 'Sentiment Analysis', 'Information Extraction', 'Speech Recognition']
    },
    { 
      code: 'CV', 
      name: 'Computer Vision', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Image Processing', 'Feature Detection', 'Object Recognition', 'Deep Learning for Vision', 'Applications']
    },
    { 
      code: 'OS', 
      name: 'Operating Systems', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization', 'Distributed Systems']
    }
  ],
  5: [
    { 
      code: 'DL', 
      name: 'Deep Learning', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Neural Networks', 'Convolutional Networks', 'Recurrent Networks', 'Optimization', 'Regularization']
    },
    { 
      code: 'RL', 
      name: 'Reinforcement Learning', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['MDP Framework', 'Value Functions', 'Policy Methods', 'Deep RL', 'Multi-agent Systems']
    },
    { 
      code: 'BDA', 
      name: 'Big Data Analytics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Big Data Concepts', 'Hadoop Ecosystem', 'Spark', 'Distributed Computing', 'Analytics Pipeline']
    },
    { 
      code: 'IOT', 
      name: 'Internet of Things', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['IoT Architecture', 'Sensor Networks', 'Edge Computing', 'IoT Security', 'Smart Applications']
    },
    { 
      code: 'CN', 
      name: 'Computer Networks', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Network Fundamentals', 'Protocol Stack', 'Routing', 'Network Security', 'Wireless Networks']
    }
  ],
  6: [
    { 
      code: 'RB', 
      name: 'Robotics', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Robot Kinematics', 'Motion Planning', 'Control Systems', 'Computer Vision in Robotics', 'AI in Robotics']
    },
    { 
      code: 'BC', 
      name: 'Blockchain Technology', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Distributed Ledgers', 'Consensus Mechanisms', 'Smart Contracts', 'Cryptocurrency', 'Applications']
    },
    { 
      code: 'QC', 
      name: 'Quantum Computing', 
      credits: 4, 
      type: 'theory', 
      category: 'core',
      modules: ['Quantum Mechanics Basics', 'Quantum Algorithms', 'Quantum Gates', 'Error Correction', 'Applications']
    },
    { 
      code: 'PES1', 
      name: 'Professional Elective 1', 
      credits: 3, 
      type: 'theory', 
      category: 'elective',
      modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
    },
    { 
      code: 'PES2', 
      name: 'Professional Elective 2', 
      credits: 3, 
      type: 'theory', 
      category: 'elective',
      modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
    }
  ],
  7: [
    { 
      code: 'AE', 
      name: 'AI Ethics and Governance', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Ethical Frameworks', 'Bias and Fairness', 'Privacy and Security', 'Governance Models', 'Social Impact']
    },
    { 
      code: 'MLOPS', 
      name: 'MLOps and Deployment', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Model Development', 'Continuous Integration', 'Model Monitoring', 'Scalable Deployment', 'Version Control']
    },
    { 
      code: 'AGI', 
      name: 'Advanced AI Topics', 
      credits: 3, 
      type: 'theory', 
      category: 'core',
      modules: ['Explainable AI', 'Federated Learning', 'Transfer Learning', 'Meta Learning', 'Neuromorphic Computing']
    },
    { 
      code: 'PES3', 
      name: 'Professional Elective 3', 
      credits: 3, 
      type: 'theory', 
      category: 'elective',
      modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
    },
    { 
      code: 'PROJECT', 
      name: 'Major Project', 
      credits: 6, 
      type: 'project', 
      category: 'core',
      modules: ['Project Planning', 'Literature Survey', 'Design Phase', 'Implementation', 'Testing and Documentation']
    }
  ]
}

// Create simplified subject definitions for other branches
const createBranchSubjects = (branchCode: string): { [key: number]: Subject[] } => {
  const subjects: { [key: number]: Subject[] } = {}
  
  for (let sem = 3; sem <= 7; sem++) {
    subjects[sem] = [
      { 
        code: `${branchCode}${sem}01`, 
        name: `${branchCode} Core Subject 1`, 
        credits: 4, 
        type: 'theory', 
        category: 'core',
        modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
      },
      { 
        code: `${branchCode}${sem}02`, 
        name: `${branchCode} Core Subject 2`, 
        credits: 4, 
        type: 'theory', 
        category: 'core',
        modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
      },
      { 
        code: `${branchCode}${sem}03`, 
        name: `${branchCode} Core Subject 3`, 
        credits: 4, 
        type: 'theory', 
        category: 'core',
        modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']
      },
      { 
        code: `${branchCode}${sem}04`, 
        name: `${branchCode} Lab`, 
        credits: 2, 
        type: 'lab', 
        category: 'core',
        modules: ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5']
      }
    ]
    
    if (sem === 7) {
      subjects[sem].push({
        code: `${branchCode}PROJECT`, 
        name: 'Major Project', 
        credits: 6, 
        type: 'project', 
        category: 'core',
        modules: ['Project Planning', 'Literature Survey', 'Design Phase', 'Implementation', 'Testing and Documentation']
      })
    }
  }
  
  return subjects
}

const ECE_SUBJECTS = createBranchSubjects('ECE')
const EEE_SUBJECTS = createBranchSubjects('EEE')
const ME_SUBJECTS = createBranchSubjects('ME')
const CE_SUBJECTS = createBranchSubjects('CE')

// First Year Cycles
export const FIRST_YEAR_CYCLES: BranchData[] = [
  {
    code: 'PHYSICS',
    name: 'Physics Cycle',
    fullName: 'Physics Cycle - First Year',
    icon: '⚛️',
    color: 'bg-indigo-500',
    description: 'Foundation in Physics and Mathematics for Engineering',
    semesters: [
      { 
        semester: 'Physics Cycle', 
        name: 'Physics Cycle Semester',
        subjects: PHYSICS_CYCLE_SUBJECTS, 
        totalCredits: 18 
      }
    ]
  },
  {
    code: 'CHEMISTRY',
    name: 'Chemistry Cycle',
    fullName: 'Chemistry Cycle - First Year',
    icon: '🧪',
    color: 'bg-green-500',
    description: 'Foundation in Chemistry and Engineering Basics',
    semesters: [
      { 
        semester: 'Chemistry Cycle', 
        name: 'Chemistry Cycle Semester',
        subjects: CHEMISTRY_CYCLE_SUBJECTS, 
        totalCredits: 18 
      }
    ]
  }
]

// Engineering Branches (Semesters 3-7)
export const VTU_CURRICULUM: BranchData[] = [
  {
    code: 'CSE',
    name: 'Computer Science Engineering',
    fullName: 'Computer Science and Engineering',
    icon: '💻',
    color: 'bg-blue-500',
    description: 'Software development, algorithms, and computing systems',
    semesters: [
      { semester: 3, name: 'Third Semester', subjects: CSE_SUBJECTS[3], totalCredits: 22 },
      { semester: 4, name: 'Fourth Semester', subjects: CSE_SUBJECTS[4], totalCredits: 22 },
      { semester: 5, name: 'Fifth Semester', subjects: CSE_SUBJECTS[5], totalCredits: 22 },
      { semester: 6, name: 'Sixth Semester', subjects: CSE_SUBJECTS[6], totalCredits: 21 },
      { semester: 7, name: 'Seventh Semester', subjects: CSE_SUBJECTS[7], totalCredits: 18 }
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
      { semester: 3, name: 'Third Semester', subjects: ISE_SUBJECTS[3], totalCredits: 22 },
      { semester: 4, name: 'Fourth Semester', subjects: ISE_SUBJECTS[4], totalCredits: 22 },
      { semester: 5, name: 'Fifth Semester', subjects: ISE_SUBJECTS[5], totalCredits: 22 },
      { semester: 6, name: 'Sixth Semester', subjects: ISE_SUBJECTS[6], totalCredits: 21 },
      { semester: 7, name: 'Seventh Semester', subjects: ISE_SUBJECTS[7], totalCredits: 18 }
    ]
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication',
    fullName: 'Electronics and Communication Engineering',
    icon: '📡',
    color: 'bg-purple-500',
    description: 'Electronics, communication systems, and signal processing',
    semesters: [
      { semester: 3, name: 'Third Semester', subjects: ECE_SUBJECTS[3], totalCredits: 18 },
      { semester: 4, name: 'Fourth Semester', subjects: ECE_SUBJECTS[4], totalCredits: 18 },
      { semester: 5, name: 'Fifth Semester', subjects: ECE_SUBJECTS[5], totalCredits: 18 },
      { semester: 6, name: 'Sixth Semester', subjects: ECE_SUBJECTS[6], totalCredits: 18 },
      { semester: 7, name: 'Seventh Semester', subjects: ECE_SUBJECTS[7], totalCredits: 20 }
    ]
  },
  {
    code: 'AIML',
    name: 'AI & Machine Learning',
    fullName: 'Artificial Intelligence and Machine Learning',
    icon: '🤖',
    color: 'bg-rose-500',
    description: 'Artificial Intelligence, Machine Learning, and Data Science',
    semesters: [
      { semester: 3, name: 'Third Semester', subjects: AIML_SUBJECTS[3], totalCredits: 22 },
      { semester: 4, name: 'Fourth Semester', subjects: AIML_SUBJECTS[4], totalCredits: 22 },
      { semester: 5, name: 'Fifth Semester', subjects: AIML_SUBJECTS[5], totalCredits: 22 },
      { semester: 6, name: 'Sixth Semester', subjects: AIML_SUBJECTS[6], totalCredits: 21 },
      { semester: 7, name: 'Seventh Semester', subjects: AIML_SUBJECTS[7], totalCredits: 18 }
    ]
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics',
    fullName: 'Electrical and Electronics Engineering',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Electrical systems, power engineering, and control systems',
    semesters: [
      { semester: 3, name: 'Third Semester', subjects: EEE_SUBJECTS[3], totalCredits: 18 },
      { semester: 4, name: 'Fourth Semester', subjects: EEE_SUBJECTS[4], totalCredits: 18 },
      { semester: 5, name: 'Fifth Semester', subjects: EEE_SUBJECTS[5], totalCredits: 18 },
      { semester: 6, name: 'Sixth Semester', subjects: EEE_SUBJECTS[6], totalCredits: 18 },
      { semester: 7, name: 'Seventh Semester', subjects: EEE_SUBJECTS[7], totalCredits: 20 }
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
      { semester: 3, name: 'Third Semester', subjects: ME_SUBJECTS[3], totalCredits: 18 },
      { semester: 4, name: 'Fourth Semester', subjects: ME_SUBJECTS[4], totalCredits: 18 },
      { semester: 5, name: 'Fifth Semester', subjects: ME_SUBJECTS[5], totalCredits: 18 },
      { semester: 6, name: 'Sixth Semester', subjects: ME_SUBJECTS[6], totalCredits: 18 },
      { semester: 7, name: 'Seventh Semester', subjects: ME_SUBJECTS[7], totalCredits: 20 }
    ]
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    fullName: 'Civil Engineering',
    icon: '🏗️',
    color: 'bg-emerald-500',
    description: 'Construction, infrastructure, and structural design',
    semesters: [
      { semester: 3, name: 'Third Semester', subjects: CE_SUBJECTS[3], totalCredits: 18 },
      { semester: 4, name: 'Fourth Semester', subjects: CE_SUBJECTS[4], totalCredits: 18 },
      { semester: 5, name: 'Fifth Semester', subjects: CE_SUBJECTS[5], totalCredits: 18 },
      { semester: 6, name: 'Sixth Semester', subjects: CE_SUBJECTS[6], totalCredits: 18 },
      { semester: 7, name: 'Seventh Semester', subjects: CE_SUBJECTS[7], totalCredits: 20 }
    ]
  }
]

// Helper functions
export function getBranchByCode(code: string): BranchData | undefined {
  return VTU_CURRICULUM.find(branch => branch.code === code)
}

export function getCycleByCode(code: string): BranchData | undefined {
  return FIRST_YEAR_CYCLES.find(cycle => cycle.code === code)
}

export function getSubjectsBySemester(branchCode: string, semester: number | string): Subject[] {
  const branch = getBranchByCode(branchCode)
  if (!branch) return []
  
  const semesterData = branch.semesters.find(sem => sem.semester === semester)
  return semesterData?.subjects || []
}

export function getAllBranches(): BranchData[] {
  return VTU_CURRICULUM
}

export function getAllCycles(): BranchData[] {
  return FIRST_YEAR_CYCLES
}

export function searchSubjects(query: string): { branch: string, semester: number | string, subject: Subject }[] {
  const results: { branch: string, semester: number | string, subject: Subject }[] = []
  
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
