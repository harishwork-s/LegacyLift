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
  { label: 'SQL Injection (Critical)',        before: 'String concat in raw query',   after: 'JPA parameterised query',       color: 'text-red-400',    dot: 'bg-red-500' },
  { label: 'No Input Validation (Critical)',  before: 'Accepts any input silently',   after: 'Bean Validation annotations',  color: 'text-red-400',    dot: 'bg-red-500' },
  { label: 'Silent Null Returns (Warning)',   before: 'Returns null on error',        after: 'Throws typed exceptions',       color: 'text-yellow-400', dot: 'bg-yellow-500' },
  { label: 'Raw JDBC / Coupling (Warning)',   before: 'Tight DB coupling in class',   after: 'Repository abstraction layer',  color: 'text-yellow-400', dot: 'bg-yellow-500' },
  { label: '0% Test Coverage (Warning)',      before: 'No tests whatsoever',          after: 'JUnit 5 suite — 83% pass rate', color: 'text-yellow-400', dot: 'bg-yellow-500' },
]

export default function ComparisonPage() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/comparison').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">04 / 05</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">Before / After</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Before / After — Code Comparison</h1>
          <p className="text-slate-400 text-sm mt-1">
            Modernization in progress for <span className="font-mono text-slate-300">CustomerOrderProcessor.java</span> — Legacy Java 8 → Java 17 + Spring Boot 3
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-yellow-950 border border-yellow-800 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
            Validation: 10/12 passed · 83%
          </div>
          <button
            onClick={() => navigate('/validation')}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            View Validation →
          </button>
        </div>
      </div>

      {/* Identity cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEGACY */}
        <div className="bg-slate-900 border-2 border-red-900 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-950 border border-red-700 text-red-400 text-xs font-bold px-2.5 py-1 rounded-lg tracking-wide">
              LEGACY
            </span>
            <span className="text-slate-500 text-xs">— original source</span>
          </div>
          <div className="font-mono text-sm text-white mb-1">CustomerOrderProcessor.java</div>
          <div className="text-slate-500 text-xs mb-4">Java 8 · Monolith · ACME Corp Order System</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Lines of Code</div>
              <div className="text-lg font-bold text-white">130</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Test Coverage</div>
              <div className="text-lg font-bold text-red-400">0%</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Risk Score</div>
              <div className="text-lg font-bold text-red-400">87 / High</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Issues Found</div>
              <div className="text-lg font-bold text-orange-400">9</div>
            </div>
          </div>
        </div>

        {/* MODERNIZED */}
        <div className="bg-slate-900 border-2 border-green-900 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-950 border border-green-700 text-green-400 text-xs font-bold px-2.5 py-1 rounded-lg tracking-wide">
              MODERNIZED
            </span>
            <span className="text-slate-500 text-xs">— transformed output</span>
          </div>
          <div className="font-mono text-sm text-white mb-1">CustomerOrderService.java</div>
          <div className="text-slate-500 text-xs mb-4">Java 17 · Spring Boot 3 · REST Service</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Lines of Code</div>
              <div className="text-lg font-bold text-white">~180</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Test Coverage</div>
              <div className="text-lg font-bold text-green-400">≥80%</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Risk Score</div>
              <div className="text-lg font-bold text-green-400">12 / Low</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">Issues Found</div>
              <div className="text-lg font-bold text-green-400">0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural transformation */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Architectural Transformation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-6 w-40">Aspect</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-6">
                  <span className="bg-red-950 border border-red-900 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold mr-1">BEFORE</span>
                  Legacy
                </th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">
                  <span className="bg-green-950 border border-green-900 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold mr-1">AFTER</span>
                  Modernized
                </th>
              </tr>
            </thead>
            <tbody>
              {ARCH_ROWS.map(row => (
                <tr key={row.aspect} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-6 text-xs font-medium text-slate-400">{row.aspect}</td>
                  <td className="py-3 pr-6 text-xs text-red-300 font-mono">{row.before}</td>
                  <td className="py-3 text-xs font-mono">
                    <span className="text-green-300">{row.after}</span>
                    {row.improved && (
                      <span className="ml-2 text-[10px] text-green-600 font-sans">✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key risks addressed */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Key Risks Addressed</h2>
        <div className="space-y-3">
          {RISKS.map(risk => (
            <div key={risk.label} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center border-b border-slate-800/60 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${risk.dot}`}></span>
                <span className={`text-xs font-semibold ${risk.color}`}>{risk.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-950 border border-red-900 text-red-400 px-1.5 py-0.5 rounded font-bold">BEFORE</span>
                <span className="text-xs text-slate-400 font-mono">{risk.before}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-green-950 border border-green-900 text-green-400 px-1.5 py-0.5 rounded font-bold">AFTER</span>
                <span className="text-xs text-green-300 font-mono">{risk.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff viewer */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-white">Line-by-Line Diff</h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-950 border border-red-800 inline-block"></span>
              Removed lines
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-950 border border-green-800 inline-block"></span>
              Added lines
            </span>
          </div>
        </div>

        {/* Panel labels */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-center gap-2 px-1">
            <span className="bg-red-950 border border-red-800 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">LEGACY</span>
            <span className="text-slate-500 text-xs font-mono">CustomerOrderProcessor.java — Java 8</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="bg-green-950 border border-green-800 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">MODERNIZED</span>
            <span className="text-slate-500 text-xs font-mono">CustomerOrderService.java — Java 17 + Spring Boot 3</span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-700 text-xs">
          <ReactDiffViewer
            oldValue={data.before}
            newValue={data.after}
            splitView={true}
            compareMethod={DiffMethod.LINES}
            useDarkTheme={true}
            styles={{
              variables: {
                dark: {
                  diffViewerBackground: '#0f172a',
                  diffViewerColor: '#e2e8f0',
                  addedBackground: '#052e16',
                  addedColor: '#86efac',
                  removedBackground: '#450a0a',
                  removedColor: '#fca5a5',
                  wordAddedBackground: '#14532d',
                  wordRemovedBackground: '#7f1d1d',
                  addedGutterBackground: '#052e16',
                  removedGutterBackground: '#450a0a',
                  gutterBackground: '#1e293b',
                  gutterBackgroundDark: '#1e293b',
                  highlightBackground: '#1e40af22',
                  highlightGutterBackground: '#1e40af22',
                  codeFoldBackground: '#1e293b',
                  emptyLineBackground: '#1e293b',
                  gutterColor: '#64748b',
                  addedGutterColor: '#86efac',
                  removedGutterColor: '#fca5a5',
                  codeFoldContentColor: '#94a3b8',
                  diffViewerTitleBackground: '#1e293b',
                  diffViewerTitleColor: '#94a3b8',
                  diffViewerTitleBorderColor: '#334155',
                }
              }
            }}
          />
        </div>
      </div>

      {/* Validation status banner */}
      <div className="bg-slate-900 border border-yellow-800 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 border border-yellow-700 rounded-full flex items-center justify-center text-yellow-400 text-lg font-bold flex-shrink-0">
            !
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Validation Partial — 1 failure, 1 skipped</div>
            <div className="text-yellow-300 text-xs mt-0.5">
              JUnit 5 · 10 passed · 1 failed · 1 skipped · 83% pass rate · Modernization steps 4–6 incomplete
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/validation')}
          className="bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          View Full Validation Results →
        </button>
      </div>

    </div>
  )
}
