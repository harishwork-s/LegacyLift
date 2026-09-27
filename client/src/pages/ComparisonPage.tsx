import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'

interface ComparisonData {
  before: string
  after: string
}

const ARCH_ROWS = [
  { aspect: 'Language',       before: 'Java 8',                   after: 'Java 17 (LTS)',             improved: true },
  { aspect: 'Framework',      before: 'None / raw JDBC',          after: 'Spring Boot 3 + JPA',       improved: true },
  { aspect: 'API Style',      before: 'Direct method calls',      after: 'REST endpoints',            improved: true },
  { aspect: 'Error Handling', before: 'Silent null returns',      after: 'Typed exceptions + 4xx/5xx',improved: true },
  { aspect: 'DB Access',      before: 'String-concat SQL (SQLi)', after: 'JPA / PreparedStatements',  improved: true },
  { aspect: 'Test Coverage',  before: '0%',                       after: '≥ 80% (JUnit 5)',           improved: true },
  { aspect: 'Architecture',   before: 'Monolith class',           after: 'Layered service / repo',    improved: true },
]

const RISKS = [
  { label: 'SQL Injection (Critical)',        before: 'String concat in raw query',   after: 'JPA parameterised query',       severity: 'critical' },
  { label: 'No Input Validation (Critical)',  before: 'Accepts any input silently',   after: 'Bean Validation annotations',  severity: 'critical' },
  { label: 'Silent Null Returns (Warning)',   before: 'Returns null on error',        after: 'Throws typed exceptions',       severity: 'warning' },
  { label: 'Raw JDBC / Coupling (Warning)',   before: 'Tight DB coupling in class',   after: 'Repository abstraction layer',  severity: 'warning' },
  { label: '0% Test Coverage (Warning)',      before: 'No tests whatsoever',          after: 'JUnit 5 suite — 83% pass rate', severity: 'warning' },
]

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
}

export default function ComparisonPage() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/comparison').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1f6feb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>04 / 05</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Before / After</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2328', margin: 0, letterSpacing: '-0.02em' }}>Before / After — Code Comparison</h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>
            Modernization in progress for <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1f2328' }}>CustomerOrderProcessor.java</span> — Legacy Java 8 → Java 17 + Spring Boot 3
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
            Validation: 10/12 passed · 83%
          </div>
          <button
            onClick={() => navigate('/validation')}
            style={{ background: '#1f6feb', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer' }}
          >
            View Validation →
          </button>
        </div>
      </div>

      {/* Identity cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* LEGACY */}
        <div style={{ ...card, borderTop: '3px solid #cf222e', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#cf222e', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.04em' }}>
              LEGACY
            </span>
            <span style={{ color: '#8b949e', fontSize: 12 }}>original source</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: '#1f2328', marginBottom: 2 }}>CustomerOrderProcessor.java</div>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 16 }}>Java 8 · Monolith · ACME Corp Order System</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Lines of Code',  value: '130',       color: '#1f2328' },
              { label: 'Test Coverage',  value: '0%',        color: '#cf222e' },
              { label: 'Risk Score',     value: '87 / High', color: '#cf222e' },
              { label: 'Issues Found',   value: '9',         color: '#ea580c' },
            ].map(m => (
              <div key={m.label} style={{ background: '#fafafa', border: '1px solid #f1f3f5', borderRadius: 7, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MODERNIZED */}
        <div style={{ ...card, borderTop: '3px solid #1a7f37', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1a7f37', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.04em' }}>
              MODERNIZED
            </span>
            <span style={{ color: '#8b949e', fontSize: 12 }}>transformed output</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: '#1f2328', marginBottom: 2 }}>CustomerOrderService.java</div>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 16 }}>Java 17 · Spring Boot 3 · REST Service</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Lines of Code',  value: '~180',     color: '#1f2328' },
              { label: 'Test Coverage',  value: '≥80%',     color: '#1a7f37' },
              { label: 'Risk Score',     value: '12 / Low', color: '#1a7f37' },
              { label: 'Issues Found',   value: '0',        color: '#1a7f37' },
            ].map(m => (
              <div key={m.label} style={{ background: '#fafafa', border: '1px solid #f1f3f5', borderRadius: 7, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architectural transformation table */}
      <div style={{ ...card, padding: '22px 24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1f2328', margin: '0 0 16px' }}>Architectural Transformation</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500, paddingBottom: 10, paddingRight: 24, width: 130 }}>Aspect</th>
                <th style={{ textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500, paddingBottom: 10, paddingRight: 24 }}>
                  <span style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#cf222e', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, marginRight: 6 }}>BEFORE</span>
                  Legacy
                </th>
                <th style={{ textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500, paddingBottom: 10 }}>
                  <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1a7f37', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, marginRight: 6 }}>AFTER</span>
                  Modernized
                </th>
              </tr>
            </thead>
            <tbody>
              {ARCH_ROWS.map((row, i) => (
                <tr key={row.aspect} style={{ background: i % 2 === 1 ? '#f8f9fb' : '#fff', borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '10px 24px 10px 0', fontSize: 12, fontWeight: 600, color: '#57606a' }}>{row.aspect}</td>
                  <td style={{ padding: '10px 24px 10px 0', fontSize: 12, fontFamily: 'monospace', color: '#cf222e' }}>{row.before}</td>
                  <td style={{ padding: '10px 0', fontSize: 12, fontFamily: 'monospace' }}>
                    <span style={{ color: '#1a7f37' }}>{row.after}</span>
                    {row.improved && <span style={{ marginLeft: 8, fontSize: 11, color: '#1a7f37', fontFamily: 'sans-serif' }}>✓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key risks addressed */}
      <div style={{ ...card, padding: '22px 24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1f2328', margin: '0 0 16px' }}>Key Risks Addressed</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {RISKS.map((risk, i) => {
            const isCrit = risk.severity === 'critical'
            const labelColor = isCrit ? '#cf222e' : '#b45309'
            const dotColor = isCrit ? '#cf222e' : '#f59e0b'
            return (
              <div key={risk.label} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 2fr', gap: 12, alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < RISKS.length - 1 ? '1px solid #f1f3f5' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>{risk.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, background: '#fff5f5', border: '1px solid #fecaca', color: '#cf222e', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>BEFORE</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#57606a' }}>{risk.before}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1a7f37', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>AFTER</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#1a7f37' }}>{risk.after}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Diff viewer */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1f2328', margin: 0 }}>Line-by-Line Diff</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#8b949e' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#fef2f2', border: '1px solid #fecaca', display: 'inline-block' }} />
              Removed lines
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'inline-block' }} />
              Added lines
            </span>
          </div>
        </div>

        {/* Panel labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#cf222e', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>LEGACY</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#8b949e' }}>CustomerOrderProcessor.java — Java 8</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1a7f37', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>MODERNIZED</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#8b949e' }}>CustomerOrderService.java — Java 17 + Spring Boot 3</span>
          </div>
        </div>

        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb', fontSize: 12 }}>
          <ReactDiffViewer
            oldValue={data.before}
            newValue={data.after}
            splitView={true}
            compareMethod={DiffMethod.LINES}
            useDarkTheme={false}
            styles={{
              variables: {
                light: {
                  diffViewerBackground: '#ffffff',
                  diffViewerColor: '#1f2328',
                  addedBackground: '#f0fdf4',
                  addedColor: '#1a7f37',
                  removedBackground: '#fff5f5',
                  removedColor: '#cf222e',
                  wordAddedBackground: '#bbf7d0',
                  wordRemovedBackground: '#fecaca',
                  addedGutterBackground: '#f0fdf4',
                  removedGutterBackground: '#fff5f5',
                  gutterBackground: '#f8f9fb',
                  gutterBackgroundDark: '#f1f3f5',
                  highlightBackground: '#eff6ff',
                  highlightGutterBackground: '#eff6ff',
                  codeFoldBackground: '#f8f9fb',
                  emptyLineBackground: '#fafafa',
                  gutterColor: '#8b949e',
                  addedGutterColor: '#1a7f37',
                  removedGutterColor: '#cf222e',
                  codeFoldContentColor: '#8b949e',
                  diffViewerTitleBackground: '#f8f9fb',
                  diffViewerTitleColor: '#57606a',
                  diffViewerTitleBorderColor: '#e5e7eb',
                }
              }
            }}
          />
        </div>
      </div>

      {/* Validation status banner */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, background: '#fff', border: '2px solid #f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#b45309', flexShrink: 0 }}>
            !
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2328' }}>Validation Partial — 1 failure, 1 skipped</div>
            <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>
              JUnit 5 · 10 passed · 1 failed · 1 skipped · 83% pass rate · Modernization steps 4–6 incomplete
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/validation')}
          style={{ background: '#1f6feb', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          View Full Validation Results →
        </button>
      </div>

    </div>
  )
}
