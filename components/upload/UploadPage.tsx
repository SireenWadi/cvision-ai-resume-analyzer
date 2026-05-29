'use client'
import { useState, useCallback, useRef } from 'react'
import type { Page, AnalysisData } from '@/app/page'

interface Props { navigate: (p: Page) => void; onComplete: (data: AnalysisData) => void }

const STEPS = [
  'Parsing document structure...',
  'Extracting text content...',
  'Running ATS compatibility check...',
  'Analyzing keywords & skills...',
  'Calculating grammar score...',
  'Generating smart suggestions...',
  'Finalizing your report...',
]

export default function UploadPage({ navigate, onComplete }: Props) {
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file); setError(''); setAnalyzing(true); setProgress(0); setStepIndex(0)
    let step = 0
    const stepInterval = setInterval(() => {
      step = Math.min(step + 1, STEPS.length - 1)
      setStepIndex(step); setProgress(Math.min((step / (STEPS.length - 1)) * 90, 90))
    }, 600)
    try {
      const formData = new FormData(); formData.append('resume', file)
      const res = await fetch('/api/upload-resume', { method: 'POST', body: formData })
      const data = await res.json()
      clearInterval(stepInterval)
      if (!res.ok) { setError(data.error || 'Upload failed'); setAnalyzing(false); return }
      setProgress(100)
      setTimeout(() => { onComplete(data.analysis) }, 500)
    } catch (e: any) { clearInterval(stepInterval); setError(e.message || 'Upload failed'); setAnalyzing(false) }
  }, [onComplete])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]; if (file) processFile(file)
  }, [processFile])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) processFile(file)
  }

  return (
    /*
     * UPLOAD PAGE
     * bg-upload-circuit.jpg — applied via .bg-upload CSS class
     * Dark PCB / circuit board wireframe abstract image.
     * Creates a "scanning document" cyberpunk vibe.
     */
    <div
      className="bg-upload"
      style={{ minHeight: '100vh', paddingTop: 68, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Animated circuit grid overlay on top of bg image */}
      <div className="grid-bg-animated" style={{ position: 'fixed', inset: 0, opacity: 0.5, pointerEvents: 'none', zIndex: 0 }} />

      {/* Ambient orbs */}
      <div className="animate-float" style={{ position: 'fixed', width: 600, height: 600, right: -200, top: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(77,255,195,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="animate-float-delayed" style={{ position: 'fixed', width: 500, height: 500, left: -150, bottom: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 660, padding: '40px 20px' }}>
        {!analyzing ? (
          <div className="animate-fade-up">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 9999, background: 'rgba(77,255,195,0.08)', border: '1px solid rgba(77,255,195,0.2)', fontSize: 13, fontWeight: 600, color: '#4DFFC3', marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, background: '#4DFFC3', borderRadius: '50%', boxShadow: '0 0 6px #4DFFC3' }} />
                AI Resume Analysis
              </div>
              <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 42, color: '#F0F4FF', marginBottom: 14, letterSpacing: '-1.5px' }}>
                Upload Your <span className="gradient-text-electric">Resume</span>
              </h1>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
                Drop your resume and get an instant ATS score, keyword analysis, and personalized improvement tips.
              </p>
            </div>

            {/* Drop zone — glass layer over the circuit bg */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? 'rgba(77,255,195,0.7)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 24, padding: '64px 40px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.25s',
                /* Glass layer over bg-upload-circuit.jpg */
                background: dragging ? 'rgba(77,255,195,0.05)' : 'rgba(6,8,18,0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transform: dragging ? 'scale(1.02)' : 'scale(1)',
                boxShadow: dragging ? '0 0 60px rgba(77,255,195,0.15), inset 0 0 40px rgba(77,255,195,0.03)' : '0 4px 30px rgba(0,0,0,0.5)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: dragging ? 'linear-gradient(90deg,transparent,rgba(77,255,195,0.6),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', transition: 'all .3s' }} />
              <input ref={inputRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFile} style={{ display: 'none' }} />
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                background: dragging ? 'rgba(77,255,195,0.15)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${dragging ? 'rgba(77,255,195,0.5)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, transition: 'all .3s',
                boxShadow: dragging ? '0 0 30px rgba(77,255,195,0.25)' : '',
              }}>{dragging ? '📂' : '📄'}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 20, color: '#F0F4FF', marginBottom: 8 }}>
                {dragging ? 'Release to analyze!' : 'Drop your resume here'}
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>
                or <span style={{ color: '#4DFFC3', fontWeight: 600, cursor: 'pointer' }}>click to browse your files</span>
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['PDF', 'DOCX', 'DOC', 'TXT'].map(fmt => (
                  <span key={fmt} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>{fmt}</span>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)', borderRadius: 12, color: '#FB7185', fontSize: 14 }}>⚠️ {error}</div>
            )}

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { icon: '🔒', text: 'Your resume is private & secure', color: '#4DFFC3' },
                { icon: '⚡', text: 'Results in under 10 seconds', color: '#3B82F6' },
                { icon: '🎯', text: '50+ ATS systems covered', color: '#A855F7' },
              ].map(tip => (
                <div key={tip.text} style={{
                  textAlign: 'center', padding: '18px 14px',
                  background: 'rgba(6,8,18,0.6)', backdropFilter: 'blur(8px)',
                  borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${tip.color}35`; e.currentTarget.style.background = `rgba(6,8,18,0.8)` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(6,8,18,0.6)' }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{tip.icon}</div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip.text}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button onClick={() => navigate('dashboard')} style={{ fontSize: 14, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#4DFFC3')}
                onMouseLeave={e => (e.currentTarget.style.color = '')}
              >← Back to dashboard</button>
            </div>
          </div>
        ) : (
          /* Analyzing state — glass card over circuit bg */
          <div className="animate-fade-up" style={{
            textAlign: 'center', padding: '60px 40px',
            background: 'rgba(6,8,18,0.82)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: 28,
            border: '1px solid rgba(77,255,195,0.18)',
            boxShadow: '0 0 60px rgba(77,255,195,0.08), 0 30px 80px rgba(0,0,0,0.7)',
          }}>
            <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 28px' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#4DFFC3', borderRightColor: '#3B82F6', position: 'absolute' }} className="animate-spin" />
              <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: 'rgba(77,255,195,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🤖</div>
            </div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 26, color: '#F0F4FF', marginBottom: 6, letterSpacing: '-0.5px' }}>Analyzing Your Resume</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>{selectedFile?.name}</p>
            <p style={{ fontSize: 15, color: '#4DFFC3', fontWeight: 600, marginBottom: 32, minHeight: 22 }}>{STEPS[stepIndex]}</p>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: 'linear-gradient(90deg,#4DFFC3,#3B82F6)', transition: 'width 0.5s ease', boxShadow: '0 0 12px rgba(77,255,195,0.5)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>{Math.round(progress)}% complete</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i <= stepIndex ? 22 : 8, height: 8, borderRadius: 4, transition: 'all 0.3s', background: i < stepIndex ? '#4DFFC3' : i === stepIndex ? '#3B82F6' : 'rgba(255,255,255,0.08)', boxShadow: i === stepIndex ? '0 0 8px rgba(59,130,246,0.6)' : '' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
