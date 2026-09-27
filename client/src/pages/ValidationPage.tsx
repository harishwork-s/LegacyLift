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

const STATUS_ICON: Record<string, string> = {
  PASSED:  '✓',
  FAILED:  '✗',
  SKIPPED: '○',
}

const STATUS_ROW: Record<string, string> = {
  PASSED:  'border-l-2 border-l-green-600',
  FAILED:  'border-l-2 border-l-red-600',
  SKIPPED: 'border-l-2 border-l-slate-600',
}

const STATUS_ICON_COLOR: Record<string, string> = {
  PASSED:  'text-green-400',
  FAILED:  'text-red-400',
  SKIPPED: 'text-slate-500',
}

export default function ValidationPage() {
  const [data, setData] = useState<ValidationData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/validation').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const passRate = Math.round((data.summary.passed / data.summary.total) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">05 / 05</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">Validation</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Test & Validation Results</h1>
          <p className="text-slate-400 text-sm">
            {data.suite} · {data.framework} · Ran at {new Date(data.runAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium px-3 py-1.5 rounded-lg transition-colors mt-1"
        >
          ← Before / After
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-white">{data.summary.total}</div>
          <div className="text-slate-500 text-xs mt-1">Total</div>
        </div>
        <div className="bg-slate-900 border border-green-900 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{data.summary.passed}</div>
          <div className="text-slate-500 text-xs mt-1">Passed</div>
        </div>
        <div className="bg-slate-900 border border-red-900 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{data.summary.failed}</div>
          <div className="text-slate-500 text-xs mt-1">Failed</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{data.summary.skipped}</div>
          <div className="text-slate-500 text-xs mt-1">Skipped</div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{passRate}%</div>
          <div className="text-slate-500 text-xs mt-1">Pass Rate</div>
        </div>
      </div>

      {/* Pass rate bar */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Test pass rate</span>
          <span>{data.totalDuration} total</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${passRate}%` }} />
        </div>
      </div>

      {/* Results table */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 text-xs text-slate-500 px-4 py-2 border-b border-slate-800 bg-slate-800/50">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Test Name</div>
          <div className="col-span-3">Class</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Time</div>
        </div>
        {data.results.map(r => (
          <div key={r.id} className={`px-4 py-3 border-b border-slate-800 last:border-0 ${STATUS_ROW[r.status]}`}>
            <div className="grid grid-cols-12 items-start text-sm">
              <div className="col-span-1 text-slate-500 text-xs">{r.id}</div>
              <div className="col-span-5 pr-2">
                <div className="font-mono text-xs text-slate-300 leading-relaxed">{r.testName}</div>
                {r.failureReason && (
                  <div className="text-red-400 text-xs mt-1 leading-relaxed bg-red-950/50 rounded px-2 py-1">
                    {r.failureReason}
                  </div>
                )}
                {r.skipReason && (
                  <div className="text-slate-500 text-xs mt-1 italic">{r.skipReason}</div>
                )}
              </div>
              <div className="col-span-3 text-xs text-slate-500 font-mono pr-2">{r.testClass}</div>
              <div className="col-span-2">
                <span className={`font-bold text-xs ${STATUS_ICON_COLOR[r.status]}`}>
                  {STATUS_ICON[r.status]} {r.status}
                </span>
              </div>
              <div className="col-span-1 text-right text-xs text-slate-500">{r.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
