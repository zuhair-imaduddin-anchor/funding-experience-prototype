import React, { useState } from 'react'
import Layout from './components/Layout'
import FundingHub from './components/FundingHub'
import MethodSelection from './components/MethodSelection'
import WireFlow from './flows/WireFlow'
import ACHFlow from './flows/ACHFlow'
import CryptoFlow from './flows/CryptoFlow'
import WithdrawalFlow from './flows/WithdrawalFlow'
import RolloverFlow from './flows/RolloverFlow'
import IRATransferFlow from './flows/IRATransferFlow'
import { transactions } from './data/mockData'

// Route state machine
// hub → method-select → [wire|ach|crypto|withdrawal|rollover|ira-transfer]

export default function App() {
  const [route, setRoute] = useState('hub')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [mode, setMode] = useState('deposit') // 'deposit' | 'withdraw'
  const [selectedRail, setSelectedRail] = useState(null)

  const goToHub = () => {
    setRoute('hub')
    setSelectedAccount(null)
    setSelectedRail(null)
    setMode('deposit')
  }

  const handleStartFunding = (account, fundMode = 'deposit') => {
    setSelectedAccount(account)
    setMode(fundMode)
    setRoute('method-select')
  }

  const handleViewAccount = (account) => {
    setSelectedAccount(account)
    setRoute('account-detail')
  }

  const handleSelectRail = (rail) => {
    setSelectedRail(rail)
    setRoute('flow')
  }

  const renderFlow = () => {
    const props = { account: selectedAccount, onBack: () => setRoute('method-select'), onDone: goToHub }

    if (mode === 'withdraw') return <WithdrawalFlow {...props} />

    switch (selectedRail) {
      case 'wire': return <WireFlow {...props} />
      case 'ach': return <ACHFlow {...props} />
      case 'crypto': return <CryptoFlow {...props} />
      case 'rollover': return <RolloverFlow {...props} />
      case 'ira-transfer': return <IRATransferFlow {...props} />
      default: return <WireFlow {...props} />
    }
  }

  return (
    <Layout activePage="Funding">
      {route === 'hub' && (
        <FundingHub
          onStartFunding={handleStartFunding}
          onViewAccount={handleViewAccount}
        />
      )}

      {route === 'account-detail' && selectedAccount && (
        <AccountDetail
          account={selectedAccount}
          onDeposit={() => handleStartFunding(selectedAccount, 'deposit')}
          onWithdraw={() => handleStartFunding(selectedAccount, 'withdraw')}
          onBack={goToHub}
        />
      )}

      {route === 'method-select' && selectedAccount && (
        <MethodSelection
          account={selectedAccount}
          mode={mode}
          onSelectRail={handleSelectRail}
          onBack={goToHub}
        />
      )}

      {route === 'flow' && selectedAccount && renderFlow()}
    </Layout>
  )
}

function AccountDetail({ account, onDeposit, onWithdraw, onBack }) {
  const accountTxs = transactions.filter(t => t.accountId === account.id)

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Funding
      </button>

      <div className="card p-5 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-white mb-1">{account.label}</div>
            <div className="text-sm text-muted">{account.number}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{account.balance}</div>
            <div className="text-sm text-muted">{account.cash} cash available</div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onDeposit} className="flex-1 btn-primary flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            Deposit
          </button>
          <button onClick={onWithdraw} className="flex-1 btn-ghost flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            Withdraw
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-white mb-4">Funding Activity</div>
        {accountTxs.length === 0 ? (
          <div className="text-sm text-muted text-center py-8">No funding activity yet</div>
        ) : accountTxs.map(tx => (
          <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <div className="text-sm font-medium text-white">{tx.description}</div>
              <div className="text-xs text-muted mt-0.5">{new Date(tx.initiatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-white'}`}>
                {tx.type === 'deposit' ? '+' : '−'}{tx.amount}
              </div>
              <div className={`text-xs mt-0.5 ${tx.status === 'completed' ? 'text-success' : tx.status === 'awaiting-approval' ? 'text-primary' : 'text-amber-400'}`}>
                {tx.stage || tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
