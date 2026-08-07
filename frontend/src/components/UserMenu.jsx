import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Upload,
  ListPlus,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BarChart2,
  ShieldCheck,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import UploadVideoDialog from './UploadVideoDialog'
import CreatePlaylistDialog from './CreatePlaylistDialog'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function UserMenu() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [playlistOpen, setPlaylistOpen] = useState(false)

  if (!user) return null

  const handleUpload = () => setUploadOpen(true)
  const handleCreatePlaylist = () => setPlaylistOpen(true)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick upload — visible on tablet+ */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-text-secondary hover:text-accent-purple sm:flex"
          onClick={handleUpload}
          title="Upload video"
        >
          <Upload className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 outline-none transition-colors hover:bg-accent-purple/10 focus-visible:ring-2 focus-visible:ring-accent-purple">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-white md:block">
                {user.fullName}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-text-secondary sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-text-secondary truncate">@{user.username}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to={`/channel/${user.username}`} className="cursor-pointer">
                <User className="h-4 w-4" />
                Your channel
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleUpload}>
              <Upload className="h-4 w-4" />
              Upload video
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleCreatePlaylist}>
              <ListPlus className="h-4 w-4" />
              Create playlist
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/studio" className="cursor-pointer">
                <BarChart2 className="h-4 w-4" />
                Creator Studio
              </Link>
            </DropdownMenuItem>

            {(user.role === 'admin' || user.email === 'maghudiyapiyush8206@gmail.com') && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer text-accent-purple font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UploadVideoDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreatePlaylistDialog open={playlistOpen} onOpenChange={setPlaylistOpen} />
    </>
  )
}
