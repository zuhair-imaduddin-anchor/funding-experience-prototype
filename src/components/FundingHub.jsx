import React, { useState } from 'react'
import { Plus, ArrowUpRight, ArrowDownLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { accounts, transactions, clients, STATUS_META, RAIL_META } from '../data/mockData'

function StatusBadge({ status, stage }) {
  const meta = STATUS_META[status] || STATUS_META.pending
  return (
    <span className={`badge ${meta.bg} ${meta.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {stage || meta.label}
    </span>
  )
}

function RailTag({ rail }) {
  const meta = RAIL_META[rail]
  if (!meta) return null
  return (
    <span className={`badge ${meta.bg} border ${meta.border} ${meta.color} text-[11px]`}>
      {meta.label}
    </span>
  )
}

function AccountCard({ account, onSelect, onFund }) {
  const client = clients.find(c => c.id === account.clientId)
  const accountTxs = transactions.filter(t => t.accountId === account.id)
  const pending = accountTxs.filter(t => t.status !== 'completed')
  const awaitingApproval = accountTxs.filter(t => t.status === 'awaiting-approval')

  return (
    <div className="card p-5 hover:border-subtle transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">{account.label}</span>
            <span className="text-xs text-subtle">{account.number}</span>
          </div>
          <div className="text-xs text-muted">{client?.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-white">{account.balance}</div>
          <div className="text-xs text-muted">{account.cash} cash</div>
        </div>
      </div>

      {/* Pending items */}
      {pending.length > 0 && (
        <div className="mb-4 space-y-2">
          {pending.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2 px-3 bg-surface rounded-xl">
              <div className="flex items-center gap-2.5">
                {tx.type === 'deposit'
                  ? <ArrowDownLeft size={14} className="text-success" />
                  : <ArrowUpRight size={14} className="text-warning" />}
                <div>
                  <div className="text-xs font-medium text-white">{tx.description}</div>
                  <div className="text-[11px] text-muted">{tx.amount}</div>
                </div>
              </div>
              <StatusBadge status={tx.status} stage={tx.stage} />
            </div>
          ))}
        </div>
      )}

      {awaitingApproval.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2">
          <AlertCircle size={13} className="text-primary flex-shrink-0" />
          <span className="text-xs text-primary">{awaitingApproval.length} action{awaitingApproval.length > 1 ? 's' : ''} awaiting PC approval</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onFund(account)}
          className="flex-1 btn-primary text-center"
        >
          + Fund
        </button>
        <button
          onClick={() => onSelect(account)}
          className="btn-ghost flex items-center gap-1.5"
        >
          View <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

function TransactionRow({ tx }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          tx.type === 'deposit' ? 'bg-success/10' : 'bg-warning/10'
        }`}>
          {tx.type === 'deposit'
            ? <ArrowDownLeft size={14} className="text-success" />
            : <ArrowUpRight size={14} className="text-warning" />}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{tx.description}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted">{tx.initiatedBy}</span>
            <span className="text-subtle">·</span>
            <span className="text-xs text-muted">{new Date(tx.initiatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <RailTag rail={tx.rail} />
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-white'}`}>
          {tx.type === 'deposit' ? '+' : '−'}{tx.amount}
        </div>
        <StatusBadge status={tx.status} stage={tx.stage} />
      </div>
    </div>
  )
}

export default function FundingHub({ onStartFunding, onViewAccount }) {
  const [activeClient, setActiveClient] = useState('c1')
  const clientAccounts = accounts.filter(a => a.clientId === activeClient)
  const allTxs = transactions.filter(t => clientAccounts.some(a => a.id === t.accountId))

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Funding</h1>
          <p className="text-sm text-muted mt-0.5">Manage deposits, withdrawals and transfers</p>
        </div>
        <div className="flex items-center gap-2">
          {clients.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveClient(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeClient === c.id
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'bg-surface border-border text-muted hover:text-white hover:bg-card'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeClient === c.id ? 'bg-primary/30 text-primary' : 'bg-subtle/30 text-muted'
              }`}>
                {c.initials}
              </div>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total AUM', value: clients.find(c => c.id === activeClient)?.aum, sub: 'across all accounts' },
          { label: 'Available Cash', value: '$70,400', sub: 'ready to invest' },
          { label: 'In Transit', value: '$205,000', sub: '2 pending movements', accent: 'text-amber-400' },
          { label: 'Awaiting Approval', value: '1 action', sub: 'PC review required', accent: 'text-primary' },
        ].map(item => (
          <div key={item.label} className="card p-4">
            <div className="text-xs text-muted mb-1">{item.label}</div>
            <div className={`text-lg font-semibold ${item.accent || 'text-white'}`}>{item.value}</div>
            <div className="text-[11px] text-subtle mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {clientAccounts.map(acc => (
          <AccountCard
            key={acc.id}
            account={acc}
            onFund={(acc) => onStartFunding(acc)}
            onSelect={(acc) => onViewAccount(acc)}
          />
        ))}
      </div>

      {/* Activity */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <button className="text-xs text-primary hover:text-primary-hover">View all</button>
        </div>
        {allTxs.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
      </div>
    </div>
  )
}
