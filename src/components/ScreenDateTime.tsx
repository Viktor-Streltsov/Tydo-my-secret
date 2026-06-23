import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  place: string
  onConfirm: (date: string, time: string) => void
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 85, damping: 14 },
  },
}

const inputClass = `
  glass rounded-xl px-3 py-3 text-rose-700 font-medium text-center
  border border-rose-200/60 focus:outline-none focus:ring-2
  focus:ring-rose-400/50 focus:border-rose-400 transition-all
  text-base w-full
`

const selectClass = `
  glass rounded-xl px-3 py-3 text-rose-700 font-medium text-center
  border border-rose-200/60 focus:outline-none focus:ring-2
  focus:ring-rose-400/50 focus:border-rose-400 transition-all
  text-base w-full bg-white/40 appearance-none cursor-pointer
`

export default function ScreenDateTime({ place, onConfirm }: Props) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [error, setError] = useState('')

  const handleHours = (val: string) => {
    if (val.length > 2) return
    if (val !== '' && !/^\d+$/.test(val)) return
    setHours(val)
    setError('')
  }

  const handleMinutes = (val: string) => {
    if (val.length > 2) return
    if (val !== '' && !/^\d+$/.test(val)) return
    setMinutes(val)
    setError('')
  }

  const handleBlurHours = () => {
    if (hours === '') return
    const n = parseInt(hours, 10)
    if (n < 1) setHours('1')
    else if (n > 24) setHours('24')
    else setHours(String(n))
  }

  const handleBlurMinutes = () => {
    if (minutes === '') return
    const n = parseInt(minutes, 10)
    if (n < 1) setMinutes('1')
    else if (n > 60) setMinutes('60')
    else setMinutes(String(n))
  }

  const handleDay = (val: string) => {
    if (val.length > 2) return
    if (val !== '' && !/^\d+$/.test(val)) return
    setDay(val)
    setError('')
  }

  const handleBlurDay = () => {
    if (day === '') return
    const n = parseInt(day, 10)
    if (n < 1) setDay('1')
    else if (n > 31) setDay('31')
    else setDay(String(n))
  }

  const handleConfirm = () => {
    const hasDate = day !== '' || month !== ''
    const hasTime = hours !== '' || minutes !== ''

    if (hasDate) {
      const d = parseInt(day, 10)
      if (!day || isNaN(d) || d < 1 || d > 31) { setError('Введи день от 1 до 31'); return }
      if (!month) { setError('Выбери месяц'); return }
    }

    if (hasTime) {
      const h = parseInt(hours, 10)
      const m = parseInt(minutes, 10)
      if (!hours || isNaN(h) || h < 1 || h > 24) { setError('Часы: от 1 до 24'); return }
      if (!minutes || isNaN(m) || m < 1 || m > 60) { setError('Минуты: от 1 до 60'); return }
    }

    setError('')

    const dateStr = hasDate
      ? `${day.padStart(2, '0')}.${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}`
      : ''
    const timeStr = hasTime
      ? `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
      : ''

    onConfirm(dateStr, timeStr)
  }

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="glass rounded-3xl p-10 md:p-14 max-w-lg w-full shadow-2xl" variants={itemVariants}>
        <motion.div
          className="text-5xl mb-5"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🗓️
        </motion.div>

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gradient mb-2"
          variants={itemVariants}
        >
          Когда тебе будет удобно? 🥰
        </motion.h2>

        <motion.p className="text-rose-400/70 text-sm mb-8" variants={itemVariants}>
          Место: <span className="font-semibold text-rose-500">{place}</span>
        </motion.p>

        <motion.div className="space-y-5" variants={itemVariants}>
          {/* Date — day + month */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              📅 Дата встречи
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="ДД"
                value={day}
                onChange={e => handleDay(e.target.value)}
                onBlur={handleBlurDay}
                maxLength={2}
                className={inputClass}
              />
              <select
                value={month}
                onChange={e => { setMonth(e.target.value); setError('') }}
                className={selectClass}
              >
                <option value="">Месяц</option>
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time — hours + minutes */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              🕒 Время встречи
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="ЧЧ"
                value={hours}
                maxLength={2}
                onChange={e => handleHours(e.target.value)}
                onBlur={handleBlurHours}
                className={inputClass}
              />
              <span className="text-rose-400 font-bold text-xl flex-shrink-0">:</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="ММ"
                value={minutes}
                maxLength={2}
                onChange={e => handleMinutes(e.target.value)}
                onBlur={handleBlurMinutes}
                className={inputClass}
              />
            </div>
            <p className="mt-1 text-xs text-rose-300/70">часы 1–24 · минуты 1–60</p>
          </div>

          {error && (
            <motion.p
              className="text-sm text-red-400 font-medium"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <motion.button
          onClick={handleConfirm}
          className="mt-8 w-full shimmer-btn text-white font-semibold text-lg py-4 rounded-2xl shadow-lg shadow-rose-300/50"
          variants={itemVariants}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(244,63,94,0.4)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        >
          Подтвердить ✨
        </motion.button>

        <motion.p className="mt-4 text-xs text-rose-300/60 italic" variants={itemVariants}>
          Можно пропустить — нажми «Подтвердить» без выбора
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
