import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'
import { getLikedVideos } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { normalizeVideo } from '@/lib/utils'

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    const fetchLikes = async () => {
      try {
        setIsLoading(true)
        const { data } = await getLikedVideos()
        const docs = data.data || []
        const normalized = docs.map(normalizeVideo)
        if (isMounted) {
          setLikedVideos(normalized)
        }
      } catch (err) {
        console.error('Failed to fetch liked videos:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchLikes()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <ThumbsUp className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">Liked Videos</h2>
        <p className="mt-2 text-text-secondary">Log in to view your liked videos.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ThumbsUp className="h-6 w-6 text-accent-purple" />
          Liked Videos
        </h1>
        <p className="text-sm text-text-secondary">Videos you have liked will show up here</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : likedVideos.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <ThumbsUp className="mb-4 h-12 w-12 text-text-secondary" />
          <p className="text-text-secondary">No liked videos yet. Explore videos to add some!</p>
          <Button className="mt-6" asChild>
            <Link to="/">Explore Home</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {likedVideos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
