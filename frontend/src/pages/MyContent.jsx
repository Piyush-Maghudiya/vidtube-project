import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Video, Upload, Trash2, Eye, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UploadVideoDialog from '@/components/UploadVideoDialog'
import EditVideoDialog from '@/components/EditVideoDialog'
import { getVideos, deleteVideo } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { normalizeVideo, formatViews, timeAgo } from '@/lib/utils'
import { toast } from 'sonner'

export default function MyContent() {
  const [myVideos, setMyVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editVideo, setEditVideo] = useState(null)
  const { user, isAuthenticated } = useAuthStore()

  const fetchMyVideos = async () => {
    if (!user?._id) return
    try {
      setIsLoading(true)
      const { data } = await getVideos({ userId: user._id })
      // getVideos might return paginated object with docs array
      const rawVideos = data.data?.docs || data.data || []
      const normalized = rawVideos.map(normalizeVideo)
      setMyVideos(normalized)
    } catch (err) {
      console.error('Failed to fetch user videos:', err)
      toast.error('Failed to load your videos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyVideos()
    }
  }, [isAuthenticated, user])

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return
    try {
      await deleteVideo(videoId)
      toast.success('Video deleted successfully')
      setMyVideos((prev) => prev.filter((v) => v._id !== videoId))
    } catch (err) {
      console.error('Failed to delete video:', err)
      toast.error(err.message || 'Failed to delete video')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Video className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">My Content</h2>
        <p className="mt-2 text-text-secondary">Log in to manage your uploaded videos.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Video className="h-6 w-6 text-accent-purple" />
            My Content
          </h1>
          <p className="text-sm text-text-secondary">Manage and upload your videos</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload video
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-full rounded-xl bg-card animate-pulse border border-border" />
          ))}
        </div>
      ) : myVideos.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <Video className="mb-4 h-12 w-12 text-text-secondary" />
          <p className="text-text-secondary">You haven&apos;t uploaded any videos yet.</p>
          <Button onClick={() => setUploadOpen(true)} className="mt-4 gap-2">
            <Upload className="h-4 w-4" />
            Upload your first video
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-background/50 text-xs font-semibold uppercase text-white border-b border-border">
                <tr>
                  <th className="px-6 py-4">Video</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Published</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myVideos.map((video, i) => (
                  <motion.tr
                    key={video._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-background/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/watch/${video._id}`} className="shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-12 w-20 rounded-lg object-cover border border-border"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/watch/${video._id}`}
                            className="font-medium text-white hover:text-accent-purple transition-colors block truncate max-w-xs md:max-w-md"
                          >
                            {video.title}
                          </Link>
                          <span className="text-xs text-text-secondary">
                            {Math.floor((video.duration || 0) / 60)}:
                            {String(Math.floor((video.duration || 0) % 60)).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatViews(video.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {timeAgo(video.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild title="Watch video">
                          <Link to={`/watch/${video._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditVideo(video)
                            setEditOpen(true)
                          }}
                          title="Edit details"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(video._id)}
                          className="hover:text-red-500 hover:bg-red-500/10"
                          title="Delete video"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UploadVideoDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadSuccess={fetchMyVideos}
      />

      <EditVideoDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        video={editVideo}
        onUpdateSuccess={fetchMyVideos}
      />
    </div>
  )
}
