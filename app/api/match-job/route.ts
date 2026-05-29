// app/api/match-job/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { findResumeById, findLatestAnalysisByResume, updateAnalysisJobMatch } from '@/lib/db'
import { matchJobDescription } from '@/lib/ats-scorer'

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { resumeId, jobDescription } = await req.json()

    if (!jobDescription || jobDescription.trim().length < 20) {
      return NextResponse.json({ error: 'Job description is too short' }, { status: 400 })
    }

    const resume = findResumeById(resumeId, user.userId)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const matchResult = matchJobDescription(resume.extracted_text, jobDescription)

    const latestAnalysis = findLatestAnalysisByResume(resumeId)
    if (latestAnalysis) {
      updateAnalysisJobMatch(latestAnalysis.id, jobDescription, matchResult.matchScore, JSON.stringify(matchResult.missingKeywords))
    }

    return NextResponse.json({
      success: true,
      matchScore: matchResult.matchScore,
      missingKeywords: matchResult.missingKeywords,
      matchedKeywords: matchResult.matchedKeywords,
    })
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
