import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Issue {
  id: string
  type: string
  severity: 'Critical' | 'Warning' | 'Info'
  title: string
  description: string
  line: number | null
  recommendation: string
}

interface AnalysisResult {
  file: string
  language: string
  linesOfCode: number
  complexityScore: number
  issues: Issue[]
}

const SEV: Record<string, { bg: string; border: string; color: string }> = {
  Critical: { bg: '#fff5f5', border: '#fecaca', color: '#cf222e' },
  Warning:  { bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
  Info:     { bg: '#f8f9fb', border: '#e5e7eb', color: '#57606a' },
}

const TYPE_COLOR: Record<string, string> = {
  Security:    '#cf222e',
  Design:      '#7c3aed',
  Performance: '#ea580c',
  Reliability: '#b45309',
  Quality:     '#1f6feb',
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
}

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [_scanned, setScanned] = useState(false)
  const navigate = useNavigate()

  const runAnalysis = async () => {
    setLoading(true)
    setData(null)
    await new Promise(r => setTimeout(r, 1500))
    const res = await fetch('/api/analysis')
    const json = await res.json()
    setData(json)
    setScanned(true)
    setLoading(false)
  }

  useEffect(() => { runAnalysis() }, [])

  const criticalCount = data?.issues.filter(i => i.severity === 'Critical').length ?? 0

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>01 / 05</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Code Analysis</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2328', margin: 0, letterSpacing: '-0.02em' }}>Legacy Code Analysis</h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>IBM Bob 2.0 scans your legacy module and surfaces risk patterns.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ fontSize: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#57606a', fontWeight: 500, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}
        >
          Next: Risks →
        </button>
      </div>

      {/* File header */}
      <div style={{ ...card, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 8 }}>
            <svg width={18} height={18} fill="none" stroke="#ea580c" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: '#1f2328' }}>CustomerOrderProcessor.java</div>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>Java 8 · Legacy Module · ACME Corp Order System</div>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{ background: '#1f6feb', color: '#fff', fontWeight: 500, fontSize: 13, padding: '7px 16px', borderRadius: 7, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Scanning…' : 'Re-Analyse'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ ...card, padding: 48, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1f6feb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: '#57606a', margin: 0 }}>IBM Bob 2.0 is scanning your codebase…</p>
        </div>
      )}

      {data && (
        <>
          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Lines of Code',     value: data.linesOfCode,   color: '#1f2328' },
              { label: 'Complexity Score',  value: data.complexityScore, color: '#ea580c' },
              { label: 'Critical Issues',   value: criticalCount,       color: '#cf222e' },
              { label: 'Total Issues',      value: data.issues.length,  color: '#1f2328' },
            ].map(m => (
              <div key={m.label} style={{ ...card, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Issue list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.issues.map(issue => {
              const sev = SEV[issue.severity]
              return (
                <div key={issue.id} style={{ ...card, borderLeft: `3px solid ${sev.color}`, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color }}>
                      {issue.severity}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: TYPE_COLOR[issue.type] ?? '#57606a' }}>
                      {issue.type}
                    </span>
                    {issue.line && (
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8b949e', background: '#f8f9fb', border: '1px solid #e5e7eb', padding: '1px 6px', borderRadius: 4 }}>
                        Line {issue.line}
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2328', marginBottom: 5 }}>{issue.title}</div>
                  <p style={{ fontSize: 13, color: '#57606a', margin: '0 0 12px', lineHeight: 1.6 }}>{issue.description}</p>
                  <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: '#1558b0', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#8b949e', fontWeight: 500, flexShrink: 0 }}>Fix:</span>
                    <span>{issue.recommendation}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
