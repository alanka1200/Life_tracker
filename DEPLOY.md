import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/store/useStore'
import { api } from '@/api/client'
import { AiCard, Card, CardTitle, Btn, Slider } from '@/components/ui'
import { calcSleepDuration, formatDuration, getDayLabel, getWeekDays } from '@/utils'

const MOCK_SLEEP_WEEK = [6.5, 7.2, 5.8, 8.1, 7.0, 9.0, 7.5]

function getSleepAI(hours: number, quality: number, note: string): string {
  let text = ''
  if (hours < 6)
    text = `Меньше 6 часов — недосып. В такие дни энергия и настроение падают на 25-35%. Ложись на 30-40 минут раньше завтра.`
  else if (hours < 7)
    text = `6-7 часов — граница нормы. Ещё 30 минут добавят заметную разницу в энергии.`
  else
    text = `${hours.toFixed(1)} часов — отлично! Обычно в такие дни выполняется на 40% больше привычек.`
  if (quality <= 4) text += ' Качество сна низкое — попробуй лечь раньше или убрать телефон за час до сна.'
  if (note) text += ' Заметка учтена — помогает видеть паттерны.'
  return text
}

export default function Sleep() {
  const { tgUser, showToast } = useStore()
  const userId = tgUser?.id
  const qc = useQueryClient()

  const [start, setStart] = useState('23:00')
  const [end, setEnd] = useState('07:00')
  const [quality, setQuality] = useState(7)
  const [note, setNote] = useState('')
  const [aiText, setAiText] = useState('Отметь сон — и я покажу паттерны и рекомендации.')

  const duration = calcSleepDuration(start, end)

  const { data: todaySleep } = useQuery({
    queryKey: ['sleep-today', userId],
    queryFn: () => api.sleep.today(userId!),
    enabled: !!userId,
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      api.sleep.save({ user_id: userId!, sleep_start: start, sleep_end: end, duration_h: duration, quality, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sleep-today', userId] })
      qc.invalidateQueries({ queryKey: ['today', userId] })
      setAiText(getSleepAI(duration, quality, note))
      showToast('🌙 Сон записан!')
    },
  })

  const days = getWeekDays()

  return (
    <div className="pt-[22px] page-enter">
      <div className="flex items-end justify-between mb-[14px]">
        <div>
          <div className="text-[12px] text-txt-2">Sleep Tracker + AI анализ</div>
          <h1 className="font-serif text-[25px] font-bold text-green-dark mt-[3px]">Сон 🌙</h1>
        </div>
        <span className="inline-flex items-center px-[11px] py-[5px] rounded-full bg-blue-light text-blue text-[12px] font-medium">
          {formatDuration(duration)}
        </span>
      </div>

      <AiCard label="✦ AI-паттерн">{aiText}</AiCard>

      {/* Sleep form */}
      <Card>
        <span className="absolute right-[-8px] top-[-8px] text-[56px] opacity-[0.07] rotate-[18deg] pointer-events-none">🍃</span>
        <CardTitle>🌙 Запись сна</CardTitle>

        <div className="flex gap-[10px] mb-[16px]">
          {[
            { label: 'Лёг спать', val: start, set: setStart },
            { label: 'Проснулся', val: end, set: setEnd },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex-1 bg-bg-2 rounded-[13px] p-[13px] text-center border-2 border-transparent">
              <label className="text-[11px] text-txt-2 block mb-[5px]">{label}</label>
              <input
                type="time"
                value={val}
                onChange={e => set(e.target.value)}
                className="text-[19px] w-full"
              />
            </div>
          ))}
        </div>

        <Slider label="Качество сна" value={quality} onChange={setQuality} color="var(--green)" />

        <div className="mb-[14px]">
          <div className="text-[12px] text-txt-2 mb-[8px] font-medium">📝 Заметка (необязательно)</div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Что мешало уснуть? Снились сны? Просыпался ночью?..."
            className="w-full bg-bg-2 border-[1.5px] border-transparent focus:border-green focus:bg-white rounded-[11px] p-[12px] text-[13px] text-txt outline-none resize-none transition-colors"
          />
        </div>

        <Btn onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? '⏳ Сохраняю...' : '🌙 Сохранить'}
        </Btn>
      </Card>

      {/* Today recorded */}
      {todaySleep && (
        <Card>
          <CardTitle>✓ Сегодня записано</CardTitle>
          <div className="grid grid-cols-2 gap-[9px]">
            {[
              { label: 'Длительность', val: formatDuration(todaySleep.duration_h) },
              { label: 'Качество', val: `${todaySleep.quality}/10` },
              { label: 'Отбой', val: todaySleep.sleep_start },
              { label: 'Подъём', val: todaySleep.sleep_end },
            ].map(({ label, val }) => (
              <div key={label} className="bg-bg-2 rounded-[11px] p-[12px]">
                <div className="text-[11px] text-txt-2 mb-[3px]">{label}</div>
                <div className="font-serif text-[18px] font-bold text-green-dark">{val}</div>
              </div>
            ))}
          </div>
          {todaySleep.note && (
            <div className="mt-[11px] p-[11px] bg-green-xs rounded-[10px] text-[13px] text-txt-2">
              📝 {todaySleep.note}
            </div>
          )}
        </Card>
      )}

      {/* Week chart */}
      <Card>
        <CardTitle>📊 Последние 7 дней</CardTitle>
        <div className="flex gap-[5px] items-end h-[72px]">
          {days.map((day, i) => {
            const h = MOCK_SLEEP_WEEK[i] ?? 0
            const pct = Math.round((h / 11) * 100)
            const good = h >= 7
            return (
              <div key={day} className="flex flex-col items-center gap-[4px] flex-1">
                <div
                  className="w-full rounded-t-[5px] min-h-[3px] transition-all duration-500"
                  style={{ height: `${pct}%`, background: good ? '#4a7c59' : '#d4e8da' }}
                />
                <span className={`text-[10px] ${i === 6 ? 'text-green font-bold' : 'text-txt-3'}`}>
                  {getDayLabel(day)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
