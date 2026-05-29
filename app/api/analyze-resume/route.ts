// app/api/analyze-resume/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { findResumeById, createAnalysis } from '@/lib/db'
import { analyzeResume } from '@/lib/ats-scorer'

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { resumeId } = await req.json()
    const resume = findResumeById(resumeId, user.userId)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const analysis = analyzeResume(resume.extracted_text)
    const result = createAnalysis({
      resumeId: resume.id,
      atsScore: analysis.atsScore,
      grammarScore: analysis.grammarScore,
      keywordScore: analysis.keywordScore,
      overallScore: analysis.overallScore,
      missingSkills: JSON.stringify(analysis.missingSkills),
      presentSkills: JSON.stringify(analysis.presentSkills),
      suggestions: JSON.stringify(analysis.suggestions),
      wordCount: analysis.wordCount,
      sectionCount: analysis.sectionCount,
    })

    return NextResponse.json({ success: true, analysis: { ...analysis, id: result.id } })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
