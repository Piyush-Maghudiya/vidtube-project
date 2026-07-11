import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatViews, timeAgo } from '@/lib/utils'

export default function VideoCard({ video, index = 0, showChannel = true }) {
  const owner = video.owner || {}
  const channelName = owner.fullName || owner.username || 'Unknown'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link to={`/watch/${video._id}`} className="block">
        <div className="neon-glow overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:border-accent-purple/50">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {video.duration && (
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                {formatDuration(video.duration)}
              </span>
            )}
          </div>
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-accent-purple transition-colors">
              {video.title}
            </h3>
            {showChannel && (
              <p className="mt-1 text-xs text-text-secondary hover:text-white transition-colors">
                {channelName}
              </p>
            )}
            <p className="mt-0.5 text-xs text-text-secondary">
              {formatViews(video.views)} • {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
