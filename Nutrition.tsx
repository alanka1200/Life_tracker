import type {
  User, SleepEntry, MoodEntry, Meal, MealTotals,
  Habit, Goal, FoodAnalysis, TodaySummary,
  WeekStats, ReferralInfo,
} from '@/types'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Telegram initData для авторизации
function getTgInitData(): string {
  return window.Telegram?.WebApp?.initData || ''
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getTgInitData(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

const get = <T>(path: string) => request<T>('GET', path)
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body)
const patch = <T>(path: string, body: unknown) => request<T>('PATCH', path, body)
const del = <T>(path: string) => request<T>('DELETE', path)

// ── Users ──────────────────────────────────────────────
export const api = {
  users: {
    upsert: (data: { telegram_id: number; username?: string; first_name?: string }) =>
      post<User>('/users/upsert', data),
    get: (id: number) => get<User>(`/users/${id}`),
    updateBio: (id: number, bio: string) => patch<{ ok: boolean }>(`/users/${id}/bio`, { bio }),
  },

  // ── Sleep ────────────────────────────────────────────
  sleep: {
    save: (data: {
      user_id: number; sleep_start: string; sleep_end: string
      duration_h: number; quality: number; note?: string
    }) => post<{ id: number; ok: boolean }>('/sleep', data),
    list: (userId: number, days = 7) =>
      get<SleepEntry[]>(`/sleep/${userId}?days=${days}`),
    today: (userId: number) =>
      get<SleepEntry | null>(`/sleep/${userId}/today`),
  },

  // ── Mood ─────────────────────────────────────────────
  mood: {
    save: (data: {
      user_id: number; mood: number; energy: number; anxiety: number
      note?: string; period: 'morning' | 'evening'
    }) => post<{ id: number; ok: boolean }>('/mood', data),
    list: (userId: number, days = 7) =>
      get<MoodEntry[]>(`/mood/${userId}?days=${days}`),
    today: (userId: number) =>
      get<MoodEntry | null>(`/mood/${userId}/today`),
  },

  // ── Nutrition ────────────────────────────────────────
  nutrition: {
    analyzePhoto: (data: { user_id: number; image_b64: string; image_type?: string }) =>
      post<FoodAnalysis>('/ai/analyze-food', data),
    saveMeal: (data: {
      user_id: number; name: string; kcal: number
      protein_g: number; fat_g: number; carb_g: number; ai_comment?: string
    }) => post<{ id: number; ok: boolean }>('/meals', data),
    todayMeals: (userId: number) =>
      get<{ meals: Meal[]; totals: MealTotals }>(`/meals/${userId}/today`),
  },

  // ── Habits ───────────────────────────────────────────
  habits: {
    list: (userId: number) => get<Habit[]>(`/habits/${userId}`),
    create: (data: { user_id: number; name: string; emoji?: string }) =>
      post<{ id: number; ok: boolean }>('/habits', data),
    toggle: (data: { habit_id: number; user_id: number }) =>
      post<{ completed: boolean }>('/habits/toggle', data),
    delete: (habitId: number) =>
      del<{ ok: boolean }>(`/habits/${habitId}`),
  },

  // ── Goals ────────────────────────────────────────────
  goals: {
    list: (userId: number) => get<Goal[]>(`/goals/${userId}`),
    create: (data: { user_id: number; title: string; description?: string; target_date?: string }) =>
      post<{ id: number; ok: boolean }>('/goals', data),
    updateProgress: (goalId: number, progress: number) =>
      patch<{ ok: boolean }>(`/goals/${goalId}/progress`, { goal_id: goalId, progress }),
  },

  // ── Stats / Dashboard ────────────────────────────────
  stats: {
    today: (userId: number) => get<TodaySummary>(`/stats/${userId}/today`),
    week: (userId: number) => get<WeekStats>(`/stats/${userId}/week`),
  },

  // ── AI Reports ───────────────────────────────────────
  ai: {
    weeklyInsight: (userId: number) =>
      get<{ text: string; cached: boolean }>(`/ai/weekly-insight/${userId}`),
  },

  // ── PDF ──────────────────────────────────────────────
  reports: {
    monthlyPdf: (userId: number) =>
      `${BASE}/report/${userId}/monthly.pdf`,
  },

  // ── Referral ─────────────────────────────────────────
  referral: {
    get: (userId: number) => get<ReferralInfo>(`/referral/${userId}`),
    use: (data: { user_id: number; ref_code: string }) =>
      post<{ ok: boolean }>('/referral/use', data),
  },

  // ── Health ───────────────────────────────────────────
  health: () => get<{ status: string }>('/health'),
}
