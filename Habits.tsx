import { create } from 'zustand'
import type { Page, MoodDraft, Habit, Goal, Meal, TelegramUser } from '@/types'

interface AppState {
  // ── Navigation ──────────────────────────────────────
  currentPage: Page
  setPage: (page: Page) => void

  // ── Telegram user ────────────────────────────────────
  tgUser: TelegramUser | null
  setTgUser: (user: TelegramUser | null) => void

  // ── Mood draft (multi-step form) ─────────────────────
  moodDraft: MoodDraft
  setMoodDraft: (draft: Partial<MoodDraft>) => void
  resetMoodDraft: () => void

  // ── Local habits (optimistic updates) ────────────────
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  toggleHabitLocal: (id: number) => void

  // ── Local goals ──────────────────────────────────────
  goals: Goal[]
  setGoals: (goals: Goal[]) => void

  // ── Local meals ──────────────────────────────────────
  meals: Meal[]
  setMeals: (meals: Meal[]) => void
  totalKcal: number
  setTotalKcal: (kcal: number) => void

  // ── UI ───────────────────────────────────────────────
  toast: string | null
  showToast: (msg: string) => void
}

const DEFAULT_MOOD: MoodDraft = { val: 5, energy: 5, anxiety: 3, note: '' }

export const useStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),

  tgUser: null,
  setTgUser: (user) => set({ tgUser: user }),

  moodDraft: DEFAULT_MOOD,
  setMoodDraft: (draft) =>
    set((s) => ({ moodDraft: { ...s.moodDraft, ...draft } })),
  resetMoodDraft: () => set({ moodDraft: DEFAULT_MOOD }),

  habits: [],
  setHabits: (habits) => set({ habits }),
  toggleHabitLocal: (id) =>
    set((s) => ({
      habits: s.habits.map((h) =>
        h.id === id
          ? {
              ...h,
              completed_today: !h.completed_today,
              streak: !h.completed_today ? h.streak + 1 : Math.max(0, h.streak - 1),
            }
          : h,
      ),
    })),

  goals: [],
  setGoals: (goals) => set({ goals }),

  meals: [],
  setMeals: (meals) => set({ meals }),
  totalKcal: 0,
  setTotalKcal: (kcal) => set({ totalKcal: kcal }),

  toast: null,
  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: null }), 2500)
  },
}))
