'use client'
import { useAuth } from '@/lib/useAuth'
import type { Page } from '@/app/page'

interface NavbarProps { page: Page; navigate: (p: Page) => void }

export default function Navbar({ page, navigate }: NavbarProps) {
  const { user, logout } = useAuth()
  const handleLogout = async () => { await logout(); navigate('landing') }
  const isAuthPage = page === 'login' || page === 'register'

  return (
    /*
     * NAVBAR
     * No separate bg image — uses CSS glass with rgba + backdrop-filter.
     * The body's bg-body-space.jpg bleeds through the blur naturally,
     * giving the navbar a frosted-space-texture look for free.
     */
    <nav style={{
      /* Glass layer — body bg-body-space.jpg visible through blur */
      background: 'rgba(6,8,18,0.82)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderBottom: '1px solid rgba(77,255,195,0.1)',
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5vw', height: 68,
    }}>
      {/* Top edge glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(77,255,195,0.25), rgba(59,130,246,0.15), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div onClick={() => navigate('landing')} style={{
        fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 20,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        letterSpacing: '-0.3px',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg,#4DFFC3,#3B82F6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900, color: '#060812',
          boxShadow: '0 0 16px rgba(77,255,195,0.4)',
        }}>CV</div>
        <span style={{ color: '#F0F4FF' }}>CVision</span>
        <span style={{ color: '#4DFFC3' }}>AI</span>
      </div>

      {/* Nav links */}
      {!isAuthPage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'Home',      p: 'landing'   as Page },
            { label: 'Features',  p: 'landing'   as Page },
            { label: 'Dashboard', p: 'dashboard' as Page },
          ].map(({ label, p }) => (
            <button key={label} onClick={() => navigate(p)} style={{
              padding: '7px 16px', borderRadius: 9999, fontSize: 14, fontWeight: 500,
              color: page === p && label !== 'Features' ? '#4DFFC3' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all .2s',
              border: 'none', background: 'none', fontFamily: 'Outfit,sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F0F4FF'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = page === p && label !== 'Features' ? '#4DFFC3' : 'var(--text-secondary)'; e.currentTarget.style.background = 'none' }}
            >{label}</button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user ? (
          <>
            <button onClick={() => navigate('upload')} className="btn-electric" style={{ padding: '9px 22px', borderRadius: 9999, fontSize: 14 }}>
              Upload Resume
            </button>
            <button onClick={handleLogout} style={{
              padding: '8px 16px', borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)'; e.currentTarget.style.color = '#FB7185' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >Log out</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('login')} style={{
              padding: '8px 16px', borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#F0F4FF' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >Log in</button>
            <button onClick={() => navigate('register')} className="btn-solid" style={{ padding: '9px 22px', borderRadius: 9999, fontSize: 14 }}>
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
