/**
 * MCE GPA/CGPA Calculator — Subject Data
 * Anna University Regulation 2021
 * Source: mcegpacalculator.netlify.app
 *
 * Usage:
 *   <script src="subjects-data.js"></script>
 *   // Access via window.MCE_SUBJECTS
 *
 * Structure:
 *   MCE_SUBJECTS[deptKey][semKey] = [
 *     { code, name, credits, type }  // type: "theory" | "lab" | "project" | "elective" | "audit"
 *   ]
 *
 * Credits follow standard Anna University Reg 2021 patterns:
 *   Theory (core/elective) : 3–4  |  Lab : 2  |  Professional Development : 1
 *   Environmental Sciences : 3    |  Project : 12  |  Internship : 2–3
 */

const MCE_SUBJECTS = {

  /* ─────────────────────────────────────────────
     B.E. COMPUTER SCIENCE AND ENGINEERING
  ───────────────────────────────────────────── */
  "CSE": {
    label: "B.E. Computer Science and Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3256", name: "Physics for Information Science",                    credits: 4, type: "theory" },
        { code: "BE3251", name: "Basic Electrical and Electronics Engineering",       credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "CS3251", name: "Programming in C",                                   credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "CS3271", name: "Programming in C Laboratory",                        credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3354", name: "Discrete Mathematics",                               credits: 4, type: "theory" },
        { code: "CS3351", name: "Digital Principles and Computer Organization",       credits: 4, type: "theory" },
        { code: "CS3352", name: "Foundations of Data Science",                        credits: 4, type: "theory" },
        { code: "CS3301", name: "Data Structures",                                    credits: 4, type: "theory" },
        { code: "CS3391", name: "Object Oriented Programming",                        credits: 4, type: "theory" },
        { code: "CS3311", name: "Data Structures Laboratory",                         credits: 2, type: "lab"    },
        { code: "CS3381", name: "Object Oriented Programming Laboratory",             credits: 2, type: "lab"    },
        { code: "CS3361", name: "Data Science Laboratory",                            credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "CS3452", name: "Theory of Computation",                              credits: 3, type: "theory" },
        { code: "CS3491", name: "Artificial Intelligence and Machine Learning",       credits: 4, type: "theory" },
        { code: "CS3492", name: "Database Management Systems",                        credits: 4, type: "theory" },
        { code: "CS3401", name: "Algorithms",                                         credits: 4, type: "theory" },
        { code: "CS3451", name: "Introduction to Operating Systems",                  credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "CS3461", name: "Operating Systems Laboratory",                       credits: 2, type: "lab"    },
        { code: "CS3481", name: "Database Management Systems Laboratory",             credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "CS3591", name: "Computer Networks",                                  credits: 4, type: "theory" },
        { code: "CS3501", name: "Compiler Design",                                    credits: 4, type: "theory" },
        { code: "CB3491", name: "Cryptography and Cyber Security",                    credits: 3, type: "theory" },
        { code: "CS3551", name: "Distributed Computing",                              credits: 3, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"}
      ],
      "Semester 6": [
        { code: "CCS356", name: "Object Oriented Software Engineering",               credits: 4, type: "theory" },
        { code: "CS3691", name: "Embedded Systems and IoT",                           credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"}
      ],
      "Semester 7": [
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "Elec",   name: "Management Elective",                                credits: 3, type: "elective"},
        { code: "CS3711", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 8": [
        { code: "CS3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING
  ───────────────────────────────────────────── */
  "AIML": {
    label: "B.E. Artificial Intelligence and Machine Learning",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3256", name: "Physics for Information Science",                    credits: 4, type: "theory" },
        { code: "BE3251", name: "Basic Electrical and Electronics Engineering",       credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "CS3251", name: "Programming in C",                                   credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "CS3271", name: "Programming in C Laboratory",                        credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3354", name: "Discrete Mathematics",                               credits: 4, type: "theory" },
        { code: "CS3351", name: "Digital Principles and Computer Organization",       credits: 4, type: "theory" },
        { code: "CS3352", name: "Foundations of Data Science",                        credits: 4, type: "theory" },
        { code: "CD3291", name: "Data Structures and Algorithms",                     credits: 4, type: "theory" },
        { code: "CS3391", name: "Object Oriented Programming",                        credits: 4, type: "theory" },
        { code: "CD3281", name: "Data Structures and Algorithms Laboratory",          credits: 2, type: "lab"    },
        { code: "CS3381", name: "Object Oriented Programming Laboratory",             credits: 2, type: "lab"    },
        { code: "CS3361", name: "Data Science Laboratory",                            credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "CS3452", name: "Theory of Computation",                              credits: 3, type: "theory" },
        { code: "AL3452", name: "Operating Systems",                                  credits: 3, type: "theory" },
        { code: "AD3391", name: "Database Design and Management",                     credits: 4, type: "theory" },
        { code: "AL3451", name: "Machine Learning",                                   credits: 4, type: "theory" },
        { code: "AL3391", name: "Artificial Intelligence",                            credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "AL3411", name: "Artificial Intelligence & Machine Learning Laboratory", credits: 2, type: "lab" },
        { code: "AD3381", name: "Database Design and Management Laboratory",          credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "AL3501", name: "Natural Language Processing",                        credits: 4, type: "theory" },
        { code: "AL3502", name: "Deep Learning for Vision",                           credits: 4, type: "theory" },
        { code: "CB3491", name: "Cryptography and Cyber Security",                    credits: 3, type: "theory" },
        { code: "CS3551", name: "Distributed Computing",                              credits: 3, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"}
      ],
      "Semester 6": [
        { code: "CCS356", name: "Object Oriented Software Engineering",               credits: 4, type: "theory" },
        { code: "CS3691", name: "Embedded Systems and IoT",                           credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"}
      ],
      "Semester 7": [
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "Elec",   name: "Management Elective",                                credits: 3, type: "elective"},
        { code: "AL3711", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 8": [
        { code: "AL3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.TECH. INFORMATION TECHNOLOGY
  ───────────────────────────────────────────── */
  "IT": {
    label: "B.Tech. Information Technology",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3256", name: "Physics for Information Science",                    credits: 4, type: "theory" },
        { code: "BE3251", name: "Basic Electrical and Electronics Engineering",       credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "CS3251", name: "Programming in C",                                   credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "CS3271", name: "Programming in C Laboratory",                        credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3354", name: "Discrete Mathematics",                               credits: 4, type: "theory" },
        { code: "CS3351", name: "Digital Principles and Computer Organization",       credits: 4, type: "theory" },
        { code: "CS3352", name: "Foundations of Data Science",                        credits: 4, type: "theory" },
        { code: "CD3291", name: "Data Structures and Algorithms",                     credits: 4, type: "theory" },
        { code: "CS3391", name: "Object Oriented Programming",                        credits: 4, type: "theory" },
        { code: "CD3281", name: "Data Structures and Algorithms Laboratory",          credits: 2, type: "lab"    },
        { code: "CS3381", name: "Object Oriented Programming Laboratory",             credits: 2, type: "lab"    },
        { code: "CS3361", name: "Data Science Laboratory",                            credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "CS3452", name: "Theory of Computation",                              credits: 3, type: "theory" },
        { code: "CS3491", name: "Artificial Intelligence and Machine Learning",       credits: 4, type: "theory" },
        { code: "CS3492", name: "Database Management Systems",                        credits: 4, type: "theory" },
        { code: "IT3401", name: "Web Essentials",                                     credits: 4, type: "theory" },
        { code: "CS3451", name: "Introduction to Operating Systems",                  credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "CS3461", name: "Operating Systems Laboratory",                       credits: 2, type: "lab"    },
        { code: "CS3481", name: "Database Management Systems Laboratory",             credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "CS3591", name: "Computer Networks",                                  credits: 4, type: "theory" },
        { code: "IT3501", name: "Full Stack Web Development",                         credits: 4, type: "theory" },
        { code: "CS3551", name: "Distributed Computing",                              credits: 3, type: "theory" },
        { code: "CS3691", name: "Embedded Systems and IoT",                           credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "IT3511", name: "Full Stack Web Development Laboratory",              credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "CCS356", name: "Object Oriented Software Engineering",               credits: 4, type: "theory" },
        { code: "",        name: "Open Elective - I",                                 credits: 3, type: "elective"},
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"},
        { code: "IT3681", name: "Mobile Applications Development Laboratory",         credits: 2, type: "lab"    }
      ],
      "Semester 7": [
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "Elec",   name: "Management Elective",                                credits: 3, type: "elective"},
        { code: "IT3711", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 8": [
        { code: "IT3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.TECH. ARTIFICIAL INTELLIGENCE AND DATA SCIENCE
  ───────────────────────────────────────────── */
  "AIDS": {
    label: "B.Tech. Artificial Intelligence and Data Science",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3256", name: "Physics for Information Science",                    credits: 4, type: "theory" },
        { code: "BE3251", name: "Basic Electrical and Electronics Engineering",       credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "AD3251", name: "Data Structures Design",                             credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "AD3271", name: "Data Structures Design Laboratory",                  credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3354", name: "Discrete Mathematics",                               credits: 4, type: "theory" },
        { code: "CS3351", name: "Digital Principles and Computer Organization",       credits: 4, type: "theory" },
        { code: "AD3391", name: "Database Design and Management",                     credits: 4, type: "theory" },
        { code: "AD3351", name: "Design and Analysis of Algorithms",                  credits: 4, type: "theory" },
        { code: "AD3301", name: "Data Exploration and Visualization",                 credits: 4, type: "theory" },
        { code: "AL3391", name: "Artificial Intelligence",                            credits: 4, type: "theory" },
        { code: "AD3381", name: "Database Design and Management Laboratory",          credits: 2, type: "lab"    },
        { code: "AD3311", name: "Artificial Intelligence Laboratory",                 credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "MA3391", name: "Probability and Statistics",                         credits: 4, type: "theory" },
        { code: "AL3452", name: "Operating Systems",                                  credits: 3, type: "theory" },
        { code: "AL3451", name: "Machine Learning",                                   credits: 4, type: "theory" },
        { code: "AD3491", name: "Fundamentals of Data Science and Analytics",         credits: 4, type: "theory" },
        { code: "CS3591", name: "Computer Networks",                                  credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "AD3411", name: "Data Science and Analytics Laboratory",              credits: 2, type: "lab"    },
        { code: "AD3461", name: "Machine Learning Laboratory",                        credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "AD3501", name: "Deep Learning",                                      credits: 4, type: "theory" },
        { code: "CW3551", name: "Data and Information Security",                      credits: 3, type: "theory" },
        { code: "CS3551", name: "Distributed Computing",                              credits: 3, type: "theory" },
        { code: "CCS334", name: "Big Data Analytics",                                 credits: 3, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "AD3511", name: "Deep Learning Laboratory",                           credits: 2, type: "lab"    },
        { code: "AD3512", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 6": [
        { code: "CS3691", name: "Embedded Systems and IoT",                           credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"}
      ],
      "Semester 7": [
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "Elec",   name: "Management Elective",                                credits: 3, type: "elective"}
      ],
      "Semester 8": [
        { code: "AD3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. ELECTRONICS AND COMMUNICATION ENGINEERING
  ───────────────────────────────────────────── */
  "ECE": {
    label: "B.E. Electronics and Communication Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3254", name: "Physics for Electronics Engineering",                credits: 4, type: "theory" },
        { code: "BE3254", name: "Electrical and Instrumentation Engineering",         credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "EC3251", name: "Circuit Analysis",                                   credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "EC3271", name: "Circuits Analysis Laboratory",                       credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3355", name: "Random Processes and Linear Algebra",                credits: 4, type: "theory" },
        { code: "CS3353", name: "C Programming and Data Structures",                  credits: 4, type: "theory" },
        { code: "EC3354", name: "Signals and Systems",                                credits: 4, type: "theory" },
        { code: "EC3353", name: "Electronic Devices and Circuits",                    credits: 4, type: "theory" },
        { code: "EC3351", name: "Control Systems",                                    credits: 4, type: "theory" },
        { code: "EC3352", name: "Digital Systems Design",                             credits: 4, type: "theory" },
        { code: "EC3361", name: "Electronic Devices and Circuits Laboratory",         credits: 2, type: "lab"    },
        { code: "CS3362", name: "C Programming and Data Structures Laboratory",       credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "EC3452", name: "Electromagnetic Fields",                             credits: 3, type: "theory" },
        { code: "EC3401", name: "Networks and Security",                              credits: 4, type: "theory" },
        { code: "EC3451", name: "Linear Integrated Circuits",                         credits: 4, type: "theory" },
        { code: "EC3492", name: "Digital Signal Processing",                          credits: 4, type: "theory" },
        { code: "EC3491", name: "Communication Systems",                              credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "EC3461", name: "Communication Systems Laboratory",                   credits: 2, type: "lab"    },
        { code: "EC3462", name: "Linear Integrated Circuits Laboratory",              credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "EC3501", name: "Wireless Communication",                             credits: 4, type: "theory" },
        { code: "EC3552", name: "VLSI and Chip Design",                               credits: 4, type: "theory" },
        { code: "EC3551", name: "Transmission Lines and RF Systems",                  credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "EC3561", name: "VLSI Laboratory",                                    credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "ET3491", name: "Embedded Systems and IOT Design",                    credits: 4, type: "theory" },
        { code: "CS3491", name: "Artificial Intelligence and Machine Learning",       credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"}
      ],
      "Semester 7": [
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "Elec",   name: "Management Elective",                                credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - II",                                credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - III",                               credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - IV",                                credits: 3, type: "elective"},
        { code: "EC3711", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 8": [
        { code: "EC3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. ELECTRICAL AND ELECTRONICS ENGINEERING
  ───────────────────────────────────────────── */
  "EEE": {
    label: "B.E. Electrical and Electronics Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3202", name: "Physics for Electrical Engineering",                 credits: 4, type: "theory" },
        { code: "BE3255", name: "Basic Civil and Mechanical Engineering",             credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "EE3251", name: "Electric Circuit Analysis",                          credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "EE3271", name: "Electric Circuits Laboratory",                       credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3303", name: "Probability and Complex Functions",                  credits: 4, type: "theory" },
        { code: "EE3301", name: "Electromagnetic Fields",                             credits: 4, type: "theory" },
        { code: "EE3302", name: "Digital Logic Circuits",                             credits: 4, type: "theory" },
        { code: "EC3301", name: "Electron Devices and Circuits",                      credits: 4, type: "theory" },
        { code: "EE3303", name: "Electrical Machines - I",                            credits: 4, type: "theory" },
        { code: "CS3353", name: "C Programming and Data Structures",                  credits: 4, type: "theory" },
        { code: "EC3311", name: "Electronic Devices and Circuits Laboratory",         credits: 2, type: "lab"    },
        { code: "EE3311", name: "Electrical Machines Laboratory - I",                 credits: 2, type: "lab"    },
        { code: "CS3362", name: "C Programming and Data Structures Laboratory",       credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "EE3401", name: "Transmission and Distribution",                      credits: 4, type: "theory" },
        { code: "EE3402", name: "Linear Integrated Circuits",                         credits: 4, type: "theory" },
        { code: "EE3403", name: "Measurements and Instrumentation",                   credits: 4, type: "theory" },
        { code: "EE3404", name: "Microprocessor and Microcontroller",                 credits: 4, type: "theory" },
        { code: "EE3405", name: "Electrical Machines - II",                           credits: 4, type: "theory" },
        { code: "EE3411", name: "Electrical Machines Laboratory - II",                credits: 2, type: "lab"    },
        { code: "EE3412", name: "Linear and Digital Circuits Laboratory - I",         credits: 2, type: "lab"    },
        { code: "EE3413", name: "Microprocessor and Microcontroller Laboratory",      credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "EE3501", name: "Power System Analysis",                              credits: 4, type: "theory" },
        { code: "EE3591", name: "Power Electronics",                                  credits: 4, type: "theory" },
        { code: "EE3503", name: "Control Systems",                                    credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "EE3511", name: "Power Electronics Laboratory",                       credits: 2, type: "lab"    },
        { code: "EE3512", name: "Control and Instrumentation Laboratory",             credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "EE3601", name: "Protection and Switchgear",                          credits: 4, type: "theory" },
        { code: "EE3602", name: "Power System Operation and Control",                 credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"},
        { code: "EE3611", name: "Power System Laboratory",                            credits: 2, type: "lab"    }
      ],
      "Semester 7": [
        { code: "EE3701", name: "High Voltage Engineering",                           credits: 3, type: "theory" },
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "",        name: "Open Elective - II",                                credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - III",                               credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - IV",                                credits: 3, type: "elective"}
      ],
      "Semester 8": [
        { code: "EE3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. ELECTRONICS AND INSTRUMENTATION ENGINEERING
  ───────────────────────────────────────────── */
  "EIE": {
    label: "B.E. Electronics and Instrumentation Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3255", name: "Physics for Instrumentation Engineering",            credits: 4, type: "theory" },
        { code: "BE3255", name: "Basic Civil and Mechanical Engineering",             credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "EE3251", name: "Electric Circuit Analysis",                          credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "EE3271", name: "Electric Circuits Laboratory",                       credits: 2, type: "lab"    },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3353", name: "Transforms and Differential Equations",              credits: 4, type: "theory" },
        { code: "EI3351", name: "Analog Electronics",                                 credits: 4, type: "theory" },
        { code: "EI3352", name: "Digital System Design and Applications",             credits: 4, type: "theory" },
        { code: "EI3353", name: "Transducers Engineering",                            credits: 4, type: "theory" },
        { code: "EI3354", name: "Linear Integrated Circuits and Applications",        credits: 4, type: "theory" },
        { code: "CS3353", name: "C Programming and Data Structures",                  credits: 4, type: "theory" },
        { code: "EI3361", name: "Semiconductor Devices and Circuits Laboratory",      credits: 2, type: "lab"    },
        { code: "CS3362", name: "C Programming and Data Structures Laboratory",       credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "EI3451", name: "Industrial Instrumentation",                         credits: 4, type: "theory" },
        { code: "IC3451", name: "Automatic Control Systems",                          credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "EI3401", name: "Embedded Systems",                                   credits: 4, type: "theory" },
        { code: "OCS352", name: "IoT Concepts and Applications",                      credits: 3, type: "theory" },
        { code: "IC3452", name: "Electrical Machines and Drives",                     credits: 4, type: "theory" },
        { code: "EI3461", name: "Digital and Linear Integrated Circuits Laboratory",  credits: 2, type: "lab"    },
        { code: "EI3462", name: "Sensors and Signal Conditioning Circuits Laboratory",credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "EI3551", name: "Process Control",                                    credits: 4, type: "theory" },
        { code: "EI3501", name: "Signal and Image Processing",                        credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "EI3561", name: "Process Control and Instrumentation Laboratory",     credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "EI3651", name: "Industrial Automation Systems",                      credits: 4, type: "theory" },
        { code: "EI3652", name: "Introduction to Industrial Processes, Measurement and Control", credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"},
        { code: "EI3661", name: "Industrial Automation Systems Laboratory",           credits: 2, type: "lab"    }
      ],
      "Semester 7": [
        { code: "EI3751", name: "Industrial Data Communication",                      credits: 3, type: "theory" },
        { code: "EI3752", name: "Applied Machine Learning",                           credits: 3, type: "theory" },
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "",        name: "Open Elective - II",                                credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - III",                               credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - IV",                                credits: 3, type: "elective"}
      ],
      "Semester 8": [
        { code: "EI3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. MECHANICAL ENGINEERING
  ───────────────────────────────────────────── */
  "MECH": {
    label: "B.E. Mechanical Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3251", name: "Materials Science",                                  credits: 4, type: "theory" },
        { code: "BE3251", name: "Basic Electrical and Electronics Engineering",       credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "BE3271", name: "Basic Electrical and Electronics Engineering Laboratory", credits: 2, type: "lab" },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3351", name: "Transforms and Partial Differential Equations",      credits: 4, type: "theory" },
        { code: "ME3351", name: "Engineering Mechanics",                              credits: 4, type: "theory" },
        { code: "ME3391", name: "Engineering Thermodynamics",                         credits: 4, type: "theory" },
        { code: "CE3391", name: "Fluid Mechanics and Machinery",                      credits: 4, type: "theory" },
        { code: "ME3392", name: "Engineering Materials and Metallurgy",               credits: 4, type: "theory" },
        { code: "ME3393", name: "Manufacturing Processes",                            credits: 4, type: "theory" },
        { code: "ME3381", name: "Computer Aided Machine Drawing",                     credits: 2, type: "lab"    },
        { code: "ME3382", name: "Manufacturing Technology Laboratory",                credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "ME3491", name: "Theory of Machines",                                 credits: 4, type: "theory" },
        { code: "ME3451", name: "Thermal Engineering",                                credits: 4, type: "theory" },
        { code: "ME3492", name: "Hydraulics and Pneumatics",                          credits: 4, type: "theory" },
        { code: "ME3493", name: "Manufacturing Technology",                           credits: 4, type: "theory" },
        { code: "CE3491", name: "Strength of Materials",                              credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "CE3481", name: "Strength of Materials and Fluid Machinery Laboratory", credits: 2, type: "lab"  },
        { code: "ME3461", name: "Thermal Engineering Laboratory",                     credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "ME3591", name: "Design of Machine Elements",                         credits: 4, type: "theory" },
        { code: "ME3592", name: "Metrology and Measurements",                         credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "ME3511", name: "Summer Internship",                                  credits: 2, type: "project" },
        { code: "ME3581", name: "Metrology and Dynamics Laboratory",                  credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "ME3691", name: "Heat and Mass Transfer",                             credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"},
        { code: "ME3681", name: "CAD/CAM Laboratory",                                 credits: 2, type: "lab"    },
        { code: "ME3682", name: "Heat Transfer Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 7": [
        { code: "ME3791", name: "Mechatronics and IoT",                               credits: 4, type: "theory" },
        { code: "ME3792", name: "Computer Integrated Manufacturing",                  credits: 4, type: "theory" },
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "GE3792", name: "Industrial Management",                              credits: 3, type: "theory" },
        { code: "ME3781", name: "Mechatronics and IoT Laboratory",                    credits: 2, type: "lab"    },
        { code: "ME3711", name: "Summer Internship",                                  credits: 2, type: "project" }
      ],
      "Semester 8": [
        { code: "ME3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     B.E. CIVIL ENGINEERING
  ───────────────────────────────────────────── */
  "CIVIL": {
    label: "B.E. Civil Engineering",
    semesters: {
      "Semester 1": [
        { code: "HS3152", name: "Professional English - I",                           credits: 3, type: "theory" },
        { code: "MA3151", name: "Matrices and Calculus",                              credits: 4, type: "theory" },
        { code: "PH3151", name: "Engineering Physics",                                credits: 4, type: "theory" },
        { code: "CY3151", name: "Engineering Chemistry",                              credits: 4, type: "theory" },
        { code: "GE3151", name: "Problem Solving and Python Programming",             credits: 4, type: "theory" },
        { code: "GE3152", name: "Heritage of Tamils",                                 credits: 2, type: "theory" },
        { code: "GE3171", name: "Problem Solving and Python Programming Laboratory",  credits: 2, type: "lab"    },
        { code: "BS3171", name: "Physics and Chemistry Laboratory",                   credits: 2, type: "lab"    },
        { code: "GE3172", name: "English Laboratory",                                 credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "HS3252", name: "Professional English - II",                          credits: 3, type: "theory" },
        { code: "MA3251", name: "Statistics and Numerical Methods",                   credits: 4, type: "theory" },
        { code: "PH3201", name: "Physics for Civil Engineering",                      credits: 4, type: "theory" },
        { code: "BE3252", name: "Basic Electrical, Electronics and Instrumentation Engineering", credits: 4, type: "theory" },
        { code: "GE3251", name: "Engineering Graphics",                               credits: 4, type: "theory" },
        { code: "GE3252", name: "Tamils and Technology",                              credits: 2, type: "theory" },
        { code: "GE3271", name: "Engineering Practices Laboratory",                   credits: 2, type: "lab"    },
        { code: "BE3272", name: "Basic Electrical, Electronics and Instrumentation Engineering Laboratory", credits: 2, type: "lab" },
        { code: "GE3272", name: "Communication Laboratory",                           credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MA3351", name: "Transforms and Differential Equations",              credits: 4, type: "theory" },
        { code: "ME3351", name: "Engineering Mechanics",                              credits: 4, type: "theory" },
        { code: "CE3301", name: "Fluid Mechanics",                                    credits: 4, type: "theory" },
        { code: "CE3302", name: "Construction Materials and Technology",              credits: 4, type: "theory" },
        { code: "CE3303", name: "Water Supply and Wastewater Engineering",            credits: 4, type: "theory" },
        { code: "CE3351", name: "Surveying and Levelling",                            credits: 4, type: "theory" },
        { code: "CE3361", name: "Surveying and Levelling Laboratory",                 credits: 2, type: "lab"    },
        { code: "CE3311", name: "Water and Wastewater Analysis Laboratory",           credits: 2, type: "lab"    },
        { code: "GE3361", name: "Professional Development",                           credits: 1, type: "audit"  }
      ],
      "Semester 4": [
        { code: "CE3401", name: "Applied Hydraulics Engineering",                     credits: 4, type: "theory" },
        { code: "CE3402", name: "Strength of Materials",                              credits: 4, type: "theory" },
        { code: "CE3403", name: "Concrete Technology",                                credits: 4, type: "theory" },
        { code: "CE3304", name: "Soil Mechanics",                                     credits: 4, type: "theory" },
        { code: "CE3405", name: "Highway and Railway Engineering",                    credits: 4, type: "theory" },
        { code: "GE3451", name: "Environmental Sciences and Sustainability",          credits: 3, type: "theory" },
        { code: "CE3411", name: "Hydraulic Engineering Laboratory",                   credits: 2, type: "lab"    },
        { code: "CE3412", name: "Materials Testing Laboratory",                       credits: 2, type: "lab"    },
        { code: "CE3413", name: "Soil Mechanics Laboratory",                          credits: 2, type: "lab"    }
      ],
      "Semester 5": [
        { code: "CE3501", name: "Design of Reinforced Concrete Structural Elements",  credits: 4, type: "theory" },
        { code: "CE3502", name: "Structural Analysis I",                              credits: 4, type: "theory" },
        { code: "CE3503", name: "Foundation Engineering",                             credits: 4, type: "theory" },
        { code: "",        name: "Mandatory Course - I",                              credits: 3, type: "elective"},
        { code: "CE3511", name: "Highway Engineering Laboratory",                     credits: 2, type: "lab"    },
        { code: "CE3512", name: "Survey Camp",                                        credits: 2, type: "lab"    }
      ],
      "Semester 6": [
        { code: "CE3601", name: "Design of Steel Structural Elements",                credits: 4, type: "theory" },
        { code: "CE3602", name: "Structural Analysis II",                             credits: 4, type: "theory" },
        { code: "AG3601", name: "Engineering Geology",                                credits: 3, type: "theory" },
        { code: "",        name: "Mandatory Course - II",                             credits: 3, type: "elective"},
        { code: "CE3611", name: "Building Drawing and Detailing Laboratory",          credits: 2, type: "lab"    }
      ],
      "Semester 7": [
        { code: "CE3701", name: "Estimation, Costing and Valuation Engineering",      credits: 3, type: "theory" },
        { code: "AI3404", name: "Hydrology and Water Resources Engineering",          credits: 3, type: "theory" },
        { code: "GE3791", name: "Human Values and Ethics",                            credits: 3, type: "theory" },
        { code: "GE3752", name: "Total Quality Management",                           credits: 3, type: "theory" },
        { code: "",        name: "Open Elective - II",                                credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - III",                               credits: 3, type: "elective"},
        { code: "",        name: "Open Elective - IV",                                credits: 3, type: "elective"}
      ],
      "Semester 8": [
        { code: "CE3811", name: "Project Work / Internship",                          credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: M.E. COMPUTER SCIENCE AND ENGINEERING
  ───────────────────────────────────────────── */
  "ME_CSE": {
    label: "M.E. Computer Science and Engineering",
    semesters: {
      "Semester 1": [
        { code: "MA4151", name: "Applied Probability and Statistics for Computer Science Engineers", credits: 4, type: "theory" },
        { code: "RM4151", name: "Research Methodology and IPR",                       credits: 3, type: "theory" },
        { code: "CP4151", name: "Advanced Data Structures and Algorithms",            credits: 4, type: "theory" },
        { code: "CP4152", name: "Database Practices",                                 credits: 4, type: "theory" },
        { code: "CP4153", name: "Network Technologies",                               credits: 4, type: "theory" },
        { code: "CP4154", name: "Principles of Programming Languages",                credits: 4, type: "theory" },
        { code: "CP4161", name: "Advanced Data Structures and Algorithms Laboratory", credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "CP4291", name: "Internet of Things",                                 credits: 4, type: "theory" },
        { code: "CP4292", name: "Multicore Architecture and Programming",             credits: 4, type: "theory" },
        { code: "CP4252", name: "Machine Learning",                                   credits: 4, type: "theory" },
        { code: "SE4151", name: "Advanced Software Engineering",                      credits: 4, type: "theory" },
        { code: "CP4211", name: "Term Paper Writing and Seminar",                     credits: 2, type: "lab"    },
        { code: "CP4212", name: "Software Engineering Laboratory",                    credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "CP4391", name: "Security Practices",                                 credits: 4, type: "theory" },
        { code: "CP4311", name: "Project Work I",                                     credits:12, type: "project" }
      ],
      "Semester 4": [
        { code: "CP4411", name: "Project Work II",                                    credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: M.E. POWER ELECTRONICS AND DRIVES
  ───────────────────────────────────────────── */
  "ME_PED": {
    label: "M.E. Power Electronics and Drives",
    semesters: {
      "Semester 1": [
        { code: "MA4106", name: "Applied Mathematics for Power Electronics Engineers",credits: 4, type: "theory" },
        { code: "PX4101", name: "Analysis of Electrical Machines",                    credits: 4, type: "theory" },
        { code: "PX4151", name: "Analysis of Power Converters",                       credits: 4, type: "theory" },
        { code: "PX4102", name: "Modeling and Design of SMPS",                        credits: 4, type: "theory" },
        { code: "RM4151", name: "Research Methodology and IPR",                       credits: 3, type: "theory" },
        { code: "PX4161", name: "Power Converters Laboratory",                        credits: 2, type: "lab"    },
        { code: "PX4111", name: "Analog and Digital Controllers for PE Converters Laboratory", credits: 2, type: "lab" }
      ],
      "Semester 2": [
        { code: "PX4201", name: "Analysis of Electrical Drives",                      credits: 4, type: "theory" },
        { code: "PX4202", name: "Special Electrical Machines",                        credits: 4, type: "theory" },
        { code: "PX4291", name: "Electric Vehicles and Power Management",             credits: 4, type: "theory" },
        { code: "PX4211", name: "Power Electronics and Drives Laboratory",            credits: 2, type: "lab"    },
        { code: "PX4212", name: "Design Laboratory for Power Electronics Systems",    credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "PX4311", name: "Project Work I",                                     credits:12, type: "project" }
      ],
      "Semester 4": [
        { code: "PX4411", name: "Project Work II",                                    credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: M.E. APPLIED ELECTRONICS
  ───────────────────────────────────────────── */
  "ME_AE": {
    label: "M.E. Applied Electronics",
    semesters: {
      "Semester 1": [
        { code: "MA4101", name: "Applied Mathematics for Electronics Engineers",      credits: 4, type: "theory" },
        { code: "RM4151", name: "Research Methodology and IPR",                       credits: 3, type: "theory" },
        { code: "AP4151", name: "Advanced Digital Signal Processing",                 credits: 4, type: "theory" },
        { code: "AP4152", name: "Advanced Digital System Design",                     credits: 4, type: "theory" },
        { code: "AP4153", name: "Semiconductor Devices and Modeling",                 credits: 4, type: "theory" },
        { code: "VL4152", name: "Digital CMOS VLSI Design",                           credits: 4, type: "theory" },
        { code: "AP4111", name: "Electronics System Design Laboratory",               credits: 2, type: "lab"    },
        { code: "AP4112", name: "Signal Processing Laboratory",                       credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "AP4201", name: "Analog and Mixed Signal IC Design",                  credits: 4, type: "theory" },
        { code: "AP4251", name: "Industrial Internet of Things",                      credits: 4, type: "theory" },
        { code: "AP4202", name: "Power Conversion Circuits for Electronics",          credits: 4, type: "theory" },
        { code: "AP4203", name: "Embedded Systems",                                   credits: 4, type: "theory" },
        { code: "AP4211", name: "VLSI Design Laboratory",                             credits: 2, type: "lab"    },
        { code: "AP4212", name: "Mini Project with Seminar",                          credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "AP4311", name: "Project Work I",                                     credits:12, type: "project" }
      ],
      "Semester 4": [
        { code: "AP4411", name: "Project Work II",                                    credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: MASTER OF COMPUTER APPLICATIONS
  ───────────────────────────────────────────── */
  "MCA": {
    label: "Master of Computer Applications",
    semesters: {
      "Semester 1": [
        { code: "MA4151", name: "Applied Probability and Statistics for Computer Science Engineers", credits: 4, type: "theory" },
        { code: "RM4151", name: "Research Methodology and IPR",                       credits: 3, type: "theory" },
        { code: "MC4101", name: "Advanced Data Structures and Algorithms",            credits: 4, type: "theory" },
        { code: "MC4102", name: "Object Oriented Software Engineering",               credits: 4, type: "theory" },
        { code: "MC4103", name: "Python Programming",                                 credits: 4, type: "theory" },
        { code: "MC4104", name: "Fundamentals of Accounting",                         credits: 3, type: "theory" },
        { code: "MC4111", name: "Advanced Data Structures and Algorithms Laboratory", credits: 2, type: "lab"    },
        { code: "MC4112", name: "Python Programming Laboratory",                      credits: 2, type: "lab"    },
        { code: "MC4113", name: "Communication Skills Enhancement - I",               credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "MC4201", name: "Full Stack Web Development",                         credits: 4, type: "theory" },
        { code: "MC4202", name: "Advanced Database Technology",                       credits: 4, type: "theory" },
        { code: "MC4203", name: "Cloud Computing Technologies",                       credits: 4, type: "theory" },
        { code: "MC4204", name: "Mobile Application Development",                     credits: 4, type: "theory" },
        { code: "MC4205", name: "Cyber Security",                                     credits: 3, type: "theory" },
        { code: "MC4211", name: "Advanced Database Technology Laboratory",            credits: 2, type: "lab"    },
        { code: "MC4212", name: "Full Stack Web Development Laboratory",              credits: 2, type: "lab"    },
        { code: "MC4213", name: "Communication Skills Enhancement - II",              credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "MC4301", name: "Machine Learning",                                   credits: 4, type: "theory" },
        { code: "MC4302", name: "Internet of Things",                                 credits: 4, type: "theory" },
        { code: "MC4311", name: "Machine Learning Laboratory",                        credits: 2, type: "lab"    },
        { code: "MC4312", name: "Internet of Things Laboratory",                      credits: 2, type: "lab"    }
      ],
      "Semester 4": [
        { code: "MC4411", name: "Project Work",                                       credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: MASTER OF BUSINESS ADMINISTRATION
  ───────────────────────────────────────────── */
  "MBA": {
    label: "Master of Business Administration",
    semesters: {
      "Semester 1": [
        { code: "BA4101", name: "Statistics for Management",                          credits: 4, type: "theory" },
        { code: "BA4102", name: "Management Concepts and Organizational Behavior",    credits: 4, type: "theory" },
        { code: "BA4103", name: "Managerial Economics",                               credits: 4, type: "theory" },
        { code: "BA4104", name: "Accounting for Decision Making",                     credits: 4, type: "theory" },
        { code: "BA4105", name: "Legal Aspects of Business",                          credits: 4, type: "theory" },
        { code: "BA4106", name: "Information Management",                             credits: 4, type: "theory" },
        { code: "",        name: "Non-Functional Elective",                           credits: 3, type: "elective"},
        { code: "BA4111", name: "Indian Ethos (Seminar)",                             credits: 2, type: "lab"    },
        { code: "BA4112", name: "Business Communication (Laboratory)",                credits: 2, type: "lab"    }
      ],
      "Semester 2": [
        { code: "BA4201", name: "Quantitative Techniques for Decision Making",        credits: 4, type: "theory" },
        { code: "BA4202", name: "Financial Management",                               credits: 4, type: "theory" },
        { code: "BA4203", name: "Human Resource Management",                          credits: 4, type: "theory" },
        { code: "BA4204", name: "Operations Management",                              credits: 4, type: "theory" },
        { code: "BA4205", name: "Business Research Methods",                          credits: 4, type: "theory" },
        { code: "BA4206", name: "Business Analytics",                                 credits: 4, type: "theory" },
        { code: "BA4207", name: "Marketing Management",                               credits: 4, type: "theory" },
        { code: "BA4211", name: "Business Ethics (Seminar)",                          credits: 2, type: "lab"    },
        { code: "BA4212", name: "Data Analysis and Business Modelling (Laboratory)",  credits: 2, type: "lab"    }
      ],
      "Semester 3": [
        { code: "BA4301", name: "Strategic Management",                               credits: 4, type: "theory" },
        { code: "BA4302", name: "International Business",                             credits: 4, type: "theory" },
        { code: "BA4311", name: "Creativity and Innovation Laboratory",               credits: 2, type: "lab"    },
        { code: "BA4312", name: "Summer Internship",                                  credits: 3, type: "project" }
      ],
      "Semester 4": [
        { code: "BA4411", name: "Project Work",                                       credits:12, type: "project" }
      ]
    }
  },

  /* ─────────────────────────────────────────────
     PG: M.ARCH. GENERAL
  ───────────────────────────────────────────── */
  "MARCH": {
    label: "M.Arch. General",
    semesters: {
      "Semester 1": [
        { code: "MH4101", name: "Process in Design",                                  credits: 4, type: "theory" },
        { code: "MH4102", name: "Contemporary Architectural Practices",               credits: 4, type: "theory" },
        { code: "MH4103", name: "Emerging Practices in Housing",                      credits: 4, type: "theory" },
        { code: "MH4151", name: "Society, Culture, Media and Technology",             credits: 4, type: "theory" },
        { code: "MH4121", name: "Building Information Modelling",                     credits: 4, type: "theory" },
        { code: "MH4111", name: "Process Based Design Studio",                        credits: 6, type: "project" }
      ],
      "Semester 2": [
        { code: "RM4251", name: "Research Methodologies for Built Environment",       credits: 4, type: "theory" },
        { code: "MH4201", name: "Sustainable Architecture - Historic and Community Perspective", credits: 4, type: "theory" },
        { code: "MH4202", name: "Climate Change Adaptation and Resilience in Architecture", credits: 4, type: "theory" },
        { code: "MH4221", name: "Geographical Information Systems for Built Environment", credits: 4, type: "theory" },
        { code: "MH4211", name: "Sustainable Design Studio",                          credits: 6, type: "project" }
      ],
      "Semester 3": [
        { code: "MH4301", name: "Urban Design: Theory and Practice",                  credits: 4, type: "theory" },
        { code: "MH4302", name: "Architectural Conservation: Policies and Practice",  credits: 4, type: "theory" },
        { code: "MH4311", name: "Dissertation",                                       credits: 6, type: "project" },
        { code: "MH4312", name: "Urban Environment Design Studio",                    credits: 6, type: "project" },
        { code: "MH4313", name: "Internship Training",                                credits: 3, type: "project" }
      ],
      "Semester 4": [
        { code: "MH4411", name: "Thesis Project",                                     credits:12, type: "project" }
      ]
    }
  }

};

/* ─────────────────────────────────────────────────────
   GRADE POINTS  (Anna University Regulation 2021)
───────────────────────────────────────────────────── */
const GRADE_POINTS = {
  "O"  : 10,
  "A+" :  9,
  "A"  :  8,
  "B+" :  7,
  "B"  :  6,
  "C"  :  5,
  "RA" :  0,
  "U/A":  0,
  "W"  :  0
};

/* ─────────────────────────────────────────────────────
   HELPER UTILITIES
───────────────────────────────────────────────────── */

/**
 * Calculate GPA for a semester given an array of
 * { credits, gradePoint } objects.
 * Subjects with gradePoint === null are skipped.
 */
function calcGPA(subjects) {
  let totalPoints = 0, totalCredits = 0;
  subjects.forEach(({ credits, gradePoint }) => {
    if (gradePoint === null || gradePoint === undefined) return;
    totalPoints  += credits * gradePoint;
    totalCredits += credits;
  });
  return totalCredits === 0 ? null : totalPoints / totalCredits;
}

/**
 * Calculate cumulative CGPA across multiple semesters.
 * @param {Array<{ credits, gradePoint }[]>} semesterArrays
 */
function calcCGPA(semesterArrays) {
  let totalPoints = 0, totalCredits = 0;
  semesterArrays.flat().forEach(({ credits, gradePoint }) => {
    if (gradePoint === null || gradePoint === undefined) return;
    totalPoints  += credits * gradePoint;
    totalCredits += credits;
  });
  return totalCredits === 0 ? null : totalPoints / totalCredits;
}

/**
 * Get all department keys.
 */
function getDeptKeys() { return Object.keys(MCE_SUBJECTS); }

/**
 * Get all semester keys for a department.
 * @param {string} deptKey
 */
function getSemKeys(deptKey) {
  return Object.keys(MCE_SUBJECTS[deptKey]?.semesters || {});
}

/**
 * Get subject list for a specific dept + semester.
 * @param {string} deptKey
 * @param {string} semKey
 * @returns {{ code, name, credits, type }[]}
 */
function getSubjects(deptKey, semKey) {
  return MCE_SUBJECTS[deptKey]?.semesters?.[semKey] || [];
}

/* Expose to global scope for use in HTML files */
if (typeof window !== "undefined") {
  window.MCE_SUBJECTS  = MCE_SUBJECTS;
  window.GRADE_POINTS  = GRADE_POINTS;
  window.calcGPA       = calcGPA;
  window.calcCGPA      = calcCGPA;
  window.getDeptKeys   = getDeptKeys;
  window.getSemKeys    = getSemKeys;
  window.getSubjects   = getSubjects;
}

/* Node.js / CommonJS export for build tools */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MCE_SUBJECTS, GRADE_POINTS, calcGPA, calcCGPA, getDeptKeys, getSemKeys, getSubjects };
}
