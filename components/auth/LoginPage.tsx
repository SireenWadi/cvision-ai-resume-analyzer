'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import type { Page } from '@/app/page'

interface Props { navigate: (p: Page) => void }

export default function LoginPage({ navigate }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.error) setError(result.error)
    else navigate('dashboard')
  }

  return (
    /*
     * AUTH PAGE WRAPPER
     * bg-auth-glass.jpg — applied via .bg-auth CSS class
     * Dark holographic / fractured glass texture image.
     * The card itself uses glassmorphism (blur + dark bg) on top of it.
     */
    <div
      className="bg-auth"
      style={{
        minHeight: '100vh', paddingTop: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ambient orbs on top of bg image */}
      <div className="animate-float" style={{ position: 'fixed', width: 600, height: 600, right: -200, top: -200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(77,255,195,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="animate-float-delayed" style={{ position: 'fixed', width: 500, height: 500, left: -150, bottom: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* CSS dot-grid overlay */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, padding: '0 20px' }} className="animate-fade-up">
        {/*
         * AUTH CARD
         * Glassmorphism card — backdrop-filter blur reveals the
         * bg-auth-glass.jpg texture through the frosted surface.
         */}
        <div style={{
          background: 'rgba(6,8,18,0.78)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(77,255,195,0.18)',
          borderRadius: 28, padding: 44,
          boxShadow: '0 0 60px rgba(77,255,195,0.07), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          {/* Top accent line on card */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(77,255,195,0.5),transparent)', borderRadius: '0 0 1px 1px' }} />

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4DFFC3,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#060812', boxShadow: '0 0 20px rgba(77,255,195,0.4)' }}>CV</div>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, color: '#F0F4FF' }}>CVision <span style={{ color: '#4DFFC3' }}>AI</span></span>
            </div>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 26, color: '#F0F4FF', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Log in to your account to continue</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)', color: '#FB7185', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email address</label>
              <input type="email" className="cv-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Password</label>
              <input type="password" className="cv-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className={loading ? '' : 'btn-solid'} style={{
              width: '100%', padding: '14px', borderRadius: 9999, fontSize: 15, fontWeight: 700,
              fontFamily: 'Outfit,sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(255,255,255,0.08)' : undefined,
              color: loading ? 'var(--text-muted)' : undefined,
              border: loading ? '1px solid rgba(255,255,255,0.08)' : undefined,
            }}>
              {loading ? 'Logging in...' : 'Log In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('register')} style={{ color: '#4DFFC3', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
              Sign up free
            </button>
          </div>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(77,255,195,0.05)', border: '1px solid rgba(77,255,195,0.12)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            💡 Demo: use any email & password to create an account
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={() => navigate('landing')} style={{ fontSize: 14, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4DFFC3')}
            onMouseLeave={e => (e.currentTarget.style.color = '')}
          >← Back to home</button>
        </div>
      </div>
    </div>
  )
}
