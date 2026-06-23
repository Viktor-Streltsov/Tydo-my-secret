import { motion } from 'framer-motion'

interface Props {
  place: string
  date: string
  time: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  // format is DD.MM (e.g. "14.06")
  const [day, mon] = dateStr.split('.')
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
  const monthName = months[parseInt(mon, 10) - 1] ?? ''
  return `${parseInt(day, 10)} ${monthName}`
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  return timeStr
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 12 },
  },
}

export default function ScreenFinal({ place, date, time }: Props) {
  const hasDateTime = date || time
  const formattedDate = formatDate(date)
  const formattedTime = formatTime(time)

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Burst of hearts on load */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl pointer-events-none"
          style={{
            left: `${15 + i * 14}%`,
            top: '50%',
          }}
          initial={{ opacity: 1, scale: 0, y: 0, x: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0.5],
            y: [0, -(80 + Math.random() * 120)],
            x: [(Math.random() - 0.5) * 100],
          }}
          transition={{ duration: 1.8, delay: i * 0.1, ease: 'easeOut' }}
        >
          {['❤️', '💖', '💗', '💝', '💕', '✨'][i]}
        </motion.div>
      ))}

      <motion.div
        className="glass rounded-3xl p-10 md:p-16 max-w-xl w-full shadow-2xl"
        variants={itemVariants}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🥰
        </motion.div>

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gradient mb-6 leading-snug"
          variants={itemVariants}
        >
          Я уже с нетерпением жду нашей встречи ❤️
        </motion.h2>

        {hasDateTime ? (
          <motion.div
            className="glass-dark rounded-2xl p-6 text-left space-y-3"
            variants={itemVariants}
          >
            <p className="text-rose-400/80 text-sm font-medium uppercase tracking-wider mb-4">
              Мы договорились встретиться:
            </p>

            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="text-rose-700 font-semibold text-lg">{place}</span>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <span className="text-rose-700 font-semibold text-lg">{formattedDate}</span>
              </div>
            )}

            {formattedTime && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕒</span>
                <span className="text-rose-700 font-semibold text-lg">{formattedTime}</span>
              </div>
            )}

            <motion.p
              className="pt-4 text-rose-500/80 italic text-sm leading-relaxed"
              variants={itemVariants}
            >
              Обещаю, это будет замечательный день ✨
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="glass-dark rounded-2xl p-6 text-rose-600/80 leading-relaxed text-sm md:text-base"
            variants={itemVariants}
          >
            <p className="mb-4">
              Даже если мы ещё не определились с точной датой и временем, для меня главное —
              знать, что эта встреча обязательно состоится.
            </p>
            <p className="font-medium text-rose-500">
              Буду ждать того дня, когда мы наконец увидимся и проведём время вместе ✨
            </p>
          </motion.div>
        )}

        {/* Decorative hearts row */}
        <motion.div
          className="flex justify-center gap-2 mt-8 text-2xl"
          variants={itemVariants}
        >
          {['💖', '✨', '💖', '✨', '💖'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
