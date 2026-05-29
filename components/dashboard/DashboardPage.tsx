'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import type { Page, AnalysisData } from '@/app/page'

interface Props { navigate: (p: Page) => void; onAnalysisSelect: (data: AnalysisData) => void }
type DashView = 'main' | 'history' | 'jobmatch' | 'settings'

/* ── Sidebar ─────────────────────────────────────────────────────── */
function Sidebar({ view, setView, navigate, user, onLogout }: {
  view: DashView; setView: (v: DashView) => void
  navigate: (p: Page) => void; user: { name: string; email: string } | null; onLogout: () => void
}) {
  const items: { icon: string; label: string; v: DashView; color: string }[] = [
    { icon: '📊', label: 'Dashboard', v: 'main',     color: '#4DFFC3' },
    { icon: '📋', label: 'History',   v: 'history',  color: '#3B82F6' },
    { icon: '🎯', label: 'Job Match', v: 'jobmatch', color: '#A855F7' },
    { icon: '⚙️', label: 'Settings',  v: 'settings', color: '#FCD34D' },
  ]
  return (
    /*
     * SIDEBAR
     * bg-dashboard-cyber.jpg — applied via .bg-sidebar CSS class
     * Dark cybernetic HUD mesh, very heavy overlay so sidebar stays near-black.
     * The texture adds subtle depth visible along edges.
     */
    <aside
      className="bg-sidebar"
      style={{
        width: 248, borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#4DFFC3,#3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#060812',
            boxShadow: '0 0 12px rgba(77,255,195,0.3)',
          }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#F0F4FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {items.map(item => (
          <button key={item.v} onClick={() => setView(item.v)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 14px', borderRadius: 10, marginBottom: 3,
            border: view === item.v ? `1px solid ${item.color}25` : '1px solid transparent',
            fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', transition: 'all .15s',
            background: view === item.v ? `${item.color}10` : 'transparent',
            color: view === item.v ? item.color : 'var(--text-secondary)',
          }}
            onMouseEnter={e => { if (view !== item.v) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#F0F4FF' } }}
            onMouseLeave={e => { if (view !== item.v) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            {view === item.v && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />}
          </button>
        ))}
      </nav>

      <div style={{ padding: '12px 12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('upload')} className="btn-solid" style={{ width: '100%', padding: '11px', borderRadius: 10, fontSize: 14, fontFamily: 'Outfit,sans-serif' }}>+ Analyze Resume</button>
        <button onClick={onLogout} style={{
          width: '100%', padding: '10px', borderRadius: 10, marginTop: 8,
          border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)'; e.currentTarget.style.color = '#FB7185' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >Log out</button>
      </div>
    </aside>
  )
}

/* ── Score Circle ─────────────────────────────────────────────────── */
function ScoreCircle({ score, color, label }: { score: number; color: string; label: string }) {
  const deg = (score / 100) * 360
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 10px', background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.05) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${color}30` }}>
        <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'rgba(6,8,18,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 20, color }}>{score}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  )
}

/* ── Main View ─────────────────────────────────────────────────────── */
function MainView({ history, onAnalysisSelect, navigate }: { history: any[]; onAnalysisSelect: (d: AnalysisData) => void; navigate: (p: Page) => void }) {
  const latest = history[0]?.analysis
  return (
    <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#F0F4FF', marginBottom: 4, letterSpacing: '-0.5px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{history.length > 0 ? `${history.length} resume${history.length > 1 ? 's' : ''} analyzed` : 'Upload your first resume to get started'}</p>
        </div>
        {history.length > 0 && (
          <button onClick={() => navigate('upload')} className="btn-electric" style={{ padding: '10px 22px', borderRadius: 9999, fontSize: 14 }}>+ New Analysis</button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'rgba(6,8,18,0.6)', backdropFilter: 'blur(12px)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>📄</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 12, color: '#F0F4FF' }}>No Resumes Yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>Upload your first resume to get an ATS score, keyword analysis, and improvement suggestions.</p>
          <button onClick={() => navigate('upload')} className="btn-solid" style={{ padding: '13px 30px', borderRadius: 9999, fontSize: 15 }}>Upload Resume</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Overall', val: latest?.overallScore || 0, color: '#4DFFC3' },
              { label: 'ATS Score', val: latest?.atsScore || 0, color: '#3B82F6' },
              { label: 'Grammar', val: latest?.grammarScore || 0, color: '#FCD34D' },
              { label: 'Keywords', val: latest?.keywordScore || 0, color: '#A855F7' },
            ].map(m => (
              <div key={m.label} style={{
                background: `rgba(6,8,18,0.7)`, backdropFilter: 'blur(12px)',
                border: `1px solid ${m.color}20`, borderRadius: 20, padding: '24px 16px', textAlign: 'center',
                boxShadow: `0 0 30px ${m.color}08`,
              }}>
                <ScoreCircle score={m.val} color={m.color} label={m.label} />
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F4FF' }}>Recent Uploads</h3>
            </div>
            {history.slice(0, 5).map((item, idx) => (
              <div key={item.id} onClick={() => item.analysis && onAnalysisSelect({ ...item.analysis, fileName: item.fileName, resumeId: item.id, id: item.analysis.id })}
                style={{ display: 'flex', alignItems: 'center', padding: '14px 24px', borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', gap: 14, cursor: item.analysis ? 'pointer' : 'default', transition: 'background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,255,195,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(77,255,195,0.08)', border: '1px solid rgba(77,255,195,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#F0F4FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.fileName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                {item.analysis && (
                  <>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, color: '#4DFFC3' }}>{item.analysis.atsScore}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ATS Score</div>
                    </div>
                    <span className={item.analysis.atsScore >= 80 ? 'chip chip-success' : 'chip chip-warning'}>
                      {item.analysis.atsScore >= 80 ? '✓ Good' : '⚠ Work'}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {latest?.suggestions?.length > 0 && (
            <div style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F4FF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>💡 Latest Suggestions</h3>
              {latest.suggestions.slice(0, 4).map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(77,255,195,0.1)', color: '#4DFFC3', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ── History View ──────────────────────────────────────────────────── */
function HistoryView({ history, onAnalysisSelect }: { history: any[]; onAnalysisSelect: (d: AnalysisData) => void }) {
  return (
    <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#F0F4FF', marginBottom: 28, letterSpacing: '-0.5px' }}>Upload History</h1>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No resumes uploaded yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {history.map(item => (
            <div key={item.id} onClick={() => item.analysis && onAnalysisSelect({ ...item.analysis, fileName: item.fileName, resumeId: item.id, id: item.analysis.id })}
              style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, cursor: item.analysis ? 'pointer' : 'default', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(77,255,195,0.08)', border: '1px solid rgba(77,255,195,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#F0F4FF', marginBottom: 4 }}>{item.fileName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{new Date(item.createdAt).toLocaleString()} · {(item.fileSize / 1024).toFixed(0)} KB</div>
                  {item.analysis && (
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[
                        { label: 'ATS', val: item.analysis.atsScore, color: '#4DFFC3' },
                        { label: 'Grammar', val: item.analysis.grammarScore, color: '#FCD34D' },
                        { label: 'Keywords', val: item.analysis.keywordScore, color: '#3B82F6' },
                        { label: 'Overall', val: item.analysis.overallScore, color: '#A855F7' },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 20, color: m.color }}>{m.val}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {item.analysis && <span className={item.analysis.atsScore >= 80 ? 'chip chip-success' : 'chip chip-warning'}>{item.analysis.atsScore >= 80 ? '✓ Good' : '⚠ Needs Work'}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Job Match View ────────────────────────────────────────────────── */
function JobMatchView({ history }: { history: any[] }) {
  const [selectedResume, setSelectedResume] = useState(history[0]?.id || '')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState<{ matchScore: number; missingKeywords: string[]; matchedKeywords: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!selectedResume || !jobDesc.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/match-job', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeId: selectedResume, jobDescription: jobDesc }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const matchColor = result ? (result.matchScore >= 70 ? '#4DFFC3' : result.matchScore >= 50 ? '#FCD34D' : '#FB7185') : '#4DFFC3'

  return (
    <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#F0F4FF', marginBottom: 6, letterSpacing: '-0.5px' }}>Job Match Analyzer</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Paste a job description to see how well your resume matches.</p>

      <div style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Resume</label>
          <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} className="cv-input" style={{ appearance: 'none' }}>
            {history.length === 0 ? <option>No resumes uploaded</option> : history.map(h => <option key={h.id} value={h.id}>{h.fileName}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Description</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the full job description here..." rows={8} className="cv-input" style={{ resize: 'vertical' }} />
        </div>
        {error && <div style={{ color: '#FB7185', fontSize: 14, marginBottom: 16 }}>{error}</div>}
        <button onClick={run} disabled={loading || history.length === 0} className={loading || history.length === 0 ? '' : 'btn-solid'} style={{
          padding: '12px 28px', borderRadius: 9999, border: 'none', fontSize: 15, fontFamily: 'Outfit,sans-serif',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: loading || history.length === 0 ? 'rgba(255,255,255,0.08)' : undefined,
          color: loading || history.length === 0 ? 'var(--text-muted)' : undefined,
        }}>{loading ? 'Analyzing...' : 'Run Job Match →'}</button>
      </div>

      {result && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: 'rgba(6,8,18,0.75)', backdropFilter: 'blur(12px)', border: `1px solid ${matchColor}25`, borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: `0 0 40px ${matchColor}10` }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 72, color: matchColor, lineHeight: 1, letterSpacing: -2, textShadow: `0 0 40px ${matchColor}40` }}>{result.matchScore}%</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#F0F4FF', marginTop: 8 }}>Job Match Score</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{result.matchScore >= 70 ? '🎉 Great match! Apply confidently.' : result.matchScore >= 50 ? '⚠️ Decent match. Add missing keywords.' : '📝 Low match. Significant tailoring needed.'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { title: '✅ Matched Keywords', items: result.matchedKeywords, cls: 'chip-success' },
              { title: '❌ Missing Keywords', items: result.missingKeywords, cls: 'chip-danger' },
            ].map(col => (
              <div key={col.title} style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#F0F4FF' }}>{col.title} ({col.items.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {col.items.map(k => <span key={k} className={`chip ${col.cls}`}>{k}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Settings View ─────────────────────────────────────────────────── */
function SettingsView({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#F0F4FF', marginBottom: 28, letterSpacing: '-0.5px' }}>Settings</h1>
      <div style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F4FF' }}>Profile</div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label><input className="cv-input" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth: 360 }} /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label><input className="cv-input" value={user?.email || ''} disabled style={{ maxWidth: 360, opacity: 0.6 }} /></div>
          <button onClick={save} style={{ width: 'fit-content', padding: '10px 24px', borderRadius: 9999, border: 'none', background: saved ? '#4DFFC3' : 'linear-gradient(135deg,#4DFFC3,#3B82F6)', color: '#060812', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all .2s' }}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </div>
      </div>
      <div style={{ background: 'rgba(6,8,18,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F4FF' }}>Account</div>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#F0F4FF' }}>Current Plan</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>You are on the Free plan</div>
          </div>
          <span className="chip chip-success">Free</span>
        </div>
        <div style={{ padding: '18px 24px' }}>
          <button style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.06)', color: '#FB7185', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,113,133,0.06)' }}
          >Delete Account</button>
        </div>
      </div>
    </div>
  )
}

/* ── Dashboard Root ────────────────────────────────────────────────── */
export default function DashboardPage({ navigate, onAnalysisSelect }: Props) {
  const { user, logout } = useAuth()
  const [view, setView] = useState<DashView>('main')
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(d => { setHistory(d.history || []); setLoadingHistory(false) }).catch(() => setLoadingHistory(false))
  }, [])

  const handleLogout = async () => { await logout(); navigate('landing') }

  return (
    /*
     * DASHBOARD WRAPPER
     * bg-dashboard-cyber.jpg — applied via .bg-dashboard CSS class
     * Dark cybernetic HUD / data-grid mesh abstract.
     * The sidebar and content panels are glassmorphism cards on top.
     */
    <div
      className="bg-dashboard"
      style={{ minHeight: '100vh', paddingTop: 68, display: 'flex' }}
    >
      <Sidebar view={view} setView={setView} navigate={navigate} user={user} onLogout={handleLogout} />
      {loadingHistory ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: '#4DFFC3', borderRightColor: '#3B82F6', borderRadius: '50%', margin: '0 auto 16px' }} className="animate-spin" />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {view === 'main'     && <MainView history={history} onAnalysisSelect={onAnalysisSelect} navigate={navigate} />}
          {view === 'history'  && <HistoryView history={history} onAnalysisSelect={onAnalysisSelect} />}
          {view === 'jobmatch' && <JobMatchView history={history} />}
          {view === 'settings' && <SettingsView user={user} />}
        </>
      )}
    </div>
  )
}
