import { useState } from 'react'
import { ListPlus } from 'lucide-react'
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
import usePlaylistStore from '@/store/playlistStore'
import { toast } from 'sonner'

export default function CreatePlaylistDialog({ open, onOpenChange }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const { createPlaylist } = usePlaylistStore()

  const resetForm = () => {
    setName('')
    setDescription('')
  }

  const handleClose = (isOpen) => {
    if (!creating) {
      if (!isOpen) resetForm()
      onOpenChange(isOpen)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a playlist name')
      return
    }

    setCreating(true)
    const result = await createPlaylist({
      name: name.trim(),
      description: description.trim(),
    })
    setCreating(false)

    if (result.success) {
      toast.success(result.mock ? 'Playlist created (demo mode)' : 'Playlist created!')
      resetForm()
      onOpenChange(false)
    } else {
      toast.error('Failed to create playlist')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="h-5 w-5 text-accent-purple" />
            Create Playlist
          </DialogTitle>
          <DialogDescription>
            Organize videos into a collection you can share or revisit later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">Name *</Label>
            <Input
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React Tutorials"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist-desc">Description</Label>
            <Textarea
              id="playlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this playlist about?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
