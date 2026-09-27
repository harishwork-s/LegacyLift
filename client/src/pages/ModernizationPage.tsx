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

const STATUS_STYLES = {
  Done:        'bg-green-950 text-green-400 border border-green-800',
  'In Progress':'bg-blue-950 text-blue-400 border border-blue-800',
  Pending:     'bg-slate-800 text-slate-400 border border-slate-700',
}

const EFFORT_STYLES = {
  Low:    'text-green-400',
  Medium: 'text-yellow-400',
  High:   'text-red-400',
}

export default function ModernizationPage() {
  const [data, setData] = useState<ModernizationPlan | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/modernization').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const doneCount = data.steps.filter(s => s.status === 'Done').length
  const inProgCount = data.steps.filter(s => s.status === 'In Progress').length
  const progress = Math.round((doneCount / data.steps.length) * 100)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">03 / 05</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">Modernization Plan</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Modernization Plan</h1>
          <p className="text-slate-400 text-sm">
            Target: <span className="text-blue-400 font-mono text-xs">{data.targetStack}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/comparison')}
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium px-3 py-1.5 rounded-lg transition-colors mt-1"
        >
          Next: Before / After →
        </button>
      </div>

      {/* Progress */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-6">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-white font-medium">Overall Progress</span>
          <span className="text-slate-400">{doneCount} of {data.steps.length} steps complete</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-green-400">✓ {doneCount} Done</span>
          <span className="text-blue-400">⟳ {inProgCount} In Progress</span>
          <span className="text-slate-500">○ {data.steps.length - doneCount - inProgCount} Pending</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {data.steps.map(step => (
          <div key={step.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
              onClick={() => setExpanded(expanded === step.id ? null : step.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-mono text-slate-400 flex-shrink-0">
                  {step.id}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{step.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLES[step.status]}`}>
                      {step.status}
                    </span>
                    <span className={`text-xs font-medium ${EFFORT_STYLES[step.effort]}`}>
                      {step.effort} effort
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-slate-500 text-xs">{expanded === step.id ? '▲' : '▼'}</span>
            </button>
            {expanded === step.id && (
              <div className="px-5 pb-5 border-t border-slate-800 pt-4">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{step.description}</p>
                <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs text-green-300">
                  <span className="text-slate-500 mr-1">Outcome:</span>{step.outcome}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
