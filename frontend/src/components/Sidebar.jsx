import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  ThumbsUp,
  History,
  Video,
  FolderHeart,
  Users,
  LifeBuoy,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/liked', icon: ThumbsUp, label: 'Liked Videos' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/my-content', icon: Video, label: 'My Content' },
  { to: '/collections', icon: FolderHeart, label: 'Collections' },
  { to: '/subscribers', icon: Users, label: 'Subscribers' },
]

const bottomItems = [
  { to: '/support', icon: LifeBuoy, label: 'Support' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : undefined }}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col border-r border-border bg-background pt-16 transition-transform duration-300',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-[72px] rounded-lg p-1 text-text-secondary hover:text-white lg:hidden"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'sidebar-glow flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-purple/15 text-white shadow-[inset_3px_0_0_#a855f7]'
                  : 'text-text-secondary hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-4 flex flex-col gap-1">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'sidebar-glow flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-accent-purple/50 bg-accent-purple/10 text-white'
                  : 'text-text-secondary hover:border-accent-purple/30 hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </motion.aside>
  )
}
