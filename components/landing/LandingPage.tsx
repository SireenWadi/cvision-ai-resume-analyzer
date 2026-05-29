'use client'
import type { Page } from '@/app/page'

interface Props { navigate: (p: Page) => void }

function ScoreRing({ score, color }: { score: number; color: string }) {
  const deg = (score / 100) * 360
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.06) 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 20px ${color}40`,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'rgba(6,8,18,0.9)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color, lineHeight: 1,
      }}>
        {score}<small style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-muted)' }}>/ 100</small>
      </div>
    </div>
  )
}

function MockupCard() {
  const bars = [
    { label: 'ATS Score', val: 88, color: '#4DFFC3', pct: 88 },
    { label: 'Keywords',  val: 92, color: '#3B82F6', pct: 92 },
    { label: 'Grammar',   val: 81, color: '#A855F7', pct: 81 },
  ]
  return (
    <div style={{
      background: 'rgba(6,8,18,0.85)',
      border: '1px solid rgba(77,255,195,0.2)',
      borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden',
      boxShadow: '0 0 60px rgba(77,255,195,0.08), 0 20px 60px rgba(0,0,0,0.7)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#4DFFC3,#3B82F6,#A855F7)' }} />
      {/* Animated grid bg inside card */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35,
        backgroundImage: 'linear-gradient(rgba(77,255,195,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(77,255,195,.05) 1px,transparent 1px)',
        backgroundSize: '30px 30px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#F0F4FF' }}>Resume Analysis</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Senior Software Engineer</div>
          </div>
          <ScoreRing score={88} color="#4DFFC3" />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {['ATS Ready', 'Senior Level', 'Tech Focus'].map((c, i) => (
            <span key={c} className={i === 0 ? 'chip chip-success' : i === 1 ? 'chip chip-warning' : 'chip chip-blue'}>{c}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'ATS SCORE', val: '88%', color: '#4DFFC3' },
            { label: 'KEYWORDS', val: '92%', color: '#3B82F6' },
            { label: 'GRAMMAR',  val: '81%', color: '#A855F7' },
            { label: 'SKILLS',   val: '76%', color: '#FB7185' },
          ].map(m => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
        {bars.map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 80 }}>{b.label}</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 3, boxShadow: `0 0 8px ${b.color}80` }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: b.color, width: 28, textAlign: 'right' }}>{b.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  { icon: '🎯', title: 'ATS Score Analysis',    desc: 'Our algorithm analyzes your resume against 50+ ATS systems used by top companies, scoring structure, keywords, and formatting.',     grad: 'linear-gradient(135deg,#4DFFC3,#3B82F6)' },
  { icon: '🔍', title: 'Keyword Intelligence',   desc: 'Identifies missing skills and keywords from your target job description, ensuring your resume speaks the right language.',            grad: 'linear-gradient(135deg,#A855F7,#FB7185)' },
  { icon: '✍️', title: 'Grammar & Clarity',     desc: 'Checks for passive voice, weak verbs, and suggests powerful action verbs that grab recruiter attention instantly.',                  grad: 'linear-gradient(135deg,#3B82F6,#A855F7)' },
  { icon: '📊', title: 'Job Match Score',        desc: 'Paste any job description and instantly see how well your resume matches. Understand exactly what to add or improve.',             grad: 'linear-gradient(135deg,#FCD34D,#FB7185)' },
  { icon: '💡', title: 'Smart Suggestions',      desc: 'Get personalized, actionable improvement tips based on your specific resume content and career level.',                            grad: 'linear-gradient(135deg,#4DFFC3,#A855F7)' },
  { icon: '📈', title: 'Score History',          desc: 'Track your resume improvement over time. See how your scores evolve as you implement suggestions.',                                grad: 'linear-gradient(135deg,#3B82F6,#4DFFC3)' },
]

const testimonials = [
  { stars: '★★★★★', text: 'CVision AI helped me land interviews at 3 FAANG companies. My ATS score went from 42 to 91 in one hour!', name: 'Alex K.',  role: 'Software Engineer at Google', color: '#4DFFC3' },
  { stars: '★★★★★', text: "I've been job hunting for months with no luck. After using CVision, I got 5 callbacks in the first week.",   name: 'Sarah M.', role: 'Product Manager at Meta',    color: '#A855F7' },
  { stars: '★★★★★', text: 'The keyword matching feature is gold. I customized my resume for each role and doubled my callback rate.',   name: 'David C.', role: 'Data Scientist at Amazon',   color: '#3B82F6' },
]

export default function LandingPage({ navigate }: Props) {
  return (
    <div id="page-landing" style={{ paddingTop: 68 }}>

      {/* ══════════════════════════════════════════════
          HERO SECTION
          bg-hero-grid.jpg — applied via .bg-hero CSS class
          High-tech abstract circuit/network grid image,
          blended under a dark gradient overlay.
          ══════════════════════════════════════════════ */}
      <section
        className="bg-hero"
        style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center', gap: 60,
          padding: '80px 8vw 60px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Animated dot-grid overlay (CSS-only, no image) */}
        <div className="grid-bg-animated" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6, pointerEvents: 'none' }} />

        {/* Ambient gradient orbs — float on top of the bg image */}
        <div className="animate-float" style={{ position: 'absolute', width: 600, height: 600, right: -150, top: -150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(77,255,195,0.09) 0%,transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
        <div className="animate-float-delayed" style={{ position: 'absolute', width: 500, height: 500, left: -100, bottom: -100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
        <div className="animate-float-slow" style={{ position: 'absolute', width: 300, height: 300, left: '40%', top: '20%', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2 }} className="animate-fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 9999,
            background: 'rgba(77,255,195,0.08)', border: '1px solid rgba(77,255,195,0.2)',
            fontSize: 13, fontWeight: 600, color: '#4DFFC3',
            marginBottom: 28, fontFamily: 'Outfit,sans-serif',
          }}>
            <span style={{ width: 6, height: 6, background: '#4DFFC3', borderRadius: '50%', boxShadow: '0 0 6px #4DFFC3' }} />
            AI-Powered Resume Intelligence
          </div>

          <h1 style={{
            fontSize: 'clamp(38px,5vw,66px)', fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-2px', marginBottom: 20, color: '#F0F4FF',
            fontFamily: 'Outfit,sans-serif',
          }}>
            Beat the ATS.<br />
            <span className="gradient-text-electric">Get the Interview.</span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
            Upload your resume and get an instant AI analysis — ATS score, keyword gaps, grammar check, and personalized tips to land more interviews.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('register')} className="btn-solid" style={{ padding: '14px 30px', borderRadius: 9999, fontSize: 16 }}>
              Analyze My Resume →
            </button>
            <button onClick={() => navigate('login')} className="btn-electric" style={{ padding: '13px 28px', borderRadius: 9999, fontSize: 16 }}>
              See Demo
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
            <div style={{ display: 'flex' }}>
              {['A','B','C','D'].map((l, i) => (
                <div key={l} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '2px solid rgba(6,8,18,0.9)', marginLeft: i === 0 ? 0 : -8,
                  background: `linear-gradient(135deg,${['#4DFFC3','#3B82F6','#A855F7','#FB7185'][i]},${['#3B82F6','#A855F7','#FB7185','#4DFFC3'][i]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#060812', fontSize: 11, fontWeight: 700,
                }}>{l}</div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#F0F4FF' }}>25,000+</strong> resumes analyzed
            </p>
          </div>
        </div>

        {/* Hero Mockup Card */}
        <div style={{ position: 'relative', zIndex: 2 }} className="animate-fade-up delay-2">
          <div style={{
            position: 'absolute', top: -24, right: -20, zIndex: 10,
            background: 'rgba(6,8,18,0.9)', border: '1px solid rgba(77,255,195,0.25)',
            borderRadius: 16, boxShadow: '0 0 20px rgba(77,255,195,0.1)', padding: '12px 16px', fontSize: 13,
            backdropFilter: 'blur(12px)',
          }} className="animate-float">
            <span style={{ color: '#4DFFC3' }}>✅</span> ATS Score: <strong style={{ color: '#4DFFC3' }}>91/100</strong>
          </div>
          <div style={{
            position: 'absolute', bottom: 30, left: -30, zIndex: 10,
            background: 'rgba(6,8,18,0.9)', border: '1px solid rgba(168,85,247,0.25)',
            borderRadius: 16, boxShadow: '0 0 20px rgba(168,85,247,0.1)', padding: '12px 16px', fontSize: 13,
            backdropFilter: 'blur(12px)',
          }} className="animate-float-delayed">
            <span>🎯</span> 12 keywords added
          </div>
          <MockupCard />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS SECTION
          bg-features-mesh.jpg — applied via .bg-features class
          Dark geometric gradient mesh, barely visible under overlay.
          ══════════════════════════════════════════════ */}
      <section
        className="bg-features"
        style={{
          borderTop: '1px solid rgba(77,255,195,0.08)',
          borderBottom: '1px solid rgba(77,255,195,0.08)',
          padding: '80px 8vw',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Subtle electric tint overlay on top of bg image */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'linear-gradient(135deg,rgba(77,255,195,0.04) 0%,rgba(59,130,246,0.04) 50%,rgba(168,85,247,0.04) 100%)',
        }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {[
            { val: '25K+', label: 'Resumes Analyzed', color: '#4DFFC3' },
            { val: '94%',  label: 'Interview Success Rate', color: '#3B82F6' },
            { val: '150+', label: 'ATS Systems Covered', color: '#A855F7' },
          ].map(s => (
            <div key={s.val}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(36px,5vw,60px)', color: s.color, letterSpacing: -2, lineHeight: 1, textShadow: `0 0 30px ${s.color}50` }}>{s.val}</div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES SECTION
          bg-features-mesh.jpg — reused via .bg-features class
          Same mesh texture, slightly deeper surface color.
          ══════════════════════════════════════════════ */}
      <section
        id="features"
        className="bg-features"
        style={{ padding: '100px 8vw', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,17,32,0.3)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#4DFFC3', fontFamily: 'Outfit,sans-serif', display: 'block', marginBottom: 14 }}>Features</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16, fontFamily: 'Outfit,sans-serif' }}>
              Everything you need to <span className="gradient-text-electric">land the job</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7 }}>Comprehensive resume analysis powered by smart algorithms.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {features.map((f, idx) => (
              <div key={f.title} style={{
                /* Each card has its own glass layer on top of section bg */
                background: 'rgba(6,8,18,0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24, padding: '32px 28px', transition: 'all 0.3s', cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = 'rgba(77,255,195,0.2)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(77,255,195,0.06)'
                  e.currentTarget.style.background = 'rgba(6,8,18,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.background = 'rgba(6,8,18,0.6)'
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: f.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 20, boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10, color: '#F0F4FF' }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS SECTION
          bg-testimonials-dark.jpg — applied via .bg-testimonials class
          Dark bokeh/blur abstract ambient image.
          ══════════════════════════════════════════════ */}
      <section
        className="bg-testimonials"
        style={{ padding: '100px 8vw', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#4DFFC3', display: 'block', marginBottom: 14 }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', fontFamily: 'Outfit,sans-serif' }}>
              Loved by job seekers <span className="gradient-text-electric">worldwide</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                background: 'rgba(6,8,18,0.75)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${t.color}25`,
                borderRadius: 24, padding: 28,
                boxShadow: `0 0 40px ${t.color}08`,
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}50`; e.currentTarget.style.boxShadow = `0 0 40px ${t.color}18`; e.currentTarget.style.background = 'rgba(6,8,18,0.88)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}25`; e.currentTarget.style.boxShadow = `0 0 40px ${t.color}08`; e.currentTarget.style.background = 'rgba(6,8,18,0.75)' }}
              >
                <div style={{ color: t.color, fontSize: 16, letterSpacing: 2, marginBottom: 16, textShadow: `0 0 10px ${t.color}60` }}>{t.stars}</div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `linear-gradient(135deg,${t.color},${t.color}80)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#060812', fontWeight: 700, fontSize: 13, boxShadow: `0 0 15px ${t.color}40`,
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#F0F4FF' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRICING SECTION
          bg-cta-pulse.jpg — applied via .bg-cta class
          Dark neon pulse/energy burst abstract.
          ══════════════════════════════════════════════ */}
      <section
        id="pricing"
        className="bg-cta"
        style={{ padding: '100px 8vw', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#4DFFC3', display: 'block', marginBottom: 14 }}>Pricing</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', fontFamily: 'Outfit,sans-serif' }}>Simple, transparent pricing</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
            {[
              { name: 'Free', price: '$0', period: '/month', features: ['3 resume analyses/month','ATS score & grammar check','Basic keyword analysis','PDF & DOCX support'], cta: 'Start Free', primary: false },
              { name: 'Pro', price: '$12', period: '/month', features: ['Unlimited analyses','Job description matching','Advanced keyword analysis','Priority support','Resume version history','PDF report download'], cta: 'Get Pro', primary: true, badge: 'Most Popular' },
              { name: 'Team', price: '$29', period: '/month', features: ['5 team members','All Pro features','Team analytics dashboard','Custom integrations','Dedicated support','API access'], cta: 'Contact Sales', primary: false },
            ].map(p => (
              <div key={p.name} style={{
                background: p.primary ? 'rgba(77,255,195,0.06)' : 'rgba(6,8,18,0.7)',
                backdropFilter: 'blur(16px)',
                border: p.primary ? '1px solid rgba(77,255,195,0.35)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24, padding: '36px 32px', position: 'relative',
                boxShadow: p.primary ? '0 0 60px rgba(77,255,195,0.1), 0 20px 60px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.4)',
              }}>
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#4DFFC3,#3B82F6)',
                    color: '#060812', padding: '6px 18px', borderRadius: 9999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                  }}>{p.badge}</div>
                )}
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 20, color: p.primary ? '#4DFFC3' : '#F0F4FF', marginBottom: 8 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 48, color: '#F0F4FF', letterSpacing: -2 }}>{p.price}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <span style={{ color: '#4DFFC3', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('register')} style={{
                  width: '100%', padding: '13px', borderRadius: 9999, fontWeight: 700, fontSize: 15,
                  fontFamily: 'Outfit,sans-serif', cursor: 'pointer', transition: 'all 0.25s',
                  background: p.primary ? 'linear-gradient(135deg,#4DFFC3,#3B82F6)' : 'rgba(77,255,195,0.08)',
                  color: p.primary ? '#060812' : '#4DFFC3',
                  border: p.primary ? 'none' : '1px solid rgba(77,255,195,0.3)',
                }}
                  onMouseEnter={e => { if (p.primary) e.currentTarget.style.boxShadow = '0 0 30px rgba(77,255,195,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}
                >{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA SECTION
          bg-cta-pulse.jpg — reused via .bg-cta class
          Radial overlay intensifies the neon pulse effect.
          ══════════════════════════════════════════════ */}
      <section
        className="bg-cta"
        style={{ padding: '100px 8vw', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        {/* Extra radial glow on top of bg image */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(77,255,195,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 20, fontFamily: 'Outfit,sans-serif' }}>
            Ready to land your<br /><span className="gradient-text-electric">dream job?</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Join thousands of job seekers who improved their resume and landed more interviews.
          </p>
          <button onClick={() => navigate('register')} className="btn-solid" style={{ padding: '18px 40px', borderRadius: 9999, fontSize: 18 }}>
            Analyze My Resume Free →
          </button>
        </div>
      </section>

      {/* FOOTER — uses body bg, no extra image needed */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 8vw 40px', color: 'var(--text-muted)', background: 'rgba(6,8,18,0.95)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#4DFFC3,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#060812' }}>CV</div>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color: '#F0F4FF' }}>CVision <span style={{ color: '#4DFFC3' }}>AI</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>AI-powered resume analysis to help you beat ATS systems and land more interviews.</p>
          </div>
          {[
            { title: 'Product', links: ['Features','Pricing','Dashboard','API'] },
            { title: 'Company', links: ['About','Blog','Careers','Contact'] },
            { title: 'Legal',   links: ['Privacy','Terms','Cookies'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#F0F4FF', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <span key={l} style={{ fontSize: 14, cursor: 'pointer', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#4DFFC3')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}
                  >{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, textAlign: 'center', fontSize: 13 }}>
          © 2024 CVision AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
