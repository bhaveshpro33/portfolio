// Edit this file to update the site. Leave links as "" to hide them.
export default {
  name: "Bhavesh Ulhas Kondaskar",
  role: "Flutter Developer · Java Backend Developer",
  location: "Ahmedabad, Gujarat, India",
  // Real URLs only. Empty string = control is hidden.
  links: { email: "bhaveshkondaskr33@gamil.com", github: "https://github.com/bhaveshpro33", linkedin: "https://www.linkedin.com/in/bhaveshpro33", phone: "6359522830" },
  education: { degree: "Computer Engineering", school: "SETI Ahmedabad", status: "7th semester", sem: 7, total: 8, cgpa: "7.68" }, // edit status when it changes
  lead: {
    flutter: "Flutter apps with clean UI, REST APIs, GetX and Firebase.",
    java: "Java backends with Spring Boot, secure auth and relational data."
  },
  featured: { flutter: "NewsFlow", java: "Spring Boot Backend" },
  projects: [
    { id: "NewsFlow", mode: "flutter", status: "Project", type: "Flutter news app",
      desc: "A news reader with categories and sources, reading history, multilingual support and article text-to-speech.",
      tags: ["Flutter", "Dart", "GetX", "REST APIs", "Firebase"], links: { github: "", demo: "" } },
    { id: "Book Bazzar", mode: "flutter", status: "Project", type: "Flutter book-shopping app",
      desc: "A book-shopping app with Firebase Authentication and Google Sign-In.",
      tags: ["Flutter", "Dart", "GetX", "Firebase Auth", "Google Sign-In"], links: { github: "", demo: "" } },
    { id: "SparkMint", mode: "flutter", status: "Project", type: "Flutter / Web3 NFT marketplace",
      desc: "NFT creator marketplace with minting, buying and selling, creator profiles, wallet connectivity and subscriptions.",
      tags: ["Flutter", "Solidity", "WalletConnect", "Express.js", "MongoDB"], links: { github: "", demo: "" } },
    { id: "GymOwl Trainer", mode: "flutter", status: "Project", type: "Flutter trainer app",
      desc: "Trainer app built with GetX, with Firebase notifications and notification-settings API integration.",
      tags: ["Flutter", "Dart", "GetX", "Firebase", "REST APIs"], links: { github: "", demo: "" } },
    { id: "Spring Boot Backend", mode: "java", status: "Project", type: "Order management backend",
      desc: "REST backend with authentication and security, database integration and configuration. Redis caching explored.",
      tags: ["Java", "Spring Boot", "Spring Security", "JWT", "PostgreSQL", "Docker"], links: { github: "", demo: "" } },
    { id: "Pixel Whisper", mode: "java", status: "Project", type: "Image encryption system",
      desc: "Encrypts images with the Twofish algorithm and adds AI-assisted sentence generation.",
      tags: ["Twofish", "Image encryption", "AI-assisted text"], links: { github: "", demo: "" } },
    { id: "ChatSpot", mode: "java", status: "Project", type: "Chat software",
      desc: "Chat software with a Java backend, storing data in PostgreSQL and MongoDB.",
      tags: ["Java", "PostgreSQL", "MongoDB"], links: { github: "", demo: "" } },
  ],
  experience: [
    { company: "Excelsior Technologies", role: "Flutter Developer Intern", place: "Ahmedabad, India", date: "Jan 2026 – Present", points: [
      "Develop and maintain Flutter apps in Dart that consume REST APIs.",
      "Build responsive, reusable UI components.",
      "Implement GetX state management and Firebase integration with multilingual support.",
      "Built an article text-to-speech feature with loading, pause, resume, completion and error states.",
      "Debug production issues and resolve Android build problems." ] },
    { company: "CreArt Pvt. Ltd.", role: "Android Development Intern", place: "Ahmedabad, Gujarat", date: "Jul 2025", points: [
      "Built an Android app using Java and XML with responsive layouts.",
      "Integrated Firebase Authentication and real-time data storage." ] },
    { company: "CodSoft", role: "Java Programming Intern (Virtual)", place: "Remote", date: "Jun 2024 – Aug 2024", points: [
      "Developed a Number Game, ATM Interface and Student Grade Calculator.",
      "Used object-oriented design and exception handling in Java." ] }
  ],
  skills: {
    flutter: ["Flutter", "Dart", "Android development", "Responsive UI", "Reusable components", "GetX", "REST API integration", "Firebase", "Firebase Authentication", "Google Sign-In", "Multilingual support", "Text-to-speech integration"],
    java: ["Java", "Spring Boot", "Spring Security", "JWT", "REST APIs", "PostgreSQL", "MongoDB", "Docker", "Redis (explored)", "Object-oriented programming", "Exception handling"],
    extra: ["Solidity", "WalletConnect", "Express.js", "Twofish image encryption", "AI-assisted sentence generation"]
  }
};
