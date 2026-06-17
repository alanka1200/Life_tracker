import clsx from 'clsx'
import { useStore } from '@/store/useStore'
import type { Page } from '@/types'

const TABS: { id: Page; icon: string; label: string }[] = [
  { id: 'dashboard',  icon: '🏠', label: 'Главная' },
  { id: 'sleep',      icon: '🌙', label: 'Сон' },
  { id: 'mood',       icon: '🌸', label: 'Настрой' },
  { id: 'nutrition',  icon: '🥗', label: 'Еда' },
  { id: 'habits',     icon: '🌱', label: 'Цели' },
  { id: 'profile',    icon: '👤', label: 'Профиль' },
]

export default function BottomNav() {
  const { currentPage, setPage } = useStore()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex"
      style={{
        background: 'rgba(245,243,237,0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '1px solid #ddd9ce',
        padding: '7px 0 20px',
        zIndex: 100,
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setPage(tab.id)}
          className={clsx(
            'flex-1 flex flex-col items-center gap-[2px] bg-transparent border-none cursor-pointer py-[5px]',
            'font-sans transition-colors duration-150',
            currentPage === tab.id ? 'text-green' : 'text-txt-3',
          )}
        >
          <span className="text-[19px]">{tab.icon}</span>
          <span className="text-[9.5px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
