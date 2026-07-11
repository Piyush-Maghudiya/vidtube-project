import { useState } from 'react'
import { Plus, Upload, ListPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import UploadVideoDialog from './UploadVideoDialog'
import CreatePlaylistDialog from './CreatePlaylistDialog'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

/** Create (+) button for logged-out users — prompts login */
export default function CreateMenu() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const requireAuth = (action) => {
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
    action()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full bg-accent-purple shadow-lg shadow-accent-purple/30 hover:bg-accent-purple/90"
            title="Create"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => requireAuth(() => setUploadOpen(true))}>
            <Upload className="h-4 w-4" />
            Upload video
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => requireAuth(() => setPlaylistOpen(true))}>
            <ListPlus className="h-4 w-4" />
            Create playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isAuthenticated && (
        <>
          <UploadVideoDialog open={uploadOpen} onOpenChange={setUploadOpen} />
          <CreatePlaylistDialog open={playlistOpen} onOpenChange={setPlaylistOpen} />
        </>
      )}
    </>
  )
}
