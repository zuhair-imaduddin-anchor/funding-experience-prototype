import React, { useState } from 'react'
import { ChevronLeft, Copy, CheckCircle2, Clock, ArrowDownLeft, Building2, Send, Check, ExternalLink } from 'lucide-react'

const WIRE_STEPS = ['Amount', 'Instructions', 'Confirm', 'Tracking']

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

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-[11px] text-muted mb-0.5">{label}</div>
        <div className="text-sm font-mono font-medium text-white">{value}</div>
      </div>
      <button onClick={copy} className="p-1.5 rounded-lg hover:bg-surface text-subtle hover:text-primary transition-colors ml-4">
        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      </button>
    </div>
  )
}

const STAGES = [
  { key: 'initiated', label: 'Instructions sent', done: true },
  { key: 'pending', label: 'Awaiting wire receipt', active: true },
  { key: 'matched', label: 'Wire matched to account', done: false },
  { key: 'available', label: 'Funds available', done: false },
]

export default function WireFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  const wireInstructions = {
    bankName: 'Silvergate Bank',
    aba: '322286434',
    swift: 'SGBKUS6S',
    accountNumber: '0012948310',
    beneficiary: 'Anchorage Digital — FBO ' + account.label,
    reference: 'ADW-' + account.id.toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100),
  }

  const handleConfirm = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setStep(3)
    }, 1200)
  }

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : 'Wire Deposit'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Building2 size={15} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Wire Deposit</h2>
          <p className="text-xs text-muted">{account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={WIRE_STEPS} current={step} />

      {/* Step 0: Amount */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Deposit amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                className="input pl-7 text-lg font-semibold"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Note (optional)</label>
            <input
              className="input"
              placeholder="e.g. Initial funding"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
            <div className="text-xs text-blue-300">
              <span className="font-medium">Wire timeline:</span> Domestic wires received same day if initiated before 4pm ET. Funds available within 1 business day after receipt.
            </div>
          </div>
          <button
            className="btn-primary w-full"
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => setStep(1)}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Wire instructions */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Wire Instructions</h3>
              <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover">
                <Send size={12} />
                Send to client
              </button>
            </div>
            <CopyField label="Bank name" value={wireInstructions.bankName} />
            <CopyField label="ABA routing number" value={wireInstructions.aba} />
            <CopyField label="SWIFT / BIC" value={wireInstructions.swift} />
            <CopyField label="Account number" value={wireInstructions.accountNumber} />
            <CopyField label="Beneficiary name" value={wireInstructions.beneficiary} />
            <CopyField label="Reference / memo (required)" value={wireInstructions.reference} />
          </div>

          <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl">
            <div className="text-xs text-warning/90">
              <span className="font-semibold">Important:</span> The reference/memo field must be included exactly as shown. Wires without a matching reference may be delayed.
            </div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl">
            <div className="text-xs text-muted mb-2">Deposit amount</div>
            <div className="text-xl font-semibold text-white">${parseFloat(amount || 0).toLocaleString()}</div>
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>Back</button>
            <button className="btn-primary flex-1" onClick={() => setStep(2)}>Review & confirm</button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Review deposit</h3>
            {[
              ['Account', account.label + ' ' + account.number],
              ['Amount', '$' + parseFloat(amount || 0).toLocaleString()],
              ['Method', 'Domestic wire'],
              ['Reference', wireInstructions.reference],
              ['ETA', '1–2 business days after receipt'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-border pb-3 last:pb-0 last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-surface border border-border rounded-xl text-xs text-muted">
            By confirming, you're generating wire instructions for this deposit. The deposit will be tracked once the wire is received.
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleConfirm}
              disabled={sending}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirming...
                </>
              ) : 'Confirm deposit'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tracking */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-5 bg-success/5 border border-success/20 rounded-2xl text-center">
            <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">Wire instructions ready</div>
            <div className="text-xs text-muted">
              ${parseFloat(amount || 0).toLocaleString()} expected from client's bank
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Transfer status</h3>
            <div className="space-y-4">
              {STAGES.map((stage, i) => (
                <div key={stage.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stage.done ? 'bg-success/20 text-success' :
                      stage.active ? 'bg-primary/20 text-primary' :
                      'bg-surface text-subtle border border-border'
                    }`}>
                      {stage.done ? <Check size={12} /> :
                       stage.active ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> :
                       <div className="w-2 h-2 rounded-full bg-subtle" />}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${stage.done ? 'bg-success/30' : 'bg-border'}`} style={{minHeight:16}} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className={`text-sm font-medium ${stage.done ? 'text-white' : stage.active ? 'text-primary' : 'text-subtle'}`}>
                      {stage.label}
                    </div>
                    {stage.done && <div className="text-xs text-muted mt-0.5">Just now</div>}
                    {stage.active && (
                      <div className="text-xs text-muted mt-0.5">
                        Waiting for wire to arrive · ETA same day if sent before 4pm ET
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full" onClick={onDone}>
            Back to Funding
          </button>
        </div>
      )}
    </div>
  )
}
