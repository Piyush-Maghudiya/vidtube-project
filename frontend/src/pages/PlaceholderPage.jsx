import { motion } from 'framer-motion'

export default function PlaceholderPage({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center"
    >
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-2 max-w-md text-text-secondary">
        {description || 'This section is coming soon.'}
      </p>
    </motion.div>
  )
}
