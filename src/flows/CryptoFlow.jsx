import React, { useState } from 'react'
import { ChevronLeft, Cpu, Check, Copy, CheckCircle2, AlertTriangle } from 'lucide-react'

const STEPS = ['Select asset', 'Deposit address', 'Confirm', 'Tracking']

const ASSETS = [
  { id: 'btc', label: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', eta: '~30 min', confirmations: 3, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
  { id: 'eth', label: 'Ethereum', symbol: 'ETH', network: 'Ethereum', eta: '~5 min', confirmations: 12, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/25' },
  { id: 'usdc', label: 'USD Coin', symbol: 'USDC', network: 'Ethereum (ERC-20)', eta: '~5 min', confirmations: 12, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/25' },
  { id: 'sol', label: 'Solana', symbol: 'SOL', network: 'Solana', eta: '~1 min', confirmations: 32, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25' },
]

const MOCK_ADDRESSES = {
  btc: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  usdc: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  sol: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH',
}

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

function QRPlaceholder({ address }) {
  // Simple visual QR placeholder
  return (
    <div className="w-32 h-32 mx-auto rounded-xl bg-white p-2 flex items-center justify-center">
      <div className="w-full h-full grid grid-cols-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              backgroundColor: Math.sin(i * 17 + address.charCodeAt(i % address.length)) > 0
                ? '#000'
                : '#fff',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function CryptoFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const address = selectedAsset ? MOCK_ADDRESSES[selectedAsset.id] : ''

  const copyAddress = () => {
    navigator.clipboard.writeText(address).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      setConfirmed(false)
      setStep(3)
    }, 1000)
  }

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : 'Crypto Deposit'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Cpu size={15} className="text-violet-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Crypto Deposit</h2>
          <p className="text-xs text-muted">{account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Step 0: Select asset */}
      {step === 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-white mb-3">Select asset to deposit</div>
          {ASSETS.map(asset => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                selectedAsset?.id === asset.id
                  ? `border-violet-500/40 bg-violet-500/10`
                  : 'border-border bg-card hover:border-subtle'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${asset.bg} ${asset.border} border flex items-center justify-center text-sm font-bold ${asset.color}`}>
                {asset.symbol[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{asset.label}</div>
                <div className="text-xs text-muted">{asset.network} · {asset.eta} settlement</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAsset?.id === asset.id ? 'border-violet-400 bg-violet-400' : 'border-border'
              }`}>
                {selectedAsset?.id === asset.id && <Check size={10} className="text-white" />}
              </div>
            </button>
          ))}

          <button
            className="btn-primary w-full mt-2"
            disabled={!selectedAsset}
            onClick={() => setStep(1)}
          >
            Get deposit address
          </button>
        </div>
      )}

      {/* Step 1: Deposit address */}
      {step === 1 && selectedAsset && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-7 h-7 rounded-lg ${selectedAsset.bg} border ${selectedAsset.border} flex items-center justify-center text-xs font-bold ${selectedAsset.color}`}>
                {selectedAsset.symbol[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{selectedAsset.label} deposit address</div>
                <div className="text-xs text-muted">{selectedAsset.network}</div>
              </div>
            </div>

            <QRPlaceholder address={address} />

            <div className="mt-4 p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted mb-1.5">Deposit address</div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-white flex-1 break-all leading-relaxed">{address}</code>
                <button onClick={copyAddress} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-card text-subtle hover:text-primary transition-colors">
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-warning" />
              <span className="text-xs font-semibold text-warning">Before you send</span>
            </div>
            <ul className="text-xs text-warning/80 space-y-1 ml-4 list-disc">
              <li>Only send <span className="font-semibold">{selectedAsset.symbol}</span> on the <span className="font-semibold">{selectedAsset.network}</span> network to this address.</li>
              <li>Requires {selectedAsset.confirmations} network confirmations ({selectedAsset.eta}).</li>
              <li>Deposits below minimum threshold may be delayed for manual review.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>Back</button>
            <button className="btn-primary flex-1" onClick={() => setStep(2)}>I've sent the deposit</button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && selectedAsset && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Confirm deposit details</h3>
            {[
              ['Asset', selectedAsset.label + ' (' + selectedAsset.symbol + ')'],
              ['Network', selectedAsset.network],
              ['Destination', account.label + ' ' + account.number],
              ['Settlement', selectedAsset.eta],
              ['Confirmations required', selectedAsset.confirmations.toString()],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-border pb-3 last:pb-0 last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-surface border border-border rounded-xl text-xs text-muted">
            Once your transaction is detected on-chain, it will appear as "In Transit" in the activity feed. After the required confirmations, funds will be credited.
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleConfirm}
              disabled={confirmed}
            >
              {confirmed ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirming...
                </>
              ) : 'Confirm & track'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tracking */}
      {step === 3 && selectedAsset && (
        <div className="space-y-4">
          <div className="p-5 bg-violet-500/5 border border-violet-500/20 rounded-2xl text-center">
            <CheckCircle2 size={32} className="text-violet-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">Watching for {selectedAsset.symbol} deposit</div>
            <div className="text-xs text-muted">We'll notify you when the transaction is detected on-chain</div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-semibold text-white mb-4">Deposit status</div>
            {[
              { label: 'Address generated', sub: 'Ready to receive', done: true },
              { label: 'Transaction detected', sub: 'Watching mempool / on-chain', active: true },
              { label: 'Confirmations', sub: `0 / ${selectedAsset.confirmations} required`, done: false },
              { label: 'Funds credited', sub: 'Will appear in account balance', done: false },
              { label: 'Available to invest', sub: 'After compliance review', done: false },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.done ? 'bg-success/20 text-success' :
                    s.active ? 'bg-violet-500/20 text-violet-400' :
                    'bg-surface border border-border text-subtle'
                  }`}>
                    {s.done ? <Check size={10} /> :
                     s.active ? <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /> :
                     null}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-px mt-1 mb-1 ${s.done ? 'bg-success/30' : 'bg-border'}`} style={{height:20}} />
                  )}
                </div>
                <div className="pb-3">
                  <div className={`text-sm font-medium ${s.done ? 'text-white' : s.active ? 'text-violet-300' : 'text-subtle'}`}>{s.label}</div>
                  <div className="text-xs text-muted">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full" onClick={onDone}>
            Back to Funding
          </button>
        </div>
      )}
    </div>
  )
}
