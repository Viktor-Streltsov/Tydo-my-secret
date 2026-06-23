import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  place: string
  onConfirm: (date: string, time: string) => void
}

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

export default function ScreenDateTime({ place, onConfirm }: Props) {
  const [date, setDate] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [timeError, setTimeError] = useState('')

  const clampHours = (val: string) => {
    if (val === '') return ''
    const n = Math.min(23, Math.max(0, parseInt(val, 10)))
    return String(n)
  }

  const clampMinutes = (val: string) => {
    if (val === '') return ''
    const n = Math.min(59, Math.max(0, parseInt(val, 10)))
    return String(n)
  }

  const handleConfirm = () => {
    const h = parseInt(hours, 10)
    const m = parseInt(minutes, 10)

    if (hours !== '' || minutes !== '') {
      if (isNaN(h) || h < 0 || h > 23) { setTimeError('Часы: от 0 до 23'); return }
      if (isNaN(m) || m < 0 || m > 59) { setTimeError('Минуты: от 0 до 59'); return }
    }

    setTimeError('')
    const time = hours !== '' ? `${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}` : ''
    onConfirm(date, time)
  }

  const today = new Date().toISOString().split('T')[0]

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
          {/* Date picker */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              📅 Дата встречи
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className="
                w-full glass rounded-xl px-4 py-3 text-rose-700 font-medium
                border border-rose-200/60 focus:outline-none focus:ring-2
                focus:ring-rose-400/50 focus:border-rose-400 transition-all
                placeholder-rose-300 text-sm md:text-base
              "
            />
          </div>

          {/* Time picker */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              🕒 Время встречи
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="ЧЧ"
                value={hours}
                min={0}
                max={23}
                onChange={e => { setHours(e.target.value); setTimeError('') }}
                onBlur={e => setHours(clampHours(e.target.value))}
                className="
                  w-full glass rounded-xl px-4 py-3 text-rose-700 font-medium text-center
                  border border-rose-200/60 focus:outline-none focus:ring-2
                  focus:ring-rose-400/50 focus:border-rose-400 transition-all
                  text-sm md:text-base
                "
              />
              <span className="text-rose-400 font-bold text-xl">:</span>
              <input
                type="number"
                placeholder="ММ"
                value={minutes}
                min={0}
                max={59}
                onChange={e => { setMinutes(e.target.value); setTimeError('') }}
                onBlur={e => setMinutes(clampMinutes(e.target.value))}
                className="
                  w-full glass rounded-xl px-4 py-3 text-rose-700 font-medium text-center
                  border border-rose-200/60 focus:outline-none focus:ring-2
                  focus:ring-rose-400/50 focus:border-rose-400 transition-all
                  text-sm md:text-base
                "
              />
            </div>
            {timeError && (
              <p className="mt-1 text-xs text-red-400">{timeError}</p>
            )}
          </div>
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
