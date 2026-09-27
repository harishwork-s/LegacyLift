import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PlanStep {
  id: number
  title: string
  description: string
  effort: 'Low' | 'Medium' | 'High'
  status: 'Done' | 'In Progress' | 'Pending'
  outcome: string
}

interface ModernizationPlan {
  module: string
  targetStack: string
  totalSteps: number
  steps: PlanStep[]
}

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string; dot: string }> = {
  Done:        { bg: '#f0fdf4', border: '#bbf7d0', color: '#1a7f37', dot: '#1a7f37' },
  'In Progress':{ bg: '#eff6ff', border: '#bfdbfe', color: '#1558b0', dot: '#1f6feb' },
  Pending:     { bg: '#f8f9fb', border: '#e5e7eb', color: '#57606a', dot: '#d1d5db' },
}

const EFFORT_STYLE: Record<string, string> = {
  Low:    '#1a7f37',
  Medium: '#b45309',
  High:   '#cf222e',
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
}

export default function ModernizationPage() {
  const [data, setData] = useState<ModernizationPlan | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/modernization').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1f6feb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const doneCount = data.steps.filter(s => s.status === 'Done').length
  const inProgCount = data.steps.filter(s => s.status === 'In Progress').length
  const pendingCount = data.steps.length - doneCount - inProgCount
  const progress = Math.round((doneCount / data.steps.length) * 100)

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>03 / 05</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Modernization Plan</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2328', margin: 0, letterSpacing: '-0.02em' }}>Modernization Plan</h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>
            Target: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1f6feb' }}>{data.targetStack}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          style={{ fontSize: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#57606a', fontWeight: 500, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}
        >
          Next: Before / After →
        </button>
      </div>

      {/* Progress card */}
      <div style={{ ...card, padding: '20px 22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2328' }}>Overall Progress</span>
          <span style={{ fontSize: 13, color: '#57606a' }}>{doneCount} of {data.steps.length} steps complete</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 10, background: '#f1f3f5', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: '100%', background: '#1f6feb', borderRadius: 99, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a7f37', flexShrink: 0 }} />
            <span style={{ color: '#1a7f37', fontWeight: 500 }}>{doneCount} Done</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1f6feb', flexShrink: 0 }} />
            <span style={{ color: '#1558b0', fontWeight: 500 }}>{inProgCount} In Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
            <span style={{ color: '#57606a', fontWeight: 500 }}>{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.steps.map(step => {
          const ss = STATUS_STYLE[step.status]
          const isOpen = expanded === step.id
          return (
            <div key={step.id} style={{ ...card, overflow: 'hidden', borderLeft: `3px solid ${ss.dot}` }}>
              <button
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => setExpanded(isOpen ? null : step.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Step number — secondary */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: ss.bg, border: `1px solid ${ss.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'monospace', color: ss.color, fontWeight: 700,
                  }}>
                    {step.id}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2328' }}>{step.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 4, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color }}>
                        {step.status}
                      </span>
                      <span style={{ fontSize: 11, color: EFFORT_STYLE[step.effort], fontWeight: 500 }}>
                        {step.effort} effort
                      </span>
                    </div>
                  </div>
                </div>
                <span style={{ color: '#8b949e', fontSize: 11, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div style={{ borderTop: '1px solid #f1f3f5', padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.7, margin: '0 0 14px' }}>{step.description}</p>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: '#1a7f37', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#8b949e', fontWeight: 500, flexShrink: 0 }}>Outcome:</span>
                    <span>{step.outcome}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
