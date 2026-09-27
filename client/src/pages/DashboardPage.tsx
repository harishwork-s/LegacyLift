import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts'

interface DashboardData {
  riskScore: number
  riskLevel: string
  linesOfCode: number
  testCoverage: number
  codeSmells: number
  couplingScore: number
  dependencies: number
  technicalDebt: string
  smellsByCategory: { category: string; count: number }[]
  riskBreakdown: { factor: string; score: number }[]
}

const RISK_COLOR = (score: number) =>
  score >= 80 ? '#cf222e' : score >= 50 ? '#b45309' : '#1a7f37'

const BAR_COLORS = ['#cf222e', '#7c3aed', '#ea580c', '#b45309', '#1f6feb']

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,.06)',
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1f6feb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const riskColor = RISK_COLOR(data.riskScore)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b949e', fontWeight: 600 }}>02 / 05</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>Risks</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2328', margin: 0, letterSpacing: '-0.02em' }}>Architecture &amp; Risk Dashboard</h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>Live metrics for CustomerOrderProcessor.java</p>
        </div>
        <button
          onClick={() => navigate('/modernization')}
          style={{ fontSize: 12, background: '#fff', border: '1px solid #e5e7eb', color: '#57606a', fontWeight: 500, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}
        >
          Next: Modernization Plan →
        </button>
      </div>

      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Risk score */}
        <div style={{ ...card, padding: '20px 22px', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%', flexShrink: 0,
            border: `4px solid ${riskColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800, color: riskColor,
            background: '#fff',
          }}>
            {data.riskScore}
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 500, marginBottom: 4 }}>Overall Risk Score</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: riskColor }}>{data.riskLevel} Risk</div>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>Technical Debt: {data.technicalDebt}</div>
          </div>
        </div>
        {/* Test coverage */}
        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 500, marginBottom: 6 }}>Test Coverage</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#cf222e', lineHeight: 1 }}>{data.testCoverage}%</div>
          <div style={{ fontSize: 12, color: '#8b949e', marginTop: 6 }}>No tests found</div>
        </div>
        {/* Coupling */}
        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={{ fontSize: 11, color: '#8b949e', fontWeight: 500, marginBottom: 6 }}>Coupling Score</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#ea580c', lineHeight: 1 }}>{data.couplingScore}</div>
          <div style={{ fontSize: 12, color: '#8b949e', marginTop: 6 }}>High coupling</div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Bar chart — Code Smells */}
        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328', marginBottom: 16 }}>Code Smells by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.smellsByCategory} barSize={26}>
              <XAxis dataKey="category" tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1f2328', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.smellsByCategory.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk breakdown */}
        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328', marginBottom: 16 }}>Risk Factor Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.riskBreakdown.map(item => {
              const fc = RISK_COLOR(item.score)
              return (
                <div key={item.factor}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#57606a' }}>{item.factor}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: fc }}>{item.score}</span>
                  </div>
                  <div style={{ height: 7, background: '#f1f3f5', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: fc, width: `${item.score}%`, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Lines of Code',       value: data.linesOfCode,   color: '#1f2328' },
          { label: 'Code Smells',          value: data.codeSmells,    color: '#ea580c' },
          { label: 'External Dependencies',value: data.dependencies,  color: '#57606a' },
        ].map(m => (
          <div key={m.label} style={{ ...card, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
