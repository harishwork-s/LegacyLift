import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import ModernizationPage from './pages/ModernizationPage'
import ComparisonPage from './pages/ComparisonPage'
import ValidationPage from './pages/ValidationPage'

const NAV_ITEMS = [
  { to: '/analysis',      label: 'Analysis',         step: '01' },
  { to: '/dashboard',     label: 'Risks',             step: '02' },
  { to: '/modernization', label: 'Plan',              step: '03' },
  { to: '/comparison',    label: 'Before / After',    step: '04' },
  { to: '/validation',    label: 'Validation',        step: '05' },
]

function NavBar() {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{
            background: '#1f6feb',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 5,
            letterSpacing: '0.05em',
          }}>LL</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1f2328', letterSpacing: '-0.01em' }}>
            Legacy<span style={{ color: '#1f6feb' }}>Lift</span>
          </span>
        </NavLink>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.to} style={{ display: 'flex', alignItems: 'center' }}>
              {idx > 0 && (
                <span style={{ color: '#d1d5db', margin: '0 2px', fontSize: 12, userSelect: 'none' }}>›</span>
              )}
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'background 0.15s, color 0.15s',
                  ...(isActive
                    ? { background: '#1f6feb', color: '#ffffff' }
                    : { color: '#57606a' }),
                })}
              >
                <span style={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.6 }}>{item.step}</span>
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f8f9fb' }}>
        <NavBar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/modernization" element={<ModernizationPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/validation" element={<ValidationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
