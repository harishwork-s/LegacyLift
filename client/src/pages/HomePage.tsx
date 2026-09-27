import { useNavigate } from 'react-router-dom'

const PIPELINE = [
  {
    step: '01',
    label: 'Code Analysis',
    path: '/analysis',
    desc: 'IBM Bob 2.0 scans the Java 8 monolith and surfaces 9 risk patterns across security, design, and performance.',
    badge: 'Java 8 · 130 LOC',
    accentColor: '#ea580c',
    accentBg: '#fff7ed',
    accentBorder: '#fed7aa',
  },
  {
    step: '02',
    label: 'Risks',
    path: '/dashboard',
    desc: 'Architecture & risk dashboard — overall risk score, coupling, 0% test coverage, technical debt.',
    badge: 'Risk: 87 / High',
    accentColor: '#cf222e',
    accentBg: '#fff5f5',
    accentBorder: '#fecaca',
  },
  {
    step: '03',
    label: 'Modernization Plan',
    path: '/modernization',
    desc: 'Step-by-step transformation plan: Java 17, Spring Boot 3, REST API, proper error handling.',
    badge: '6 steps · 60% done',
    accentColor: '#1f6feb',
    accentBg: '#eff6ff',
    accentBorder: '#bfdbfe',
  },
  {
    step: '04',
    label: 'Before / After',
    path: '/comparison',
    desc: 'Side-by-side diff — legacy monolith vs. modernized service. See every changed line.',
    badge: 'Legacy → Modern',
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    accentBorder: '#ddd6fe',
  },
  {
    step: '05',
    label: 'Validation',
    path: '/validation',
    desc: 'JUnit 5 test suite results — pass rate, coverage, and confidence score for the modernized service.',
    badge: '83% pass rate',
    accentColor: '#b45309',
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
  },
]

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 860, margin: '0 auto' },
  hero: { textAlign: 'center', padding: '56px 0 40px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
    fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 99,
    marginBottom: 20,
  },
  dot: { width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' },
  h1: { fontSize: 44, fontWeight: 800, color: '#1f2328', letterSpacing: '-0.03em', margin: '0 0 10px' },
  subtitle: { fontSize: 18, color: '#57606a', margin: '0 0 8px' },
  desc: { fontSize: 13, color: '#8b949e', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 },
  pipeline: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 36 },
  pipelineChip: {
    background: '#f1f3f5', border: '1px solid #e5e7eb', color: '#1f2328',
    fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 6,
    cursor: 'pointer', textDecoration: 'none',
  },
  pipelineSource: {
    background: '#fff8f0', border: '1px solid #fed7aa', color: '#9a3412',
    fontSize: 12, fontFamily: 'monospace', fontWeight: 600, padding: '5px 12px', borderRadius: 6,
  },
  arrow: { color: '#d1d5db', fontSize: 14 },
  ctaBtn: {
    background: '#1f6feb', color: '#fff', fontWeight: 600,
    padding: '11px 28px', borderRadius: 8, border: 'none',
    cursor: 'pointer', fontSize: 14, letterSpacing: '-0.01em',
  },
  fileCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '18px 20px', marginBottom: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap' as const, gap: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,.06)',
  },
  fileIcon: {
    background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8,
    padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.badge}>
          <span style={s.dot} />
          IBM Bob 2.0 — Hackathon Prototype
        </div>
        <h1 style={s.h1}>Legacy<span style={{ color: '#1f6feb' }}>Lift</span></h1>
        <p style={s.subtitle}>Legacy Application Modernization Accelerator</p>
        <p style={s.desc}>
          Understand, assess, modernize, and validate a legacy Java 8 application —
          guided by IBM Bob 2.0 through every step of the transformation.
        </p>

        {/* Pipeline flow */}
        <div style={s.pipeline}>
          <span style={s.pipelineSource}>Legacy Java 8</span>
          {PIPELINE.map((item) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={s.arrow}>→</span>
              <button
                onClick={() => navigate(item.path)}
                style={{
                  ...s.pipelineChip,
                  color: item.accentColor,
                  background: item.accentBg,
                  border: `1px solid ${item.accentBorder}`,
                }}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/analysis')} style={s.ctaBtn}>
          Start Demo →
        </button>
      </div>

      {/* Target file card */}
      <div style={s.fileCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={s.fileIcon}>
            <svg width={18} height={18} fill="none" stroke="#ea580c" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: '#1f2328' }}>
              CustomerOrderProcessor.java
            </div>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>
              Java 8 · Legacy Module · ACME Corp Order System
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          <span style={{ background: '#fff5f5', color: '#cf222e', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, border: '1px solid #fecaca' }}>
            Critical ×2
          </span>
          <span style={{ background: '#fffbeb', color: '#b45309', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, border: '1px solid #fde68a' }}>
            Warning ×5
          </span>
          <span style={{ background: '#f8f9fb', color: '#57606a', fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 5, border: '1px solid #e5e7eb' }}>
            Info ×2
          </span>
        </div>
      </div>

      {/* Step cards */}
      <div style={s.grid}>
        {PIPELINE.map(step => (
          <button
            key={step.step}
            onClick={() => navigate(step.path)}
            style={{
              background: '#fff',
              border: `1px solid ${step.accentBorder}`,
              borderRadius: 10,
              padding: '18px 20px',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,.05)',
              transition: 'box-shadow 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.10)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>{step.step}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
                color: step.accentColor, background: step.accentBg, border: `1px solid ${step.accentBorder}`,
              }}>
                {/* Special: validation badge amber since it's partial */}
                {step.step === '05' ? (
                  <span style={{ color: '#b45309' }}>{step.badge}</span>
                ) : step.badge}
              </span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2328', marginBottom: 6 }}>{step.label}</div>
            <div style={{ fontSize: 12, color: '#57606a', lineHeight: 1.6 }}>{step.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
