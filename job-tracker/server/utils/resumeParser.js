import fs from "fs";
import pdf from "pdf-parse";

// List of standard skills to scan for in the resume
const SKILL_KEYWORDS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Golang", "Rust", "PHP",
  "HTML", "CSS", "React", "Angular", "Vue", "Next.js", "Svelte", "Node.js", "Express", "Django",
  "Flask", "Spring Boot", "Laravel", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "CI/CD", "Linux",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Structures", "Algorithms",
  "DSA", "System Design", "OOP", "SQL", "NoSQL", "GraphQL", "Tailwind", "Bootstrap", "jQuery"
];

// Degree mappings for extraction
const DEGREE_PATTERNS = [
  { pattern: /B\.?Tech|Bachelor of Technology/i, value: "B.Tech" },
  { pattern: /M\.?Tech|Master of Technology/i, value: "M.Tech" },
  { pattern: /B\.?E\.?|Bachelor of Engineering/i, value: "B.E." },
  { pattern: /M\.?E\.?|Master of Engineering/i, value: "M.E." },
  { pattern: /B\.?C\.?A\.?|Bachelor of Computer Applications/i, value: "B.C.A." },
  { pattern: /M\.?C\.?A\.?|Master of Computer Applications/i, value: "M.C.A." },
  { pattern: /B\.?S\.?|Bachelor of Science/i, value: "B.S." },
  { pattern: /M\.?S\.?|Master of Science/i, value: "M.S." },
  { pattern: /PhD|Ph\.?D\.?/i, value: "Ph.D." }
];

export async function parsePdfResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdf(dataBuffer);
    const text = parsedData.text;

    // 1. Extract Email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex) || [];
    const email = emails[0] || "";

    // 2. Extract Phone Number
    const phoneRegex = /(?:\+?\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}/g;
    const phones = text.match(phoneRegex) || [];
    const phone = phones[0] || "";

    // 3. Extract Skills
    const matchedSkills = [];
    const lowerText = text.toLowerCase();
    
    SKILL_KEYWORDS.forEach((skill) => {
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
      
      if (skill === "C++") {
        if (lowerText.includes("c++")) matchedSkills.push(skill);
      } else if (skill === "C#") {
        if (lowerText.includes("c#")) matchedSkills.push(skill);
      } else if (skill === "Node.js") {
        if (lowerText.includes("node.js") || lowerText.includes("nodejs")) matchedSkills.push(skill);
      } else if (skill === "Next.js") {
        if (lowerText.includes("next.js") || lowerText.includes("nextjs")) matchedSkills.push(skill);
      } else if (regex.test(lowerText)) {
        matchedSkills.push(skill);
      }
    });

    // 4. Smart Name Extraction
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    let name = "";
    
    // Ignore lines containing standard resumes words/labels
    const filterRegex = /resume|curriculum|vitae|page|contact|email|phone|website|portfolio|education|skills|experience/i;

    for (let line of lines) {
      if (
        !filterRegex.test(line) && 
        !line.includes("@") && 
        !line.includes("http") && 
        !/[0-9]/.test(line) && 
        line.length > 2 && 
        line.length < 40
      ) {
        name = line;
        break;
      }
    }

    // 5. Extract Degree
    let degree = "";
    for (const item of DEGREE_PATTERNS) {
      if (item.pattern.test(text)) {
        degree = item.value;
        break;
      }
    }

    // 6. Extract CGPA / GPA
    let cgpa = "";
    const gpaRegex = /(?:cgpa|gpa|pointer|percentage|marks|grade)\s*(?::|•|-|=)?\s*([0-9]+(?:\.[0-9]+)?)(?:\s*\/\s*10|\s*%)?/i;
    const gpaMatch = text.match(gpaRegex);
    if (gpaMatch && gpaMatch[1]) {
      cgpa = gpaMatch[1];
    } else {
      // General match for numbers like 9.2/10 or 3.8/4.0
      const altGpaRegex = /\b([0-9]\.[0-9]{1,2})\s*\/\s*(?:10|4)\b/i;
      const altMatch = text.match(altGpaRegex);
      if (altMatch && altMatch[1]) {
        cgpa = altMatch[1];
      }
    }

    // 7. Extract Graduation Year
    let graduationYear = "";
    const yearRegex = /\b(202[0-9]|201[8-9])\b/g;
    const years = text.match(yearRegex) || [];
    if (years.length > 0) {
      // Pick the highest year found (usually graduation is in the future or most recent)
      const sortedYears = [...new Set(years)].sort((a, b) => b - a);
      graduationYear = sortedYears[0];
    }

    // 8. Extract University
    let university = "";
    const uniRegex = /(?:university|institute|college|school|academy|polytechnic|iit|nit|iiit)\s+[^,\n.]+/i;
    const uniMatch = text.match(uniRegex);
    if (uniMatch) {
      university = uniMatch[0].trim();
      // Clean up punctuation if it matches trailing characters
      university = university.replace(/[:\-\—\–]$/, "").trim();
    }

    // 9. Generate Bio summary
    let bio = "";
    if (matchedSkills.length > 0) {
      bio = `Aspiring developer skilled in ${matchedSkills.slice(0, 5).join(", ")}.`;
      if (degree && university) {
        bio += ` Pursuing ${degree} from ${university}.`;
      }
    } else {
      bio = "Software developer focusing on engineering principles and systems.";
    }

    return {
      success: true,
      name,
      email,
      phone,
      skills: matchedSkills,
      degree,
      cgpa,
      graduationYear,
      university,
      bio,
      textLength: text.length
    };
  } catch (err) {
    console.error("Resume Parsing Error:", err);
    return {
      success: false,
      error: err.message
    };
  }
}
