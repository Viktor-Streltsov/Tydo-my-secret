import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingHearts from './components/FloatingHearts'
import ScreenQuestion from './components/ScreenQuestion'
import ScreenPlace from './components/ScreenPlace'
import ScreenDateTime from './components/ScreenDateTime'
import ScreenFinal from './components/ScreenFinal'

const TG_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TG_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

async function notifyMe(place: string, date: string, time: string) {
  if (!TG_TOKEN || !TG_CHAT_ID) return
  const text =
    `💌 Она согласилась!\n\n` +
    `📍 Место: ${place}\n` +
    `📅 Дата: ${date || '—'}\n` +
    `🕒 Время: ${time || '—'}`
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
    })
  } catch {
    // silent fail — девушка не должна видеть ошибку
  }
}

type Screen = 'question' | 'place' | 'datetime' | 'final'

const pageVariants = {
  initial: { opacity: 0, scale: 0.96, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 14 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -20,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('question')
  const [selectedPlace, setSelectedPlace] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const handleYes = () => setScreen('place')

  const handlePlaceSelect = (place: string) => {
    setSelectedPlace(place)
    setScreen('datetime')
  }

  const handleConfirmDateTime = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setScreen('final')
    notifyMe(selectedPlace, date, time)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 20%, #f3e8ff 50%, #ede9fe 70%, #fdf4ff 100%)',
        }}
      />

      {/* Decorative orbs */}
      <motion.div
        className="fixed top-[-10%] left-[-5%] w-72 h-72 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed bottom-[-10%] right-[-5%] w-96 h-96 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="fixed top-[40%] right-[10%] w-56 h-56 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <FloatingHearts />

      {/* Screen transitions */}
      <AnimatePresence mode="wait">
        {screen === 'question' && (
          <motion.div key="question" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ScreenQuestion onYes={handleYes} />
          </motion.div>
        )}

        {screen === 'place' && (
          <motion.div key="place" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ScreenPlace onSelect={handlePlaceSelect} />
          </motion.div>
        )}

        {screen === 'datetime' && (
          <motion.div key="datetime" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ScreenDateTime place={selectedPlace} onConfirm={handleConfirmDateTime} />
          </motion.div>
        )}

        {screen === 'final' && (
          <motion.div key="final" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ScreenFinal place={selectedPlace} date={selectedDate} time={selectedTime} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
