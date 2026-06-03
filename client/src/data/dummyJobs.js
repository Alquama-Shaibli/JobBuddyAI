/**
 * dummyJobs.js — 15 realistic curated job recommendations.
 * Used by JobRecommendations page for instant load without API dependency.
 * matchPercentage badges:
 *   90+ → Highly Recommended (emerald)
 *   75–89 → Good Match (blue)
 *   <75 → Explore (slate)
 */
const dummyJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Flipkart",
        location: "Bangalore",
        salary: "₹8 LPA – ₹12 LPA",
        experience: "1–3 years",
        matchPercentage: 95,
        skillsRequired: ["React", "JavaScript", "TailwindCSS", "Git", "TypeScript"],
        description: "Build and maintain responsive web interfaces for India's leading e-commerce platform. Collaborate with designers and backend engineers to deliver pixel-perfect user experiences at scale."
    },
    {
        id: 2,
        title: "React Developer",
        company: "Swiggy",
        location: "Hyderabad",
        salary: "₹7 LPA – ₹11 LPA",
        experience: "1–2 years",
        matchPercentage: 92,
        skillsRequired: ["React", "JavaScript", "Git", "TailwindCSS", "REST APIs"],
        description: "Develop dynamic front-end features for the food delivery platform used by millions. Focus on performance optimization and component-driven architecture."
    },
    {
        id: 3,
        title: "MERN Stack Developer",
        company: "Razorpay",
        location: "Bangalore",
        salary: "₹10 LPA – ₹15 LPA",
        experience: "2–4 years",
        matchPercentage: 90,
        skillsRequired: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
        description: "Own full-stack feature development for payment infrastructure. Design APIs, build React dashboards, and optimize MongoDB queries at scale."
    },
    {
        id: 4,
        title: "Software Engineer",
        company: "Google India",
        location: "Gurgaon",
        salary: "₹12 LPA – ₹18 LPA",
        experience: "1–3 years",
        matchPercentage: 88,
        skillsRequired: ["JavaScript", "TypeScript", "React", "Docker", "Git"],
        description: "Join the Cloud team to build internal tools and developer-facing dashboards. Strong problem-solving skills and system design fundamentals required."
    },
    {
        id: 5,
        title: "Full Stack Developer",
        company: "Paytm",
        location: "Noida",
        salary: "₹9 LPA – ₹14 LPA",
        experience: "2–4 years",
        matchPercentage: 85,
        skillsRequired: ["React", "Node.js", "MongoDB", "Express", "AWS"],
        description: "Build end-to-end features for fintech products serving 350M+ users. Work across the stack from React frontends to Node.js microservices."
    },
    {
        id: 6,
        title: "UI Developer",
        company: "Freshworks",
        location: "Pune",
        salary: "₹6 LPA – ₹10 LPA",
        experience: "0–2 years",
        matchPercentage: 83,
        skillsRequired: ["React", "JavaScript", "TailwindCSS", "Figma", "Git"],
        description: "Craft beautiful and accessible user interfaces for SaaS products. Translate Figma designs into responsive, production-ready components."
    },
    {
        id: 7,
        title: "Product Engineer",
        company: "Zerodha",
        location: "Bangalore",
        salary: "₹10 LPA – ₹15 LPA",
        experience: "2–5 years",
        matchPercentage: 80,
        skillsRequired: ["React", "Node.js", "TypeScript", "Docker", "AWS"],
        description: "Take ownership of full product modules in India's largest stock trading platform. Build performant, real-time applications with modern JavaScript."
    },
    {
        id: 8,
        title: "Associate Software Developer",
        company: "Infosys",
        location: "Pune",
        salary: "₹4 LPA – ₹6 LPA",
        experience: "0–1 years",
        matchPercentage: 78,
        skillsRequired: ["JavaScript", "React", "Node.js", "Git", "HTML/CSS"],
        description: "Join the Digital Experience team to work on enterprise web applications. Training provided on advanced frameworks and cloud technologies."
    },
    {
        id: 9,
        title: "Web Application Developer",
        company: "TCS",
        location: "Mumbai",
        salary: "₹5 LPA – ₹8 LPA",
        experience: "1–3 years",
        matchPercentage: 76,
        skillsRequired: ["JavaScript", "React", "MongoDB", "Express", "Agile"],
        description: "Develop and maintain web applications for banking and financial clients. Participate in code reviews, sprint planning, and Agile ceremonies."
    },
    {
        id: 10,
        title: "JavaScript Developer",
        company: "PhonePe",
        location: "Bangalore",
        salary: "₹8 LPA – ₹13 LPA",
        experience: "1–3 years",
        matchPercentage: 74,
        skillsRequired: ["JavaScript", "TypeScript", "React", "Node.js", "Jest"],
        description: "Build high-performance JavaScript applications for India's leading digital payments ecosystem. Focus on code quality and test-driven development."
    },
    {
        id: 11,
        title: "React Native Developer",
        company: "Meesho",
        location: "Hyderabad",
        salary: "₹7 LPA – ₹12 LPA",
        experience: "1–3 years",
        matchPercentage: 72,
        skillsRequired: ["React", "JavaScript", "TypeScript", "Git", "Redux"],
        description: "Build cross-platform mobile experiences for a social commerce platform with 150M+ users. Optimize app performance and implement new features."
    },
    {
        id: 12,
        title: "Junior Software Engineer",
        company: "Wipro",
        location: "Noida",
        salary: "₹4 LPA – ₹6 LPA",
        experience: "0–1 years",
        matchPercentage: 70,
        skillsRequired: ["JavaScript", "React", "Git", "Node.js", "SQL"],
        description: "Start your career building web applications for global enterprise clients. Collaborate with senior engineers and participate in agile sprints."
    },
    {
        id: 13,
        title: "Backend Developer",
        company: "Ola",
        location: "Mumbai",
        salary: "₹8 LPA – ₹13 LPA",
        experience: "1–3 years",
        matchPercentage: 68,
        skillsRequired: ["Node.js", "Express", "MongoDB", "Docker", "AWS"],
        description: "Design and develop scalable backend services for ride-hailing and financial products. Build RESTful APIs and work with microservice architectures."
    },
    {
        id: 14,
        title: "Cloud Engineer",
        company: "Jio Platforms",
        location: "Remote",
        salary: "₹10 LPA – ₹15 LPA",
        experience: "2–4 years",
        matchPercentage: 65,
        skillsRequired: ["AWS", "Docker", "Node.js", "CI/CD", "TypeScript"],
        description: "Manage cloud infrastructure and CI/CD pipelines for one of India's largest digital ecosystems. Automate deployments and optimize cloud costs."
    },
    {
        id: 15,
        title: "AI/ML Integration Engineer",
        company: "CRED",
        location: "Gurgaon",
        salary: "₹12 LPA – ₹18 LPA",
        experience: "2–4 years",
        matchPercentage: 60,
        skillsRequired: ["JavaScript", "Node.js", "Python", "Docker", "AWS"],
        description: "Build ML-powered recommendation systems and personalization engines for premium fintech products. Integrate AI models into production-grade Node.js services."
    }
];

export default dummyJobs;
