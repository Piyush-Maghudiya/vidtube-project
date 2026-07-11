import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, Play } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import UserMenu from './UserMenu'
import CreateMenu from './CreateMenu'
import useAuthStore from '@/store/authStore'

export default function Navbar({ onMenuClick }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md lg:pl-[240px]">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-accent-purple/10 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link to="/" className="flex shrink-0 items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue">
          <Play className="h-4 w-4 fill-white text-white" />
        </div>
        <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
          Vid<span className="text-accent-purple">tube</span>
        </span>
      </Link>

      <form onSubmit={handleSearch} className="mx-auto hidden w-full max-w-xl md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="h-10 rounded-full bg-card pl-10 pr-4"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <CreateMenu />
        {isAuthenticated && user ? (
          <UserMenu />
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
