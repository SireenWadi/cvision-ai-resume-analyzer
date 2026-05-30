// lib/ats-scorer.ts

export interface AnalysisResult {
  atsScore: number
  grammarScore: number
  keywordScore: number
  overallScore: number
  missingSkills: string[]
  presentSkills: string[]
  suggestions: string[]
  wordCount: number
  sectionCount: number
  sections: {
    hasContact: boolean
    hasSummary: boolean
    hasExperience: boolean
    hasEducation: boolean
    hasSkills: boolean
    hasProjects: boolean
    hasCertifications: boolean
  }
}

// Comprehensive keyword dictionary
const TECH_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin',
  'react', 'vue', 'angular', 'next.js', 'nuxt', 'svelte', 'jquery',
  'node.js', 'express', 'django', 'flask', 'spring', 'fastapi', 'rails',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
  'git', 'github', 'gitlab', 'ci/cd', 'jenkins', 'github actions',
  'graphql', 'rest', 'api', 'microservices', 'websockets', 'grpc',
  'html', 'css', 'tailwindcss', 'sass', 'less', 'bootstrap',
  'react native', 'flutter', 'ionic',
  'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
  'linux', 'bash', 'shell', 'powershell',
  'webpack', 'vite', 'rollup', 'babel',
  'jest', 'cypress', 'selenium', 'pytest', 'junit',
]

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving',
  'agile', 'scrum', 'kanban', 'project management', 'mentoring',
  'analytical', 'critical thinking', 'time management', 'adaptability',
]

const RESUME_SECTIONS = {
  contact: [
    'email', 'phone', 'linkedin', 'github', 'address', 'location',
    'contact', '@', 'tel:', 'mobile',
  ],
  summary: [
    'summary', 'objective', 'profile', 'about', 'overview', 'professional summary',
    'career objective', 'professional profile',
  ],
  experience: [
    'experience', 'work history', 'employment', 'career', 'professional experience',
    'work experience', 'positions', 'roles',
  ],
  education: [
    'education', 'academic', 'degree', 'university', 'college', 'bachelor',
    'master', 'phd', 'diploma', 'certification', 'schooling',
  ],
  skills: [
    'skills', 'technical skills', 'competencies', 'technologies', 'tools',
    'proficiencies', 'expertise', 'capabilities', 'stack',
  ],
  projects: [
    'projects', 'portfolio', 'works', 'contributions', 'open source',
  ],
  certifications: [
    'certifications', 'certificates', 'awards', 'achievements', 'licenses',
  ],
}

const GRAMMAR_PATTERNS = {
  // Common ATS-unfriendly patterns
  passiveVoice: /\b(was|were|is|are|been)\s+(being\s+)?\w+ed\b/gi,
  weakVerbs: /\b(helped|assisted|worked on|was responsible for|did|made)\b/gi,
  pronouns: /\b(I|me|my|myself|we|our|us)\b/gi,
  // Good patterns
  actionVerbs: /\b(led|built|developed|created|designed|implemented|managed|optimized|improved|achieved|launched|delivered|increased|reduced|generated)\b/gi,
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s\.\+#]/g, ' ')
}

function detectSections(text: string): AnalysisResult['sections'] {
  const lower = text.toLowerCase()
  return {
    hasContact: RESUME_SECTIONS.contact.some(k => lower.includes(k)),
    hasSummary: RESUME_SECTIONS.summary.some(k => lower.includes(k)),
    hasExperience: RESUME_SECTIONS.experience.some(k => lower.includes(k)),
    hasEducation: RESUME_SECTIONS.education.some(k => lower.includes(k)),
    hasSkills: RESUME_SECTIONS.skills.some(k => lower.includes(k)),
    hasProjects: RESUME_SECTIONS.projects.some(k => lower.includes(k)),
    hasCertifications: RESUME_SECTIONS.certifications.some(k => lower.includes(k)),
  }
}

function detectSkills(text: string): { present: string[]; missing: string[] } {
  const normalized = normalizeText(text)
  const present: string[] = []
  const missing: string[] = []

  for (const skill of TECH_SKILLS) {
    if (normalized.includes(skill.toLowerCase())) {
      present.push(skill)
    } else {
      missing.push(skill)
    }
  }

  return { present, missing }
}

function calculateATSScore(text: string, sections: AnalysisResult['sections'], wordCount: number): number {
  let score = 0

  // Section scoring (40 pts)
  if (sections.hasContact) score += 10
  if (sections.hasSummary) score += 8
  if (sections.hasExperience) score += 10
  if (sections.hasEducation) score += 7
  if (sections.hasSkills) score += 5

  // Length scoring (20 pts)
  if (wordCount >= 200 && wordCount <= 800) score += 20
  else if (wordCount >= 150 && wordCount < 200) score += 14
  else if (wordCount > 800 && wordCount <= 1200) score += 16
  else if (wordCount > 1200) score += 10
  else score += 5

  // Formatting signals (20 pts)
  const hasBullets = text.includes('•') || text.includes('-') || text.includes('*')
  if (hasBullets) score += 8
  const hasNumbers = /\d+%|\d+\+|\$\d+|\d+ (years?|months?|users?|people)/i.test(text)
  if (hasNumbers) score += 12

  // Keyword density (20 pts)
  const { present } = detectSkills(text)
  const keywordDensity = Math.min(present.length / 10, 1)
  score += Math.round(keywordDensity * 20)

  return Math.min(Math.max(score, 20), 98)
}

function calculateGrammarScore(text: string): number {
  let score = 100

  // Penalize personal pronouns (ATS unfriendly)
  const pronounMatches = text.match(GRAMMAR_PATTERNS.pronouns) || []
  score -= Math.min(pronounMatches.length * 3, 20)

  // Penalize weak verbs
  const weakVerbMatches = text.match(GRAMMAR_PATTERNS.weakVerbs) || []
  score -= Math.min(weakVerbMatches.length * 2, 15)

  // Reward strong action verbs
  const actionVerbMatches = text.match(GRAMMAR_PATTERNS.actionVerbs) || []
  const actionBonus = Math.min(actionVerbMatches.length * 2, 15)
  score += actionBonus

  // Check for quantified achievements
  const quantifiedAchievements = (text.match(/\d+%|\d+\+|\$\d+[kKmMbB]?|\d+ (times?|x)/g) || []).length
  score += Math.min(quantifiedAchievements * 3, 15)

  return Math.min(Math.max(score, 40), 99)
}

function calculateKeywordScore(presentCount: number, totalKeywords: number): number {
  const ratio = presentCount / totalKeywords
  if (ratio >= 0.4) return Math.round(90 + ratio * 10)
  if (ratio >= 0.3) return Math.round(75 + ratio * 50)
  if (ratio >= 0.2) return Math.round(60 + ratio * 75)
  return Math.round(ratio * 300)
}

function generateSuggestions(
  text: string,
  sections: AnalysisResult['sections'],
  atsScore: number,
  wordCount: number,
  missingTopSkills: string[]
): string[] {
  const suggestions: string[] = []

  if (!sections.hasSummary) {
    suggestions.push('Add a professional summary section at the top to give recruiters an immediate overview of your expertise.')
  }
  if (!sections.hasSkills) {
    suggestions.push('Include a dedicated Skills section with a structured list of your technical competencies for better ATS parsing.')
  }
  if (!sections.hasProjects) {
    suggestions.push('Add a Projects section to showcase hands-on experience with specific technologies.')
  }

  const pronounMatches = text.match(GRAMMAR_PATTERNS.pronouns) || []
  if (pronounMatches.length > 2) {
    suggestions.push('Remove first-person pronouns (I, me, my). Resume bullet points should start directly with action verbs.')
  }

  const actionVerbMatches = text.match(GRAMMAR_PATTERNS.actionVerbs) || []
  if (actionVerbMatches.length < 5) {
    suggestions.push('Use strong action verbs to start each bullet point: Led, Developed, Implemented, Optimized, Delivered, etc.')
  }

  const hasQuantifiedResults = /\d+%|\d+\+|\$\d+|reduced|increased|improved by/i.test(text)
  if (!hasQuantifiedResults) {
    suggestions.push('Quantify your achievements with specific metrics: "Improved API response time by 40%" or "Managed team of 8 engineers".')
  }

  if (wordCount < 200) {
    suggestions.push('Your resume is too brief. Aim for 400-600 words to provide enough detail for ATS and recruiters.')
  } else if (wordCount > 1000) {
    suggestions.push('Consider trimming to 1 page (400-800 words). Focus on the most impactful experiences from the last 10 years.')
  }

  if (missingTopSkills.length > 0) {
    const topMissing = missingTopSkills.slice(0, 4).join(', ')
    suggestions.push(`Consider adding relevant skills you have experience with: ${topMissing}.`)
  }

  if (!text.includes('linkedin') && !text.includes('github')) {
    suggestions.push('Add LinkedIn and GitHub profile links to your contact section for better professional visibility.')
  }

  if (atsScore < 70) {
    suggestions.push('Use a clean, single-column resume format with clear section headers for optimal ATS compatibility.')
  }

  suggestions.push('Tailor your resume keywords to match each specific job description for maximum ATS score.')

  return suggestions.slice(0, 8)
}

export function analyzeResume(text: string): AnalysisResult {
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const sections = detectSections(text)
  const { present: presentSkills, missing: missingSkills } = detectSkills(text)

  const atsScore = calculateATSScore(text, sections, wordCount)
  const grammarScore = calculateGrammarScore(text)
  const keywordScore = calculateKeywordScore(presentSkills.length, TECH_SKILLS.length)
  const overallScore = Math.round((atsScore * 0.4) + (grammarScore * 0.3) + (keywordScore * 0.3))

  const sectionCount = Object.values(sections).filter(Boolean).length

  // Prioritize common/important missing skills
  const priorityMissing = ['react', 'typescript', 'node.js', 'aws', 'docker', 'kubernetes', 'graphql', 'postgresql']
  const topMissingSkills = [
    ...priorityMissing.filter(s => missingSkills.includes(s)),
    ...missingSkills.filter(s => !priorityMissing.includes(s)),
  ].slice(0, 15)

  const suggestions = generateSuggestions(text, sections, atsScore, wordCount, topMissingSkills)

  return {
    atsScore,
    grammarScore,
    keywordScore,
    overallScore,
    missingSkills: topMissingSkills,
    presentSkills: presentSkills.slice(0, 20),
    suggestions,
    wordCount,
    sectionCount,
    sections,
  }
}

export function matchJobDescription(
  resumeText: string,
  jobDescription: string
): { matchScore: number; missingKeywords: string[]; matchedKeywords: string[] } {
  const resumeNorm = normalizeText(resumeText)
  const jobNorm = normalizeText(jobDescription)

  // Extract meaningful keywords from job description
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'able'])

  const jobWords = jobNorm
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w))
    .filter(w => /^[a-z]/.test(w))

  // Also check for tech skills mentioned in job
  const jobTechSkills = TECH_SKILLS.filter(skill => jobNorm.includes(skill.toLowerCase()))
  const seen = new Set<string>()
  const allJobKeywords: string[] = []
  for (const k of [...jobTechSkills, ...jobWords.slice(0, 40)]) {
    if (!seen.has(k)) { seen.add(k); allJobKeywords.push(k) }
  }

  const matched: string[] = []
  const missing: string[] = []

  for (const keyword of allJobKeywords) {
    if (resumeNorm.includes(keyword.toLowerCase())) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  }

  const matchScore = allJobKeywords.length > 0
    ? Math.round((matched.length / allJobKeywords.length) * 100)
    : 0

  return {
    matchScore: Math.min(matchScore, 99),
    missingKeywords: missing.slice(0, 20),
    matchedKeywords: matched.slice(0, 20),
  }
}
