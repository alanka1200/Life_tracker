// ── Telegram ──────────────────────────────────────────
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        initDataUnsafe: { user?: TelegramUser; start_param?: string }
        initData: string
        setHeaderColor: (color: string) => void
        close: () => void
      }
    }
  }
}

// ── API Response types ─────────────────────────────────
export interface User {
  id: number
  username: string | null
  first_name: string
  bio: string
  referral_code: string
  subscription: 'free' | 'base' | 'pro'
  sub_expires_at: string | null
  created_at: string
}

export interface SleepEntry {
  id: number
  user_id: number
  sleep_start: string
  sleep_end: string
  duration_h: number
  quality: number
  note: string
  entry_date: string
  created_at: string
}

export interface MoodEntry {
  id: number
  user_id: number
  mood: number
  energy: number
  anxiety: number
  note: string
  period: 'morning' | 'evening'
  entry_date: string
  created_at: string
}

export interface Meal {
  id: number
  user_id: number
  name: string
  kcal: number
  protein_g: number
  fat_g: number
  carb_g: number
  ai_comment: string
  entry_date: string
  created_at: string
}

export interface MealTotals {
  kcal: number
  prot: number
  fat: number
  carb: number
}

export interface Habit {
  id: number
  user_id: number
  name: string
  emoji: string
  is_active: boolean
  completed_today: boolean
  streak: number
  created_at: string
}

export interface Goal {
  id: number
  user_id: number
  title: string
  description: string
  target_date: string | null
  progress: number
  is_done: boolean
  created_at: string
}

export interface FoodAnalysis {
  name: string
  kcal: number
  protein_g: number
  fat_g: number
  carb_g: number
  comment: string
}

export interface TodaySummary {
  sleep: Pick<SleepEntry, 'duration_h' | 'quality'> | null
  mood: Pick<MoodEntry, 'mood' | 'energy' | 'anxiety'> | null
  habits: { done: number; total: number }
  kcal: number
}

export interface WeekStats {
  mood: Array<{ entry_date: string; am: number; ae: number }>
  sleep: Array<{ entry_date: string; ah: number }>
  habits: Array<{ entry_date: string; cnt: number }>
}

export interface ReferralInfo {
  referral_code: string
  bot_link: string
  invited_count: number
  next_bonus_at: number
}

// ── App state ─────────────────────────────────────────
export type Page = 'dashboard' | 'sleep' | 'mood' | 'nutrition' | 'habits' | 'profile'

export interface MoodDraft {
  val: number
  energy: number
  anxiety: number
  note: string
}
