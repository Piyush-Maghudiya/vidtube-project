import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Trash2, ListMusic, Edit, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPlaylistById, removeVideoFromPlaylist, updatePlaylist, deletePlaylist } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { formatViews, timeAgo, normalizeVideo } from '@/lib/utils'
import { toast } from 'sonner'

export default function PlaylistDetail() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const { user, isAuthenticated } = useAuthStore()

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true)
      const { data } = await getPlaylistById(playlistId)
      setPlaylist(data.data)
      setEditName(data.data?.name || '')
      setEditDesc(data.data?.description || '')
    } catch (err) {
      console.error('Failed to fetch playlist details:', err)
      toast.error('Failed to load playlist')
      navigate('/collections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId])

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlistId, videoId)
      toast.success('Video removed from playlist')
      // Update local state
      setPlaylist((prev) => {
        if (!prev) return null
        const filteredVideos = prev.videos.filter((v) => v._id !== videoId)
        return {
          ...prev,
          videos: filteredVideos,
          totalvideos: filteredVideos.length,
        }
      })
    } catch (err) {
      console.error('Failed to remove video:', err)
      toast.error(err.message || 'Failed to remove video')
    }
  }

  const handleUpdatePlaylist = async () => {
    if (!editName.trim()) {
      toast.error('Playlist name cannot be empty')
      return
    }
    try {
      await updatePlaylist(playlistId, { name: editName.trim(), description: editDesc.trim() })
      toast.success('Playlist updated successfully')
      setPlaylist((prev) => ({
        ...prev,
        name: editName.trim(),
        description: editDesc.trim(),
      }))
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update playlist:', err)
      toast.error(err.message || 'Failed to update playlist')
    }
  }

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return
    try {
      await deletePlaylist(playlistId)
      toast.success('Playlist deleted successfully')
      navigate('/collections')
    } catch (err) {
      console.error('Failed to delete playlist:', err)
      toast.error(err.message || 'Failed to delete playlist')
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-60 rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Playlist not found.</p>
        <Button className="mt-4" asChild>
          <Link to="/collections">Back to Collections</Link>
        </Button>
      </div>
    )
  }

  const isOwner = isAuthenticated && user && playlist.owner?._id === user._id
  const videos = playlist.videos || []
  const firstVideo = videos[0]

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      {/* Sidebar Info Card */}
      <div>
        <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-accent-purple/20 flex items-center justify-center border border-border mb-4">
            {firstVideo?.thumbnail ? (
              <img
                src={firstVideo.thumbnail}
                alt={playlist.name}
                className="h-full w-full object-cover opacity-80"
              />
            ) : (
              <ListMusic className="h-12 w-12 text-accent-purple" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Playlist
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-text-secondary uppercase">Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Playlist name"
                  className="h-8 text-sm bg-background mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-text-secondary uppercase">Description</label>
                <Textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Playlist description"
                  className="text-sm bg-background mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1 text-xs" onClick={handleUpdatePlaylist}>
                  Save
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="w-full text-xs gap-1.5 mt-2 bg-red-600 hover:bg-red-700 hover:text-white border-0"
                onClick={handleDeletePlaylist}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Playlist
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white line-clamp-2">{playlist.name}</h1>
              <p className="mt-2 text-sm text-text-secondary whitespace-pre-wrap">
                {playlist.description || 'No description provided.'}
              </p>

              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Playlist Info
                </Button>
              )}
            </>
          )}

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-text-secondary">
            <div>
              Created by{' '}
              <Link
                to={`/channel/${playlist.owner?.username}`}
                className="font-medium text-white hover:text-accent-purple"
              >
                {playlist.owner?.fullname || playlist.owner?.username || 'Unknown'}
              </Link>
            </div>
            <div>{playlist.totalvideos || 0} videos</div>
            <div>{formatViews(playlist.totalviews || 0)} views</div>
            <div>Last updated {timeAgo(playlist.updatedAt)}</div>
          </div>

          {firstVideo && (
            <Button className="mt-6 w-full gap-2" asChild>
              <Link to={`/watch/${firstVideo._id}`}>
                <Play className="h-4 w-4 fill-white" />
                Play All
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Playlist Videos List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Videos</h2>

        {videos.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-text-secondary">
            This playlist has no videos yet.
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video, index) => {
              const videoOwner = video.owner || {}
              return (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group relative flex gap-4 rounded-xl border border-border bg-card p-3 hover:border-accent-purple/30 transition-all hover:bg-background/20"
                >
                  <Link to={`/watch/${video._id}`} className="shrink-0 relative aspect-video w-32 md:w-40 overflow-hidden rounded-lg">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    {video.duration && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                        {Math.floor(video.duration / 60)}:
                        {String(Math.floor(video.duration % 60)).padStart(2, '0')}
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link
                        to={`/watch/${video._id}`}
                        className="font-medium text-sm text-white line-clamp-2 hover:text-accent-purple transition-colors block"
                      >
                        {video.title}
                      </Link>
                      <p className="mt-1 text-xs text-text-secondary">
                        {videoOwner.fullname || videoOwner.username || 'Unknown'}
                      </p>
                    </div>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      {formatViews(video.views)} • {timeAgo(video.createdAt)}
                    </p>
                  </div>

                  {isOwner && (
                    <div className="flex items-center pr-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveVideo(video._id)}
                        className="h-8 w-8 text-text-secondary hover:text-red-500 hover:bg-red-500/10"
                        title="Remove from playlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
