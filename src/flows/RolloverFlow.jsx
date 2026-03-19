import React, { useState } from 'react'
import { ChevronLeft, RefreshCcw, Check, CheckCircle2, Download, Send, FileText } from 'lucide-react'

const STEPS = ['Plan details', 'Instructions', 'Checklist', 'Tracking']

const RECORDKEEPERS = ['Fidelity', 'Vanguard', 'Schwab', 'TIAA', 'Empower', 'Principal', 'Other']

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className={`step-dot transition-all ${
              i < current ? 'bg-success text-white' :
              i === current ? 'bg-primary text-white' :
              'bg-card border border-border text-subtle'
            }`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${i === current ? 'text-white' : 'text-subtle'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mb-5 mx-1 ${i < current ? 'bg-success/50' : 'bg-border'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function RolloverFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [recordkeeper, setRecordkeeper] = useState('')
  const [planName, setPlanName] = useState('')
  const [amount, setAmount] = useState('')
  const [checks, setChecks] = useState({})

  const rolloverRef = 'ADW-ROLLOVER-' + account.id.toUpperCase() + '-2026'
  const payableTo = 'Anchorage Digital — FBO James Whitfield'
  const mailTo = 'Anchorage Digital, 450 Sansome St, San Francisco, CA 94111'

  const checklistItems = [
    `Call ${recordkeeper || 'your plan provider'} and request a rollover distribution`,
    `Tell them the check should be made payable to: "${payableTo}"`,
    `Include the reference code in the memo: ${rolloverRef}`,
    'Request the check be mailed to the Anchorage Digital mailing address',
    'Confirm rollover type: direct rollover (not taxable)',
    'Expect check delivery in 7–14 business days',
  ]

  const allChecked = checklistItems.every((_, i) => checks[i])

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : '401(k) Rollover'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <RefreshCcw size={15} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">401(k) Rollover</h2>
          <p className="text-xs text-muted">Into {account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Step 0: Plan details */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Current recordkeeper / plan provider</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {RECORDKEEPERS.map(rk => (
                <button
                  key={rk}
                  onClick={() => setRecordkeeper(rk)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    recordkeeper === rk
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted hover:text-white hover:border-subtle'
                  }`}
                >
                  {rk}
                </button>
              ))}
            </div>
            {recordkeeper === 'Other' && (
              <input className="input mt-2" placeholder="Enter plan provider name" />
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Plan / employer name (optional)</label>
            <input
              className="input"
              placeholder="e.g. Acme Corp 401(k) Plan"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Estimated rollover amount (optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                className="input pl-7"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </div>
          </div>

          <div className="p-3 bg-surface border border-border rounded-xl text-xs text-muted">
            This is a direct rollover into an IRA. No tax withholding applies when funds go directly from the plan to the IRA custodian.
          </div>

          <button
            className="btn-primary w-full"
            disabled={!recordkeeper}
            onClick={() => setStep(1)}
          >
            Get rollover instructions
          </button>
        </div>
      )}

      {/* Step 1: Instructions */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Rollover Instructions</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-white border border-border rounded-lg px-2.5 py-1.5 hover:bg-card">
                  <Download size={11} />Print
                </button>
                <button className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1.5 hover:bg-primary/10">
                  <Send size={11} />Send to client
                </button>
              </div>
            </div>

            {[
              { label: 'Check payable to', value: payableTo },
              { label: 'Reference / memo', value: rolloverRef },
              { label: 'Mail check to', value: mailTo },
              { label: 'Rollover type', value: 'Direct rollover (60-day rule does not apply)' },
              { label: 'Expected timeline', value: '2–4 weeks from when check is mailed' },
            ].map(({ label, value }) => (
              <div key={label} className="py-2.5 border-b border-border last:border-0">
                <div className="text-[11px] text-muted mb-0.5">{label}</div>
                <div className="text-sm text-white font-medium">{value}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl text-xs text-warning/90">
            <span className="font-semibold">Important:</span> If the check is made payable to the client instead of "Anchorage Digital FBO [client name]", it will be subject to 20% mandatory withholding and could be treated as a taxable distribution.
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>Back</button>
            <button className="btn-primary flex-1" onClick={() => setStep(2)}>Continue to checklist</button>
          </div>
        </div>
      )}

      {/* Step 2: Checklist */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-white mb-1">Client action checklist</div>
            <div className="text-xs text-muted mb-4">Share these steps with {account.label} holder. Check each item off as it's completed.</div>
          </div>

          <div className="card p-4 space-y-3">
            {checklistItems.map((item, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-all ${
                    checks[i] ? 'bg-success border-success' : 'border-border group-hover:border-subtle'
                  }`}
                  onClick={() => setChecks(c => ({ ...c, [i]: !c[i] }))}
                >
                  {checks[i] && <Check size={10} className="text-white" />}
                </div>
                <span className={`text-xs leading-relaxed ${checks[i] ? 'text-muted line-through' : 'text-white'}`}>{item}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn-primary flex-1"
              onClick={() => setStep(3)}
            >
              Start tracking →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tracking */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-center">
            <CheckCircle2 size={32} className="text-orange-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">Rollover initiated</div>
            <div className="text-xs text-muted">
              Watching for check from {recordkeeper || 'plan provider'}
              {amount ? ' · ~$' + parseFloat(amount).toLocaleString() : ''}
            </div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-semibold text-white mb-4">Rollover milestones</div>
            {[
              { label: 'Instructions generated', sub: 'Sent to client', done: true },
              { label: 'Client contacts recordkeeper', sub: recordkeeper || 'Plan provider', active: true },
              { label: 'Check mailed by recordkeeper', sub: '5–10 business days', done: false },
              { label: 'Check received by Anchorage', sub: 'Mailroom processing', done: false },
              { label: 'Check deposited & matched', sub: 'Ops verification', done: false },
              { label: 'Funds available', sub: 'Available to invest', done: false },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.done ? 'bg-success/20 text-success' :
                    s.active ? 'bg-orange-500/20 text-orange-400' :
                    'bg-surface border border-border'
                  }`}>
                    {s.done ? <Check size={10} /> :
                     s.active ? <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> : null}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-px my-1 ${s.done ? 'bg-success/30' : 'bg-border'}`} style={{height:16}} />
                  )}
                </div>
                <div className="pb-3">
                  <div className={`text-sm font-medium ${s.done ? 'text-white' : s.active ? 'text-orange-300' : 'text-subtle'}`}>{s.label}</div>
                  <div className="text-xs text-muted">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-1.5 flex-1 btn-ghost justify-center text-xs">
              <FileText size={12} />
              View cover sheet
            </button>
            <button className="btn-primary flex-1" onClick={onDone}>Back to Funding</button>
          </div>
        </div>
      )}
    </div>
  )
}
