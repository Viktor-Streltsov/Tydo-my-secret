import { useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  onYes: () => void
}

const MARGIN = 24
const SPRING = { stiffness: 180, damping: 22, mass: 0.6 }

export default function ScreenQuestion({ onYes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLButtonElement>(null)
  const [ready, setReady] = useState(false)
  const [btnSize, setBtnSize] = useState({ w: 160, h: 56 })

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springLeft = useSpring(rawX, SPRING)
  const springTop = useSpring(rawY, SPRING)

  // Measure after card animation completes so transforms are settled
  const handleCardReady = useCallback(() => {
    if (ready) return
    const ghost = ghostRef.current
    const container = containerRef.current
    if (!ghost || !container) return

    const gRect = ghost.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()

    const relX = gRect.left - cRect.left
    const relY = gRect.top - cRect.top

    rawX.jump(relX)
    rawY.jump(relY)
    springLeft.jump(relX)
    springTop.jump(relY)

    setBtnSize({ w: gRect.width, h: gRect.height })
    setReady(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const escape = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const { w, h } = btnSize
    const cw = container.offsetWidth
    const ch = container.offsetHeight
    rawX.set(MARGIN + Math.random() * Math.max(0, cw - w - MARGIN * 2))
    rawY.set(MARGIN + Math.random() * Math.max(0, ch - h - MARGIN * 2))
  }, [btnSize, rawX, rawY])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 14 },
    },
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
        <motion.div
          className="glass rounded-3xl p-10 md:p-16 max-w-xl w-full shadow-2xl"
          variants={itemVariants}
          onAnimationComplete={handleCardReady}
        >
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          💌
        </motion.div>

        <motion.h1
          className="text-2xl md:text-3xl font-bold text-gradient leading-snug mb-10"
          variants={itemVariants}
        >
          Ты согласишься пойти со мной на свидание? ❤️
        </motion.h1>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          {/* YES */}
          <motion.button
            onClick={onYes}
            className="shimmer-btn text-white font-semibold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-rose-300/50 cursor-pointer select-none"
            whileHover={{ scale: 1.08, boxShadow: '0 10px 40px rgba(244,63,94,0.45)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            Да 💖
          </motion.button>

          {/* Ghost — invisible placeholder that keeps the card layout stable */}
          <button
            ref={ghostRef}
            aria-hidden
            tabIndex={-1}
            className="invisible pointer-events-none glass-dark text-rose-500 font-semibold text-lg px-10 py-4 rounded-2xl border border-rose-200 select-none"
          >
            Нет 😅
          </button>
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-rose-400/70 italic"
          variants={itemVariants}
        >
          Кнопка «Нет» немного стесняется… 😄
        </motion.p>
      </motion.div>

      {/* Real NO button — absolute within this container, springs around its bounds */}
      <motion.button
        onMouseEnter={escape}
        onTouchStart={escape}
        onFocus={escape}
        className="glass-dark text-rose-500 font-semibold text-lg px-10 py-4 rounded-2xl border border-rose-200 cursor-not-allowed select-none shadow-md"
        style={{
          position: 'absolute',
          left: springLeft,
          top: springTop,
          zIndex: 20,
          opacity: ready ? 1 : 0,
        }}
        whileTap={{ scale: 0.88 }}
      >
        Нет 😅
      </motion.button>
    </motion.div>
  )
}
