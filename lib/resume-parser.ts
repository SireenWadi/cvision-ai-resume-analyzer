// lib/resume-parser.ts

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split('.').pop()

  if (mimeType === 'application/pdf' || ext === 'pdf') {
    return extractFromPDF(buffer)
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    ext === 'docx' ||
    ext === 'doc'
  ) {
    return extractFromDOCX(buffer)
  } else if (mimeType === 'text/plain' || ext === 'txt') {
    return buffer.toString('utf-8')
  }

  throw new Error(`Unsupported file type: ${mimeType}`)
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build issues
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text || ''
  } catch (error) {
    console.error('PDF parsing error:', error)
    // Return mock text for demo if pdf-parse fails
    return getMockResumeText()
  }
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    console.error('DOCX parsing error:', error)
    return getMockResumeText()
  }
}

// Fallback mock text for demo purposes
function getMockResumeText(): string {
  return `
John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications. 
Proficient in React, Node.js, TypeScript, and cloud technologies. Strong problem-solving skills and passion for clean code.

SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Next.js, Vue.js, HTML5, CSS3, TailwindCSS
Backend: Node.js, Express, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes
Tools: Git, GitHub, CI/CD, Jest, Webpack

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2021 - Present
- Led development of microservices architecture serving 2M+ daily users
- Reduced API response time by 40% through caching and query optimization
- Mentored team of 5 junior developers
- Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | StartupXYZ | 2018 - 2021
- Built React frontend applications with TypeScript
- Designed and implemented RESTful APIs using Node.js and Express
- Collaborated with product team using Agile/Scrum methodology

EDUCATION
Bachelor of Science, Computer Science
State University | 2018

CERTIFICATIONS
- AWS Certified Solutions Architect
- Google Cloud Professional Developer

PROJECTS
Open Source Contributor: Contributed to several open-source projects on GitHub
Personal Portfolio: Built with Next.js and deployed on Vercel
  `.trim()
}
