import React from 'react'
import { Zap, ArrowRight, Cpu, Repeat, RefreshCcw, ChevronLeft, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { RAIL_META } from '../data/mockData'

const ICON_MAP = { Zap, ArrowRight, Cpu, Repeat, RefreshCcw }

function RailCard({ rail, meta, onSelect, comingSoon }) {
  const Icon = ICON_MAP[meta.icon] || ArrowRight
  return (
    <button
      onClick={() => !comingSoon && onSelect(rail)}
      disabled={comingSoon}
      className={`w-full text-left p-5 rounded-2xl border transition-all group ${
        comingSoon
          ? 'border-border bg-surface/50 opacity-50 cursor-not-allowed'
          : `border-border bg-card hover:border-${meta.color.replace('text-', '')}/40 hover:bg-card/80 cursor-pointer`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
          <Icon size={18} className={meta.color} />
        </div>
        <div className="flex items-center gap-2">
          {meta.badge && (
            <span className="badge bg-success/15 text-success border border-success/20 text-[10px] font-semibold">
              {meta.badge}
            </span>
          )}
          {comingSoon && (
            <span className="badge bg-subtle/20 text-subtle text-[10px]">Coming soon</span>
          )}
          {!comingSoon && (
            <ArrowRight size={14} className="text-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
      <div className="text-sm font-semibold text-white mb-1">{meta.label}</div>
      <div className="text-xs text-muted mb-3">{meta.tagline}</div>
      <div className="flex gap-4 text-[11px]">
        <div>
          <span className="text-subtle">ETA: </span>
          <span className="text-white">{meta.eta}</span>
        </div>
        <div>
          <span className="text-subtle">Limit: </span>
          <span className="text-white">{meta.limit}</span>
        </div>
      </div>
    </button>
  )
}

export default function MethodSelection({ account, mode, onSelectRail, onBack }) {
  const isDeposit = mode === 'deposit'

  // Rails available for this account
  const availableRails = account.rails || []

  // For IRA, show different set
  const depositRails = account.type === 'ira'
    ? ['wire', 'ira-transfer', 'rollover']
    : ['ach', 'wire', 'crypto']

  const allDepositRails = depositRails.map(r => ({
    rail: r,
    meta: RAIL_META[r],
    available: availableRails.includes(r),
  }))

  return (
    <div className="p-6 max-w-2xl">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        Back to Funding
      </button>

      {/* Account context */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-card border border-border rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
          {isDeposit
            ? <ArrowDownLeft size={16} className="text-primary" />
            : <ArrowUpRight size={16} className="text-warning" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">
            {isDeposit ? 'Deposit to' : 'Withdraw from'} {account.label}
          </div>
          <div className="text-xs text-muted">{account.number} · {account.cash} cash available</div>
        </div>
        <button className="text-xs text-primary hover:underline">Change account</button>
      </div>

      <h2 className="text-base font-semibold text-white mb-1">
        {isDeposit ? 'How would you like to fund?' : 'Choose withdrawal method'}
      </h2>
      <p className="text-sm text-muted mb-5">
        {isDeposit
          ? 'Select a rail to initiate the deposit.'
          : 'Withdrawals require PC approval before processing.'}
      </p>

      {isDeposit ? (
        <div className="space-y-3">
          {allDepositRails.map(({ rail, meta, available }) => (
            <RailCard
              key={rail}
              rail={rail}
              meta={meta}
              onSelect={onSelectRail}
              comingSoon={!available}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { rail: 'wire', meta: RAIL_META['wire'] },
          ].map(({ rail, meta }) => (
            <RailCard key={rail} rail={rail} meta={meta} onSelect={onSelectRail} />
          ))}
          <div className="mt-4 p-4 bg-surface border border-border rounded-xl">
            <div className="text-xs text-muted">
              Withdrawals are initiated by advisors and require PC in-app approval before funds are released.
              Funds will be sent to a verified trusted destination.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
