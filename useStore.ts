import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStore } from '@/store/useStore'
import { api } from '@/api/client'
import { getTgUser } from '@/utils'
import BottomNav from '@/components/BottomNav'
import { Toast } from '@/components/ui'
import Dashboard from '@/pages/Dashboard'
import Sleep from '@/pages/Sleep'
import Mood from '@/pages/Mood'
import Nutrition from '@/pages/Nutrition'
import Habits from '@/pages/Habits'
import Profile from '@/pages/Profile'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function App() {
  const { currentPage, tgUser, setTgUser, toast } = useStore()

  // Telegram WebApp init
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready()
    tg?.expand()
    tg?.setHeaderColor?.('#f5f3ed')

    const user = getTgUser()
    if (user) {
      setTgUser(user)
      api.users.upsert({
        telegram_id: user.id,
        username: user.username,
        first_name: user.first_name,
      }).catch(console.warn)
    }
  }, [setTgUser])

  const pages = {
    dashboard: <Dashboard />,
    sleep: <Sleep />,
    mood: <Mood />,
    nutrition: <Nutrition />,
    habits: <Habits />,
    profile: <Profile />,
  }

  return (
    <div
      className="relative font-sans text-txt"
      style={{
        background: '#f5f3ed',
        minHeight: '100vh',
        maxWidth: '430px',
        margin: '0 auto',
        overflowX: 'hidden',
      }}
    >
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 pb-24 px-4">
        {pages[currentPage]}
      </main>

      <BottomNav />
      <Toast message={toast} />
    </div>
  )
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
