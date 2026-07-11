import { useRef, useState } from 'react'
import { Upload, Film, Image } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import useVideoStore from '@/store/videoStore'
import { toast } from 'sonner'

export default function UploadVideoDialog({ open, onOpenChange }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [videoName, setVideoName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const thumbnailRef = useRef(null)
  const videoRef = useRef(null)
  const { uploadVideo } = useVideoStore()

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setThumbnailPreview(null)
    setVideoName('')
    setProgress(0)
    if (thumbnailRef.current) thumbnailRef.current.value = ''
    if (videoRef.current) videoRef.current.value = ''
  }

  const handleClose = (isOpen) => {
    if (!uploading) {
      if (!isOpen) resetForm()
      onOpenChange(isOpen)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a video title')
      return
    }
    if (!videoRef.current?.files?.[0]) {
      toast.error('Please select a video file')
      return
    }
    if (!thumbnailRef.current?.files?.[0]) {
      toast.error('Please select a thumbnail image')
      return
    }

    setUploading(true)

    // Extract video duration
    let duration = 0
    try {
      const videoFile = videoRef.current.files[0]
      const videoEl = document.createElement('video')
      videoEl.preload = 'metadata'
      const durationPromise = new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
          resolve(Math.floor(videoEl.duration))
          URL.revokeObjectURL(videoEl.src)
        }
        videoEl.onerror = () => resolve(0)
      })
      videoEl.src = URL.createObjectURL(videoFile)
      duration = await durationPromise
    } catch {
      duration = 0
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('description', description.trim())
    formData.append('duration', duration)
    formData.append('videoFile', videoRef.current.files[0])
    formData.append('thumbnail', thumbnailRef.current.files[0])

    const result = await uploadVideo(formData, (pct) => setProgress(pct))
    setUploading(false)

    if (result.success) {
      toast.success(result.mock ? 'Video uploaded (demo mode)' : 'Video uploaded successfully!')
      resetForm()
      onOpenChange(false)
    } else {
      toast.error('Failed to upload video')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent-purple" />
            Upload Video
          </DialogTitle>
          <DialogDescription>
            Share your content with the Vidtube community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title *</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-desc">Description</Label>
            <Textarea
              id="video-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Video file *</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-4 transition-colors hover:border-accent-purple">
              <Film className="h-8 w-8 text-accent-purple" />
              <span className="text-sm text-text-secondary">
                {videoName || 'Click to select video (MP4, WebM)'}
              </span>
              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideoName(e.target.files[0]?.name || '')}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label>Thumbnail (optional)</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-4 transition-colors hover:border-accent-purple">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-24 w-full rounded-lg object-cover"
                />
              ) : (
                <Image className="h-8 w-8 text-text-secondary" />
              )}
              <span className="text-xs text-text-secondary">Upload custom thumbnail</span>
              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => setThumbnailPreview(ev.target.result)
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </label>
          </div>

          {uploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-text-secondary font-medium">
                <span>Uploading files...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-purple rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
