import { type ReactNode } from 'react'
import clsx from 'clsx'

// ── Card ──────────────────────────────────────────────
export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-card rounded-card shadow-card p-[18px] mb-[11px] relative overflow-hidden',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div className="font-serif text-sm font-semibold text-green-dark mb-[14px] flex items-center gap-[6px]">
      {children}
    </div>
  )
}

// ── AI Insight Card ───────────────────────────────────
export function AiCard({ label = '✦ AI-инсайт', children }: { label?: string; children: ReactNode }) {
  return (
    <div className="rounded-card p-[18px] mb-[11px] relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#2d4a2b 0%,#3d6b48 100%)' }}>
      <span className="absolute right-[14px] top-[14px] text-[32px] opacity-10">✦</span>
      <div className="text-[10px] uppercase tracking-[1.5px] text-olive font-semibold mb-[7px]">{label}</div>
      <p className="text-[13.5px] leading-[1.65] text-green-light">{children}</p>
    </div>
  )
}

// ── Button ────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'gold' | 'danger' | 'outline'

export function Btn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = true,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: 'sm' | 'md'
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}) {
  const base = 'flex items-center justify-center gap-2 font-sans font-semibold rounded-btn border-none cursor-pointer transition-all active:scale-[0.98] active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-green text-white',
    secondary: 'bg-bg-2 text-txt',
    gold: 'bg-gold text-[#2a2c28]',
    danger: 'bg-terra-light text-terra',
    outline: 'bg-transparent border-[1.5px] border-green text-green',
  }
  const sizes = { sm: 'px-[14px] py-[8px] text-[12.5px]', md: 'px-[14px] py-[14px] text-[14.5px]' }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {children}
    </button>
  )
}

// ── Slider ────────────────────────────────────────────
export function Slider({
  label, value, onChange, color, min = 1, max = 10,
}: {
  label: string; value: number; onChange: (v: number) => void; color: string; min?: number; max?: number
}) {
  return (
    <div className="mb-[18px]">
      <div className="flex justify-between items-center mb-[9px]">
        <span className="text-[13px] text-txt-2 font-medium">{label}</span>
        <span className="text-[14px] font-bold" style={{ color }}>{value}/{max}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: color }}
        className="w-full h-[5px] rounded-full bg-bg-2 outline-none appearance-none"
      />
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-[7px] bg-bg-2 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#4a7c59,#6aad7e)' }}
      />
    </div>
  )
}

// ── Stat Box ──────────────────────────────────────────
export function StatBox({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="bg-card rounded-[14px] p-[14px] shadow-card">
      <span className="text-[18px] mb-[6px] block">{icon}</span>
      <div className="font-serif text-[22px] font-bold text-green-dark leading-none">{value}</div>
      <div className="text-[11px] text-txt-2 mt-[3px]">{label}</div>
    </div>
  )
}

// ── Toast ────────────────────────────────────────────
export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={clsx(
        'fixed top-[18px] left-1/2 -translate-x-1/2 bg-green-dark text-white px-5 py-[11px] rounded-full text-[13px] font-medium z-50 whitespace-nowrap shadow-card-lg transition-all duration-300',
        message ? 'translate-y-0 opacity-100' : '-translate-y-[70px] opacity-0',
      )}
    >
      {message}
    </div>
  )
}

// ── Step Indicator ────────────────────────────────────
export function Steps({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-[5px] mb-[18px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'flex-1 h-[3px] rounded-full transition-colors duration-300',
            i < current ? 'bg-green' : 'bg-bg-2',
          )}
        />
      ))}
    </div>
  )
}

// ── Chip ─────────────────────────────────────────────
export function Chip({ children, variant = 'green' }: {
  children: ReactNode
  variant?: 'green' | 'gold' | 'blue' | 'terra'
}) {
  const variants = {
    green: 'bg-green-light text-green-dark',
    gold: 'bg-gold-light text-[#7a5200]',
    blue: 'bg-blue-light text-blue',
    terra: 'bg-terra-light text-terra',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1 px-[11px] py-[5px] rounded-full text-[12px] font-medium whitespace-nowrap', variants[variant])}>
      {children}
    </span>
  )
}
