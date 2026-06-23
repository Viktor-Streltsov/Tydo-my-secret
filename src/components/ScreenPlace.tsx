import { motion } from 'framer-motion'

interface Props {
  onSelect: (place: string) => void
}

const PLACES = [
  { id: 'cafe', label: 'Кофейня', emoji: '☕', desc: 'Уютно, тепло и вкусный кофе' },
  { id: 'park', label: 'Парк', emoji: '🌳', desc: 'Прогулка на свежем воздухе' },
  { id: 'cinema', label: 'Кино', emoji: '🎬', desc: 'Классный фильм вдвоём' },
  { id: 'icecream', label: 'Мороженое', emoji: '🍦', desc: 'Погулять и съесть мороженое' },
  { id: 'bowling', label: 'Боулинг', emoji: '🎳', desc: 'Весело и без лишней серьёзности' },
  { id: 'embankment', label: 'Набережная', emoji: '🌊', desc: 'Прогулка вдоль воды' },
  { id: 'market', label: 'Рынок / маркет', emoji: '🛍️', desc: 'Побродить по уличным лавкам' },
  { id: 'other', label: 'Придумаем вместе', emoji: '✨', desc: 'Сюрприз — решим на месте' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 14 },
  },
}

export default function ScreenPlace({ onSelect }: Props) {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-10" variants={cardVariants}>
        <motion.div
          className="text-5xl mb-4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✨
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">
          Тогда выбери место нашей встречи ✨
        </h2>
        <p className="mt-3 text-rose-400/70 text-sm">Нажми на понравившийся вариант</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl w-full">
        {PLACES.map(place => (
          <motion.button
            key={place.id}
            variants={cardVariants}
            onClick={() => onSelect(place.label)}
            className="glass rounded-2xl p-6 text-left group cursor-pointer focus:outline-none"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(244,63,94,0.3)',
              background: 'rgba(255,255,255,0.38)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <motion.div
              className="text-4xl mb-3"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {place.emoji}
            </motion.div>
            <h3 className="font-bold text-rose-700 text-lg">{place.label}</h3>
            <p className="text-rose-400/80 text-xs mt-1 leading-relaxed">{place.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
