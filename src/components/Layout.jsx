import React from 'react'
import { LayoutGrid, Users, TrendingUp, FileText, Settings, Bell, ChevronDown, Wallet, Shield } from 'lucide-react'

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', active: false },
  { icon: Users, label: 'Clients', active: false },
  { icon: Wallet, label: 'Funding', active: true },
  { icon: TrendingUp, label: 'Portfolio', active: false },
  { icon: FileText, label: 'Reports', active: false },
]

export default function Layout({ children, activePage = 'Funding' }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-border bg-surface">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield size={15} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-none">Anchorage</div>
              <div className="text-[10px] text-muted mt-0.5 font-medium tracking-wide uppercase">Digital Wealth</div>
            </div>
          </div>
        </div>

        {/* Advisor */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-card cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">SC</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Sarah Chen</div>
              <div className="text-[10px] text-muted">Advisor</div>
            </div>
            <ChevronDown size={12} className="text-subtle" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                label === activePage
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted hover:text-white hover:bg-card'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-card transition-all">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-border bg-surface">
          <div className="text-sm font-semibold text-white">{activePage}</div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-card text-muted hover:text-white transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">SC</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
