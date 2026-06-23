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
  const [time, setTime] = useState('')

  const handleConfirm = () => {
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
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="
                w-full glass rounded-xl px-4 py-3 text-rose-700 font-medium
                border border-rose-200/60 focus:outline-none focus:ring-2
                focus:ring-rose-400/50 focus:border-rose-400 transition-all
                text-sm md:text-base
              "
            />
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
