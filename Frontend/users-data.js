// Mock data for skill matching feature
const skillSwapUsers = [
    {
        id: 101,
        name: "Alex Thompson",
        location: "San Francisco, USA",
        experience: 5,
        rating: 4.7,
        reviewCount: 28,
        sessions: 42,
        bio: "Software engineer specializing in web development with React and Node.js. I enjoy teaching through practical, hands-on projects that solve real-world problems.",
        skills: {
            teach: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Web Design"],
            learn: ["Spanish", "Photography", "Public Speaking"]
        },
        availability: ["weekday_evenings", "weekend_mornings"],
        experienceLevel: "advanced",
        isCertified: true,
        teachingStyle: "hands_on",
        locationPreference: "hybrid",
        languages: ["english", "french"],
        certifications: [
            { name: "AWS Certified Developer", year: "2022" },
            { name: "Meta React Developer", year: "2021" }
        ],
        reviews: [
            { reviewer: "Jamie L.", date: "Feb 2023", rating: 5, text: "Alex is an amazing teacher! Patient and knowledgeable." },
            { reviewer: "Chris M.", date: "Jan 2023", rating: 4.5, text: "Great at explaining complex concepts in simple terms." }
        ]
    },
    {
        id: 102,
        name: "Sophia Chen",
        location: "New York, USA",
        experience: 7,
        rating: 4.9,
        reviewCount: 42,
        sessions: 67,
        bio: "Data scientist and AI specialist. I believe in learning by doing and focus on teaching practical applications of machine learning and statistics.",
        skills: {
            teach: ["Python", "Machine Learning", "Data Science", "SQL", "Statistics", "TensorFlow"],
            learn: ["UI/UX Design", "Graphic Design", "Japanese"]
        },
        availability: ["weekday_mornings", "weekend_afternoons"],
        experienceLevel: "expert",
        isCertified: true,
        teachingStyle: "project_based",
        locationPreference: "remote",
        languages: ["english", "chinese"],
        certifications: [
            { name: "Google Data Analytics Professional", year: "2022" },
            { name: "IBM AI Engineering Professional", year: "2021" }
        ],
        reviews: [
            { reviewer: "Taylor R.", date: "Mar 2023", rating: 5, text: "Sophia made complex ML concepts feel accessible. Great mentor!" },
            { reviewer: "Jordan K.", date: "Dec 2022", rating: 5, text: "The projects we worked on together helped me land a job in data science." }
        ]
    },
    {
        id: 103,
        name: "Miguel Rodriguez",
        location: "Miami, USA",
        experience: 4,
        rating: 4.6,
        reviewCount: 19,
        sessions: 26,
        bio: "Language teacher specializing in Spanish and Portuguese. My teaching approach is conversational and focused on practical, everyday language use.",
        skills: {
            teach: ["Spanish", "Portuguese", "Language Teaching", "Translation", "Cultural Studies"],
            learn: ["JavaScript", "Web Development", "Digital Marketing"]
        },
        availability: ["weekday_afternoons", "weekday_evenings", "weekend_mornings"],
        experienceLevel: "intermediate",
        isCertified: true,
        teachingStyle: "theoretical",
        locationPreference: "local",
        languages: ["english", "spanish", "portuguese"],
        certifications: [
            { name: "TEFL Certification", year: "2021" },
            { name: "DELE C2 Spanish", year: "2019" }
        ],
        reviews: [
            { reviewer: "Sam P.", date: "Apr 2023", rating: 4.5, text: "Miguel's conversational approach helped me become comfortable speaking Spanish quickly." },
            { reviewer: "Alex T.", date: "Feb 2023", rating: 5, text: "Great teacher who tailors lessons to your interests and needs." }
        ]
    },
    {
        id: 104,
        name: "Emily Johnson",
        location: "Chicago, USA",
        experience: 6,
        rating: 4.8,
        reviewCount: 33,
        sessions: 45,
        bio: "UI/UX designer with a background in psychology. I focus on teaching user-centered design principles and how to create intuitive, accessible interfaces.",
        skills: {
            teach: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing", "User Research", "Prototyping"],
            learn: ["Python", "Data Visualization", "Photography"]
        },
        availability: ["weekday_evenings", "weekend_afternoons"],
        experienceLevel: "advanced",
        isCertified: false,
        teachingStyle: "mentor_style",
        locationPreference: "hybrid",
        languages: ["english"],
        certifications: [
            { name: "Google UX Design Professional", year: "2022" }
        ],
        reviews: [
            { reviewer: "Riley N.", date: "May 2023", rating: 5, text: "Emily's mentorship transformed how I approach design problems." },
            { reviewer: "Dana L.", date: "Mar 2023", rating: 4.5, text: "Great at providing constructive feedback that helps you grow." }
        ]
    },
    {
        id: 105,
        name: "James Wilson",
        location: "Seattle, USA",
        experience: 3,
        rating: 4.5,
        reviewCount: 15,
        sessions: 23,
        bio: "Professional photographer specializing in portrait and landscape photography. I teach both technical camera skills and artistic composition.",
        skills: {
            teach: ["Photography", "Portrait Photography", "Lightroom", "Photoshop", "Composition", "Lighting"],
            learn: ["Web Development", "Spanish", "Public Speaking"]
        },
        availability: ["weekday_mornings", "weekend_mornings", "weekend_afternoons"],
        experienceLevel: "intermediate",
        isCertified: false,
        teachingStyle: "hands_on",
        locationPreference: "local",
        languages: ["english"],
        certifications: [],
        reviews: [
            { reviewer: "Morgan T.", date: "Apr 2023", rating: 5, text: "James taught me how to actually use my camera beyond auto mode. Excellent teacher!" },
            { reviewer: "Casey R.", date: "Feb 2023", rating: 4, text: "Good at explaining technical concepts in an accessible way." }
        ]
    },
    {
        id: 106,
        name: "David Chen",
        location: "Boston, USA",
        experience: 8,
        rating: 4.8,
        reviewCount: 38,
        sessions: 55,
        bio: "Software engineer with expertise in machine learning and data science. I focus on project-based learning and practical applications of AI technologies.",
        skills: {
            teach: ["Python", "Machine Learning", "Data Science", "TensorFlow", "Deep Learning", "AI Ethics"],
            learn: ["Mobile Development", "UI/UX Design", "Public Speaking"]
        },
        availability: ["weekday_evenings", "weekend_afternoons"],
        experienceLevel: "expert",
        isCertified: true,
        teachingStyle: "project_based",
        locationPreference: "hybrid",
        languages: ["english", "mandarin"],
        certifications: [
            { name: "Google Machine Learning Engineer", year: "2021" },
            { name: "AWS Certified Machine Learning", year: "2022" }
        ],
        reviews: [
            { reviewer: "Leslie K.", date: "Jun 2023", rating: 5, text: "David's approach to teaching ML concepts is incredibly effective. Highly recommend!" },
            { reviewer: "Jordan M.", date: "Apr 2023", rating: 4.5, text: "Great mentor who pushes you to explore advanced concepts." }
        ]
    },
    {
        id: 107,
        name: "Sarah Johnson",
        location: "Austin, USA",
        experience: 6,
        rating: 4.9,
        reviewCount: 47,
        sessions: 72,
        bio: "Full-stack developer specialized in React and Node.js. I enjoy mentoring and have helped many beginners transition into professional development careers.",
        skills: {
            teach: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Web Development"],
            learn: ["UX Design", "Python", "Digital Marketing"]
        },
        availability: ["weekday_evenings", "weekend_mornings", "weekend_afternoons"],
        experienceLevel: "advanced",
        isCertified: true,
        teachingStyle: "mentor_style",
        locationPreference: "remote",
        languages: ["english", "spanish"],
        certifications: [
            { name: "Full Stack Web Developer", year: "2020" },
            { name: "AWS Certified Developer", year: "2021" }
        ],
        reviews: [
            { reviewer: "Mike T.", date: "Jul 2023", rating: 5, text: "Sarah is an amazing mentor. She helped me land my first dev job!" },
            { reviewer: "Alisha R.", date: "May 2023", rating: 5, text: "Patient, knowledgeable, and great at explaining complex concepts." }
        ]
    },
    {
        id: 108,
        name: "Marco Rivera",
        location: "San Diego, USA",
        experience: 5,
        rating: 4.7,
        reviewCount: 31,
        sessions: 43,
        bio: "Game developer and 3D modeler with a passion for teaching. I believe in learning by doing and creative expression through interactive experiences.",
        skills: {
            teach: ["Unity", "C#", "Game Development", "3D Modeling", "Blender", "Level Design"],
            learn: ["Digital Marketing", "UI/UX Design", "Japanese"]
        },
        availability: ["weekday_afternoons", "weekend_afternoons", "weekend_evenings"],
        experienceLevel: "intermediate",
        isCertified: false,
        teachingStyle: "hands_on",
        locationPreference: "hybrid",
        languages: ["english", "spanish"],
        certifications: [
            { name: "Unity Certified Developer", year: "2022" }
        ],
        reviews: [
            { reviewer: "Tyler S.", date: "Jun 2023", rating: 5, text: "Marco's teaching approach made game development fun and approachable." },
            { reviewer: "Nia J.", date: "Mar 2023", rating: 4.5, text: "Great at breaking down complex game mechanics into manageable steps." }
        ]
    },
    {
        id: 109,
        name: "Emma Wilson",
        location: "Portland, USA",
        experience: 7,
        rating: 4.8,
        reviewCount: 36,
        sessions: 58,
        bio: "Digital marketer specializing in SEO and content marketing. I focus on teaching practical strategies that deliver measurable results for businesses.",
        skills: {
            teach: ["SEO", "Content Marketing", "Google Analytics", "Digital Marketing", "Social Media Marketing", "Email Marketing"],
            learn: ["Web Development", "Design Thinking", "Data Visualization"]
        },
        availability: ["weekday_mornings", "weekday_afternoons", "weekend_mornings"],
        experienceLevel: "advanced",
        isCertified: true,
        teachingStyle: "project_based",
        locationPreference: "remote",
        languages: ["english"],
        certifications: [
            { name: "Google Digital Marketing", year: "2021" },
            { name: "Facebook Blueprint Certification", year: "2022" }
        ],
        reviews: [
            { reviewer: "Samira H.", date: "Jul 2023", rating: 5, text: "Emma's SEO strategies helped me double my website traffic in just 3 months!" },
            { reviewer: "Jack L.", date: "May 2023", rating: 4.5, text: "Practical, results-oriented approach to digital marketing. Highly recommend." }
        ]
    },
    {
        id: 110,
        name: "Priya Patel",
        location: "Denver, USA",
        experience: 4,
        rating: 4.6,
        reviewCount: 22,
        sessions: 34,
        bio: "UI/UX designer with a background in psychology and cognitive science. I teach user-centered design principles and how to create interfaces people love.",
        skills: {
            teach: ["UI/UX Design", "User Research", "Figma", "Wireframing", "Prototyping", "Usability Testing"],
            learn: ["JavaScript", "React", "Motion Design"]
        },
        availability: ["weekday_evenings", "weekend_afternoons", "weekend_mornings"],
        experienceLevel: "intermediate",
        isCertified: true,
        teachingStyle: "theoretical",
        locationPreference: "hybrid",
        languages: ["english", "hindi"],
        certifications: [
            { name: "Google UX Design Professional", year: "2021" }
        ],
        reviews: [
            { reviewer: "Carlos M.", date: "Jul 2023", rating: 4.5, text: "Priya helped me understand the psychology behind effective UX. Great teacher!" },
            { reviewer: "Leah W.", date: "Apr 2023", rating: 5, text: "Her approach to design thinking completely changed how I approach problems." }
        ]
    }
];

// All skills for autocomplete
const skillSwapAllSkills = [
    // Technology
    "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
    "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET",
    "HTML", "CSS", "SASS", "Bootstrap", "Tailwind CSS", "Material UI", "Web Design", "Responsive Design",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "DevOps", "CI/CD", "Git", "GitHub", "GitLab",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Firebase", "Redis", "ElasticSearch",
    "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Natural Language Processing", "Computer Vision",
    "Blockchain", "Smart Contracts", "Solidity", "Ethereum", "Web3",
    "Mobile Development", "iOS Development", "Android Development", "React Native", "Flutter",
    
    // Creative
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign",
    "Photography", "Portrait Photography", "Landscape Photography", "Product Photography", "Lightroom",
    "Videography", "Video Editing", "After Effects", "Premiere Pro", "Final Cut Pro", "DaVinci Resolve",
    "Graphic Design", "Logo Design", "Brand Identity", "Typography", "Illustration", "Animation",
    "Drawing", "Painting", "Sculpture", "Pottery", "Printmaking", "Calligraphy", "Watercolor",
    "Game Development", "Unity", "Unreal Engine", "3D Modeling", "Animation",
    
    // Business
    "Digital Marketing", "Content Marketing", "Social Media Marketing", "Email Marketing", "SEO", "Google Analytics",
    "Project Management", "Agile", "Scrum", "Kanban", "Product Management", "Business Strategy",
    "Marketing", "Branding", "Public Relations", "Customer Service", "Sales", "Negotiation", 
    "Financial Analysis", "Accounting", "Bookkeeping", "Tax Preparation", "Investment", "Stock Trading",
    "Business Development", "Entrepreneurship", "Startup", "E-commerce", "Business Planning",
    "Leadership", "Team Management", "Conflict Resolution", "Communication", "Public Speaking", "Presentation",
    
    // Languages
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese",
    "Arabic", "Hindi", "Bengali", "Urdu", "Turkish", "Dutch", "Swedish", "Polish", "Greek", "Hebrew",
    "Language Teaching", "Translation", "Interpretation", "ESL Teaching", "Linguistics",
    
    // Music
    "Guitar", "Piano", "Drums", "Singing", "Music Theory", "Songwriting", "Mixing", "Mastering",
    "Violin", "Cello", "Bass Guitar", "Saxophone", "Trumpet", "Flute",
    "Music Production", "Sound Design", "Audio Engineering", "Ableton Live", "Logic Pro", "FL Studio",
    "DJ Skills", "Electronic Music Production", "Classical Music", "Jazz", "Rock", "Hip Hop", "Musical Theater",
    
    // Other
    "Cooking", "Baking", "Pastry", "Cake Decorating", "Wine Tasting", "Cocktail Making", "Barista Skills",
    "Fitness Training", "Yoga", "Pilates", "Meditation", "Weight Training", "Crossfit", "Calisthenics",
    "Hiking", "Camping", "Backpacking", "Rock Climbing", "Mountaineering", "Survival Skills",
    "Gardening", "Plant Care", "Landscape Design", "Beekeeping", "Foraging"
]; 