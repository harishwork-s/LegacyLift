import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TestResult {
  id: number
  testClass: string
  testName: string
  status: 'PASSED' | 'FAILED' | 'SKIPPED'
  duration: string
  failureReason?: string
  skipReason?: string
}

interface ValidationData {
  suite: string
  framework: string
  runAt: string
  totalDuration: string
  summary: { total: number; passed: number; failed: number; skipped: number }
  results: TestResult[]
}

const STATUS_META: Record<string, { icon: string; color: string; bg: string; border: string; leftBorder: string }> = {
  PASSED:  { icon: '✓', color: '#1a7f37', bg: '#f0fdf4', border: '#bbf7d0', leftBorder: '#1a7f37' },
  FAILED:  { icon: '✗', color: '#cf222e', bg: '#fff5f5', border: '#fecaca', leftBorder: '#cf222e' },
  SKIPPED: { icon: '○', color: '#b45309', bg: '#fffbeb', border: '#fde68a', leftBorder: '#d1d5db' },
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
}

export default function ValidationPage() {
  const [data, setData] = useState<ValidationData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/validation').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1f6feb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const passRate = Math.round((data.summary.passed / data.summary.total) * 100)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>05 / 05</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Validation</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2328', margin: 0, letterSpacing: '-0.02em' }}>Test &amp; Validation Results</h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>
            {data.suite} · {data.framework} · Ran at {new Date(data.runAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          style={{ fontSize: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#57606a', fontWeight: 500, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}
        >
          ← Before / After
        </button>
      </div>

      {/* Partial validation banner */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 16, color: '#b45309', flexShrink: 0 }}>⚠</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>Partial Validation</span>
          <span style={{ fontSize: 13, color: '#b45309', marginLeft: 8 }}>— 1 test failed, 1 test skipped. Modernization not fully complete.</span>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total',     value: data.summary.total,   color: '#1f2328', borderColor: '#e5e7eb' },
          { label: 'Passed',    value: data.summary.passed,  color: '#1a7f37', borderColor: '#bbf7d0' },
          { label: 'Failed',    value: data.summary.failed,  color: '#cf222e', borderColor: '#fecaca' },
          { label: 'Skipped',   value: data.summary.skipped, color: '#b45309', borderColor: '#fde68a' },
          { label: 'Pass Rate', value: `${passRate}%`,        color: '#b45309', borderColor: '#fde68a' },
        ].map(m => (
          <div key={m.label} style={{ ...card, padding: '16px 18px', textAlign: 'center', borderTop: `3px solid ${m.borderColor}` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#8b949e', marginTop: 6, fontWeight: 500 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Pass rate bar */}
      <div style={{ ...card, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#57606a', marginBottom: 8 }}>
          <span>Test pass rate — <strong style={{ color: '#b45309' }}>Partial</strong></span>
          <span style={{ color: '#8b949e' }}>{data.totalDuration} total</span>
        </div>
        <div style={{ height: 10, background: '#f1f3f5', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
          {/* Green portion = passed */}
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ height: '100%', background: '#1a7f37', width: `${(data.summary.passed / data.summary.total) * 100}%` }} />
            <div style={{ height: '100%', background: '#cf222e', width: `${(data.summary.failed / data.summary.total) * 100}%` }} />
            <div style={{ height: '100%', background: '#f59e0b', width: `${(data.summary.skipped / data.summary.total) * 100}%` }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
          <span style={{ color: '#1a7f37' }}>● {data.summary.passed} passed</span>
          <span style={{ color: '#cf222e' }}>● {data.summary.failed} failed</span>
          <span style={{ color: '#f59e0b' }}>● {data.summary.skipped} skipped</span>
        </div>
      </div>

      {/* Results table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 180px 100px 60px', gap: 8, padding: '10px 18px', background: '#f8f9fb', borderBottom: '1px solid #e5e7eb' }}>
          {['#', 'Test Name', 'Class', 'Status', 'Time'].map((h, i) => (
            <div key={h} style={{ fontSize: 11, color: '#8b949e', fontWeight: 600, textAlign: i === 4 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {data.results.map((r, idx) => {
          const meta = STATUS_META[r.status]
          return (
            <div
              key={r.id}
              style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 180px 100px 60px', gap: 8,
                padding: '12px 18px',
                borderBottom: idx < data.results.length - 1 ? '1px solid #f1f3f5' : 'none',
                borderLeft: `3px solid ${meta.leftBorder}`,
                background: r.status === 'FAILED' ? '#fffafa' : idx % 2 === 1 ? '#fafafa' : '#fff',
                alignItems: 'start',
              }}
            >
              {/* # */}
              <div style={{ fontSize: 11, color: '#8b949e', paddingTop: 2 }}>{r.id}</div>

              {/* Test name + failure/skip reason */}
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#1f2328', lineHeight: 1.5 }}>{r.testName}</div>
                {r.failureReason && (
                  <div style={{ marginTop: 5, background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 5, padding: '6px 10px', fontSize: 11, color: '#cf222e', lineHeight: 1.5 }}>
                    {r.failureReason}
                  </div>
                )}
                {r.skipReason && (
                  <div style={{ marginTop: 4, fontSize: 11, color: '#b45309', fontStyle: 'italic' }}>{r.skipReason}</div>
                )}
              </div>

              {/* Class */}
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', paddingTop: 2, wordBreak: 'break-all' }}>{r.testClass}</div>

              {/* Status badge */}
              <div style={{ paddingTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
                  {meta.icon} {r.status}
                </span>
              </div>

              {/* Duration */}
              <div style={{ fontSize: 11, color: '#8b949e', textAlign: 'right', paddingTop: 2 }}>{r.duration}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
