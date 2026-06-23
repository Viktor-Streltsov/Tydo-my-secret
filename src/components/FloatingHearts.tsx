import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heart {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  emoji: string
}

const HEART_EMOJIS = ['❤️', '💖', '💗', '💓', '💝', '💕', '🌸', '✨', '💫']

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const initial: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 14,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]!,
    }))
    setHearts(initial)

    const interval = setInterval(() => {
      setHearts(prev => {
        const next = prev.map(h => ({
          ...h,
          id: h.id + 100,
          x: Math.random() * 100,
          size: Math.random() * 20 + 14,
          duration: Math.random() * 8 + 6,
          delay: 0,
          emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]!,
        }))
        return next.slice(-18)
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute select-none"
            style={{
              left: `${heart.x}%`,
              bottom: '-60px',
              fontSize: `${heart.size}px`,
              filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.4))',
            }}
            initial={{ y: 0, opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{
              y: -(window.innerHeight + 100),
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.5, 1, 1.1, 0.8],
              rotate: [Math.random() * 30 - 15, Math.random() * 30 - 15],
              x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: 'easeInOut',
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
