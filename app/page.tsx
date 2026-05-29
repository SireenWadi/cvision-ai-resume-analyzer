'use client'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/lib/useAuth'
import { ThemeProvider } from '@/lib/useTheme'
import Navbar from '@/components/Navbar'
import LandingPage from '@/components/landing/LandingPage'
import LoginPage from '@/components/auth/LoginPage'
import RegisterPage from '@/components/auth/RegisterPage'
import DashboardPage from '@/components/dashboard/DashboardPage'
import UploadPage from '@/components/upload/UploadPage'
import ResultsPage from '@/components/results/ResultsPage'

export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'upload' | 'results'

export interface AnalysisData {
  id: string
  resumeId: string
  fileName: string
  atsScore: number
  grammarScore: number
  keywordScore: number
  overallScore: number
  missingSkills: string[]
  presentSkills: string[]
  suggestions: string[]
  wordCount: number
  sectionCount: number
  matchScore?: number
  missingKeywords?: string[]
  matchedKeywords?: string[]
  createdAt?: string
}

function App() {
  const [page, setPage] = useState<Page>('landing')
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const { user, loading } = useAuth()

  const navigate = (p: Page) => {
    if ((p === 'dashboard' || p === 'upload') && !user) { setPage('login'); return }
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnalysisComplete = (data: AnalysisData) => { setAnalysisData(data); setPage('results') }

  useEffect(() => {
    if (!loading && user && page === 'login') setPage('dashboard')
    if (!loading && user && page === 'register') setPage('dashboard')
  }, [user, loading])

  if (loading) {
    return (
      /*
       * LOADING STATE
       * bg-body-space.jpg — inherited from body CSS.
       * The full-page loader sits on top of the ambient space bg.
       */
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        /* Inherits body's bg-body-space.jpg via background-attachment: fixed */
      }}>
        {/* Spinner ring */}
        <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.05)',
            borderTopColor: '#4DFFC3',
            borderRightColor: '#3B82F6',
            position: 'absolute',
          }} className="animate-spin" />
          <div style={{
            position: 'absolute', inset: 10, borderRadius: '50%',
            background: 'rgba(77,255,195,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🤖</div>
        </div>
        <div style={{
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16,
          color: '#F0F4FF', marginBottom: 6,
        }}>CVision AI</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading your workspace...</div>
      </div>
    )
  }

  return (
    <>
      <Navbar page={page} navigate={navigate} />
      {page === 'landing'   && <LandingPage navigate={navigate} />}
      {page === 'login'     && <LoginPage navigate={navigate} />}
      {page === 'register'  && <RegisterPage navigate={navigate} />}
      {page === 'dashboard' && (
        <DashboardPage
          navigate={navigate}
          onAnalysisSelect={(data: AnalysisData) => { setAnalysisData(data); setPage('results') }}
        />
      )}
      {page === 'upload' && (
        <UploadPage navigate={navigate} onComplete={handleAnalysisComplete} />
      )}
      {page === 'results' && analysisData && (
        <ResultsPage data={analysisData} navigate={navigate} onNewUpload={() => navigate('upload')} />
      )}
    </>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  )
}
