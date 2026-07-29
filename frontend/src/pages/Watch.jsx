import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ThumbsUp, UserPlus, FolderPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import VideoPlayer from '@/components/VideoPlayer'
import CommentSection from '@/components/CommentSection'
import AddToPlaylistDialog from '@/components/AddToPlaylistDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useVideoStore from '@/store/videoStore'
import useAuthStore from '@/store/authStore'
import { formatViews, timeAgo } from '@/lib/utils'
import { toast } from 'sonner'

export default function Watch() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const { currentVideo, isLoading, fetchVideoById, toggleLike, toggleSubscribe, videos, fetchVideos } =
    useVideoStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (videoId) fetchVideoById(videoId)
  }, [videoId, fetchVideoById])

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos(true)
    }
  }, [videos, fetchVideos])

  const recommended = videos.filter((v) => v._id !== videoId).slice(0, 6)

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like videos')
      return
    }
    await toggleLike(videoId)
    const updatedVideo = useVideoStore.getState().currentVideo
    toast.success(updatedVideo?.isLiked ? 'Video liked!' : 'Like removed')
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe')
      return
    }
    const ownerId = currentVideo?.owner?._id
    if (!ownerId) return
    const wasSubscribed = currentVideo?.owner?.isSubscribed
    await toggleSubscribe(ownerId, { isSubscribed: wasSubscribed })
    const updatedVideo = useVideoStore.getState().currentVideo
    toast.success(updatedVideo?.owner?.isSubscribed ? 'Subscribed!' : 'Unsubscribed')
  }

  const handleSaveToPlaylist = () => {
    if (!isAuthenticated) {
      const isRegistered = localStorage.getItem('isRegistered') === 'true'
      if (!isRegistered) {
        toast.error('Please register an account first')
        navigate('/signup')
      } else {
        toast.error('Please log in to continue')
        navigate('/login')
      }
      return
    }
    setPlaylistOpen(true)
  }

  if (isLoading || !currentVideo) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="mt-4 h-8 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const owner = currentVideo.owner || {}

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <VideoPlayer
          src={currentVideo.videoFile}
          poster={currentVideo.thumbnail}
          title={currentVideo.title}
        />

        <h1 className="mt-4 text-xl font-bold text-white md:text-2xl">
          {currentVideo.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to={`/channel/${owner.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={owner.avatar} />
                <AvatarFallback>{owner.fullName?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                to={`/channel/${owner.username}`}
                className="font-semibold text-white hover:text-accent-purple"
              >
                {owner.fullName}
              </Link>
              <p className="text-xs text-text-secondary">
                {formatViews(currentVideo.views)} • {timeAgo(currentVideo.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={currentVideo.isLiked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              {currentVideo.likesCount || 0}
            </Button>
            <Button
              variant={owner.isSubscribed ? 'default' : 'outline'}
              size="sm"
              onClick={handleSubscribe}
            >
              <UserPlus className="h-4 w-4" />
              {owner.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToPlaylist}
            >
              <FolderPlus className="h-4 w-4 text-accent-purple" />
              Save
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-text-secondary whitespace-pre-wrap">
            {currentVideo.description || 'No description available.'}
          </p>
        </div>

        <CommentSection videoId={videoId} />

        <AddToPlaylistDialog
          open={playlistOpen}
          onOpenChange={setPlaylistOpen}
          videoId={videoId}
        />
      </div>

      <aside>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Recommended
        </h3>
        <div className="space-y-3">
          {recommended.map((video, i) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/watch/${video._id}`}
                className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-card"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-20 w-36 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-white">
                    {video.title}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {video.owner?.fullName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatViews(video.views)} • {timeAgo(video.createdAt)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </aside>
    </div>
  )
}
