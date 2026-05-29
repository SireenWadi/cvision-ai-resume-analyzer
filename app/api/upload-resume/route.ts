// app/api/upload-resume/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { createResume, createAnalysis } from '@/lib/db'
import { extractTextFromBuffer } from '@/lib/resume-parser'
import { analyzeResume } from '@/lib/ats-scorer'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ]
    const allowedExts = ['pdf', 'docx', 'doc', 'txt']
    const ext = file.name.toLowerCase().split('.').pop() || ''

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF, DOCX, or TXT.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let extractedText: string
    try {
      extractedText = await extractTextFromBuffer(buffer, file.type, file.name)
    } catch (err) {
      console.error('Text extraction error:', err)
      return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 422 })
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract enough text. Ensure the file is not image-based/scanned.' }, { status: 422 })
    }

    const resume = createResume({
      userId: user.userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || `application/${ext}`,
      extractedText,
    })

    const analysis = analyzeResume(extractedText)

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

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      analysisId: result.id,
      analysis: {
        id: result.id,
        resumeId: resume.id,
        fileName: file.name,
        atsScore: analysis.atsScore,
        grammarScore: analysis.grammarScore,
        keywordScore: analysis.keywordScore,
        overallScore: analysis.overallScore,
        missingSkills: analysis.missingSkills,
        presentSkills: analysis.presentSkills,
        suggestions: analysis.suggestions,
        wordCount: analysis.wordCount,
        sectionCount: analysis.sectionCount,
        createdAt: result.created_at,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 })
  }
}
