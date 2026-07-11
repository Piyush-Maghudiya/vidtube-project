import { useRef, useState, useEffect } from 'react'
import { Edit2, Image } from 'lucide-react'
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
import { updateVideo } from '@/services/api'
import { toast } from 'sonner'

export default function EditVideoDialog({ open, onOpenChange, video, onUpdateSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [updating, setUpdating] = useState(false)
  const thumbnailRef = useRef(null)

  useEffect(() => {
    if (video) {
      setTitle(video.title || '')
      setDescription(video.description || '')
      setThumbnailPreview(video.thumbnail || null)
    }
  }, [video, open])

  const handleClose = (isOpen) => {
    if (!updating) {
      onOpenChange(isOpen)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!video?._id) return

    if (!title.trim()) {
      toast.error('Please enter a video title')
      return
    }
    if (!description.trim()) {
      toast.error('Please enter a video description')
      return
    }

    setUpdating(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())

      if (thumbnailRef.current?.files?.[0]) {
        formData.append('thumbnail', thumbnailRef.current.files[0])
      }

      await updateVideo(video._id, formData)
      toast.success('Video updated successfully!')
      if (onUpdateSuccess) onUpdateSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to update video:', err)
      toast.error(err.message || 'Failed to update video')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-accent-purple" />
            Edit Video Details
          </DialogTitle>
          <DialogDescription>
            Modify your video title, description, or thumbnail.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-video-title">Title *</Label>
            <Input
              id="edit-video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-video-desc">Description *</Label>
            <Textarea
              id="edit-video-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
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
              <span className="text-xs text-text-secondary">Upload new custom thumbnail</span>
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

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={updating}>
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
