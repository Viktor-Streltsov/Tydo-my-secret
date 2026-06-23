import { useRef, useState } from 'react'
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

function toDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const blockKeys = (e: React.KeyboardEvent) => e.preventDefault()
const blockPaste = (e: React.ClipboardEvent) => e.preventDefault()

export default function ScreenDateTime({ place, onConfirm }: Props) {
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [dateError, setDateError] = useState('')
  const [timeError, setTimeError] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const maxDate = addDays(today, 365)

  const openDate = () => {
    dateRef.current?.focus()
    ;(dateRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
  }

  const openTime = () => {
    timeRef.current?.focus()
    ;(timeRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
  }

  const handleDateChange = (val: string) => {
    if (!val) return
    if (val < today) { setDateError('Дата не может быть в прошлом'); return }
    if (val > maxDate) { setDateError('Дата не может быть более чем через год'); return }
    setDate(val)
    setDateError('')
  }

  const handleConfirm = () => {
    let valid = true

    if (!date) {
      setDateError('Выберите дату встречи')
      valid = false
    } else if (date < today) {
      setDateError('Дата не может быть в прошлом')
      valid = false
    } else if (date > maxDate) {
      setDateError('Дата не может быть более чем через год')
      valid = false
    } else {
      setDateError('')
    }

    if (!time) {
      setTimeError('Выберите время встречи')
      valid = false
    } else {
      const [h, m] = time.split(':').map(Number)
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        setTimeError('Некорректное время')
        valid = false
      } else {
        setTimeError('')
      }
    }

    if (!valid) return
    onConfirm(toDisplayDate(date), time)
  }

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="glass rounded-3xl p-10 md:p-14 max-w-lg w-full shadow-2xl"
        variants={itemVariants}
      >
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
          Когда тебе будет удобно? ️️️️️️💗
        </motion.h2>

        <motion.p className="text-rose-400/70 text-sm mb-8" variants={itemVariants}>
          Место: <span className="font-semibold text-rose-500">{place}</span>
        </motion.p>

        <motion.div className="space-y-5" variants={itemVariants}>

          {/* ── Date picker ── */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              📅 Дата встречи
            </label>

            {/* Clickable display */}
            <div
              role="button"
              tabIndex={0}
              onClick={openDate}
              onKeyDown={e => e.key === 'Enter' && openDate()}
              className={`
                relative w-full glass rounded-xl px-4 py-3 flex items-center justify-between
                border transition-all cursor-pointer select-none
                ${dateError ? 'border-red-400/70' : 'border-rose-200/60'}
                hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50
              `}
            >
              <span className={`text-sm md:text-base font-medium ${date ? 'text-rose-700' : 'text-rose-300'}`}>
                {date ? toDisplayDate(date) : 'Выберите дату'}
              </span>
              <span className="text-rose-400 text-lg">📅</span>

              {/* Hidden native input — absorbs click, opens picker */}
              <input
                ref={dateRef}
                type="date"
                value={date}
                min={today}
                max={maxDate}
                tabIndex={-1}
                onChange={e => handleDateChange(e.target.value)}
                onKeyDown={blockKeys}
                onKeyUp={blockKeys}
                onKeyPress={blockKeys}
                onPaste={blockPaste}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {dateError && (
              <motion.p
                key={dateError}
                className="mt-1 text-xs text-red-400 font-medium"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠ {dateError}
              </motion.p>
            )}
          </div>

          {/* ── Time picker ── */}
          <div className="text-left">
            <label className="block text-rose-600 font-medium mb-2 text-sm">
              🕒 Время встречи
            </label>

            {/* Clickable display */}
            <div
              role="button"
              tabIndex={0}
              onClick={openTime}
              onKeyDown={e => e.key === 'Enter' && openTime()}
              className={`
                relative w-full glass rounded-xl px-4 py-3 flex items-center justify-between
                border transition-all cursor-pointer select-none
                ${timeError ? 'border-red-400/70' : 'border-rose-200/60'}
                hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50
              `}
            >
              <span className={`text-sm md:text-base font-medium ${time ? 'text-rose-700' : 'text-rose-300'}`}>
                {time || 'Выберите время'}
              </span>
              <span className="text-rose-400 text-lg">🕒</span>

              {/* Hidden native input */}
              <input
                ref={timeRef}
                type="time"
                value={time}
                tabIndex={-1}
                onChange={e => { setTime(e.target.value); setTimeError('') }}
                onKeyDown={blockKeys}
                onKeyUp={blockKeys}
                onKeyPress={blockKeys}
                onPaste={blockPaste}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {timeError && (
              <motion.p
                key={timeError}
                className="mt-1 text-xs text-red-400 font-medium"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠ {timeError}
              </motion.p>
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
      </motion.div>
    </motion.div>
  )
}
