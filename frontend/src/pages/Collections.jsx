import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ListMusic, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog'
import usePlaylistStore from '@/store/playlistStore'
import useAuthStore from '@/store/authStore'
import { timeAgo } from '@/lib/utils'

export default function Collections() {
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const { playlists, isLoading, fetchPlaylists } = usePlaylistStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) fetchPlaylists()
  }, [isAuthenticated, fetchPlaylists])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <ListMusic className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">Your Collections</h2>
        <p className="mt-2 text-text-secondary">Log in to view and manage playlists.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <p className="text-sm text-text-secondary">Your playlists and saved groups</p>
        </div>
        <Button onClick={() => setPlaylistOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <ListMusic className="mb-4 h-12 w-12 text-text-secondary" />
          <p className="text-text-secondary">No playlists yet. Create one from the navbar.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist, i) => (
            <motion.div
              key={playlist._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card transition-all hover:border-accent-purple/50 hover:shadow-lg hover:shadow-accent-purple/10"
            >
              <Link to={`/playlist/${playlist._id}`} className="block p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/20">
                  <ListMusic className="h-6 w-6 text-accent-purple" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-accent-purple transition-colors">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                    {playlist.description}
                  </p>
                )}
                <p className="mt-3 text-xs text-text-secondary">
                  {playlist.videoCount ?? playlist.totalvideos ?? 0} videos • {timeAgo(playlist.createdAt)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <CreatePlaylistDialog open={playlistOpen} onOpenChange={setPlaylistOpen} />
    </div>
  )
}
