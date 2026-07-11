import { useState, useEffect } from 'react'
import { FolderPlus, Loader2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import usePlaylistStore from '@/store/playlistStore'
import { toast } from 'sonner'

export default function AddToPlaylistDialog({ open, onOpenChange, videoId }) {
  const { playlists, fetchPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, createPlaylist } = usePlaylistStore()
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      fetchPlaylists().finally(() => setLoading(false))
    }
  }, [open, fetchPlaylists])

  const handleTogglePlaylist = async (playlistId, isChecked) => {
    if (isChecked) {
      const res = await addVideoToPlaylist(playlistId, videoId)
      if (res.success) {
        toast.success('Added to playlist')
      } else {
        toast.error(res.error || 'Failed to add to playlist')
      }
    } else {
      const res = await removeVideoFromPlaylist(playlistId, videoId)
      if (res.success) {
        toast.success('Removed from playlist')
      } else {
        toast.error(res.error || 'Failed to remove from playlist')
      }
    }
  }

  const handleCreateAndAdd = async (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return

    setCreating(true)
    const result = await createPlaylist({
      name: newPlaylistName.trim(),
      description: 'Created from player',
    })
    
    if (result.success) {
      const playlistId = result.playlist._id
      const addRes = await addVideoToPlaylist(playlistId, videoId)
      if (addRes.success) {
        toast.success('Playlist created and video added!')
      } else {
        toast.success('Playlist created!')
        toast.error('Failed to add video to new playlist')
      }
      setNewPlaylistName('')
      setShowCreate(false)
    } else {
      toast.error('Failed to create playlist')
    }
    setCreating(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-accent-purple" />
            Save to Playlist
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent-purple" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
              {playlists.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-4">
                  No playlists found. Create one below!
                </p>
              ) : (
                playlists.map((playlist) => {
                  const isChecked =
                    playlist.videos?.some((v) => (v._id || v) === videoId) || false

                  return (
                    <label
                      key={playlist._id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 hover:bg-card transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleTogglePlaylist(playlist._id, e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent-purple focus:ring-accent-purple accent-accent-purple cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{playlist.name}</p>
                        {playlist.description && (
                          <p className="text-xs text-text-secondary truncate">{playlist.description}</p>
                        )}
                      </div>
                    </label>
                  )
                })
              )}
            </div>

            <div className="border-t border-border pt-3">
              {showCreate ? (
                <form onSubmit={handleCreateAndAdd} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-playlist-name" className="text-xs">
                      Playlist Name
                    </Label>
                    <Input
                      id="new-playlist-name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Enter playlist name..."
                      className="h-9"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreate(false)
                        setNewPlaylistName('')
                      }}
                      disabled={creating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={creating}>
                      {creating ? 'Creating...' : 'Create & Save'}
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-accent-purple hover:bg-accent-purple/10"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create new playlist
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
