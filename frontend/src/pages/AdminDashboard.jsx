import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Video,
  Eye,
  ShieldAlert,
  UserCheck,
  Calendar,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react'
import { getAdminStats, getAdminUsers, getAdminVideos } from '../services/api'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [usersList, setUsersList] = useState([])
  const [videosList, setVideosList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'videos'
  const [userSearch, setUserSearch] = useState('')
  const [videoSearch, setVideoSearch] = useState('')

  // Access check
  const isAdmin = user && (user.role === 'admin' || user.email === 'maghudiyapiyush8206@gmail.com')

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Administrators only.')
      navigate('/')
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [statsRes, usersRes, videosRes] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getAdminVideos()
        ])
        setStats(statsRes.data.data)
        setUsersList(usersRes.data.data)
        setVideosList(videosRes.data.data)
      } catch (err) {
        toast.error(err.message || 'Failed to fetch admin dashboard logs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAdmin, navigate])

  if (!isAdmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background px-4 text-center">
        <div className="max-w-md space-y-4">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-text-secondary text-sm">
            Only administrators are authorized to access the dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#0f0f0f]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-purple border-t-transparent"></div>
      </div>
    )
  }

  // Filter searches
  const filteredUsers = usersList.filter(u =>
    u.fullname?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredVideos = videosList.filter(v =>
    v.title?.toLowerCase().includes(videoSearch.toLowerCase()) ||
    v.owner?.username?.toLowerCase().includes(videoSearch.toLowerCase())
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 pt-20">
      {/* Background Neon glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-accent-purple/5 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-accent-blue/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Admin <span className="text-accent-purple">Control Center</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Monitor logins, active accounts, and uploaded content directory.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-xs text-text-secondary max-w-xs self-start">
            <UserCheck className="h-4 w-4 text-accent-purple" />
            <span>Logged in as: <strong className="text-white">{user.email}</strong></span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex items-center justify-between rounded-xl p-5 border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Total Registered Users</p>
              <h3 className="mt-2 text-2xl font-black text-white">{stats?.totalUsers || 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
              <Users className="h-6 w-6" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card flex items-center justify-between rounded-xl p-5 border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Active Login Logouts</p>
              <h3 className="mt-2 text-2xl font-black text-white">{stats?.activeUsers || 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
              <UserCheck className="h-6 w-6" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card flex items-center justify-between rounded-xl p-5 border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Total Videos Cataloged</p>
              <h3 className="mt-2 text-2xl font-black text-white">{stats?.totalVideos || 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-pink/10 text-accent-pink">
              <Video className="h-6 w-6" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card flex items-center justify-between rounded-xl p-5 border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Cumulative Video Views</p>
              <h3 className="mt-2 text-2xl font-black text-white">{stats?.totalViews || 0}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Eye className="h-6 w-6" />
            </div>
          </motion.div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all ${
              activeTab === 'users'
                ? 'border-accent-purple text-white'
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            User Access Logs
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all ${
              activeTab === 'videos'
                ? 'border-accent-purple text-white'
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            <Video className="h-4 w-4" />
            Uploaded Content
          </button>
        </div>

        {/* Dynamic Log Content */}
        {activeTab === 'users' ? (
          <div className="space-y-4">
            {/* Search filter */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full rounded-xl bg-card border border-border py-2 pl-9 pr-4 text-sm text-white placeholder-text-secondary focus:border-accent-purple focus:outline-none"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm text-white border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-text-secondary font-semibold uppercase text-xs">
                    <th className="px-6 py-4">User profile</th>
                    <th className="px-6 py-4">Status / Role</th>
                    <th className="px-6 py-4">Registered Date</th>
                    <th className="px-6 py-4">Last Login Time</th>
                    <th className="px-6 py-4 text-center">Videos Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-accent-purple/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.fullname}
                            className="h-9 w-9 rounded-full object-cover border border-border"
                          />
                          <div>
                            <p className="font-bold text-white">{u.fullname}</p>
                            <p className="text-xs text-text-secondary">@{u.username} | {u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-accent-purple/20 text-accent-purple'
                              : 'bg-text-secondary/20 text-text-secondary'
                          }`}>
                            {u.role === 'admin' ? 'Administrator' : 'Standard User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-secondary text-xs">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-accent-purple" />
                            {formatDate(u.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`font-semibold ${u.lastLogin ? 'text-green-400' : 'text-rose-500'}`}>
                            {formatDate(u.lastLogin)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-extrabold text-accent-blue text-sm">
                          {u.videoCount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-text-secondary">
                        No users match the search terms
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search filter */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search videos by title, owner..."
                value={videoSearch}
                onChange={(e) => setVideoSearch(e.target.value)}
                className="w-full rounded-xl bg-card border border-border py-2 pl-9 pr-4 text-sm text-white placeholder-text-secondary focus:border-accent-purple focus:outline-none"
              />
            </div>

            {/* Videos Catalog Table */}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm text-white border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-text-secondary font-semibold uppercase text-xs">
                    <th className="px-6 py-4">Video details</th>
                    <th className="px-6 py-4">Uploaded By</th>
                    <th className="px-6 py-4">Upload Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((v) => (
                      <tr key={v._id} className="hover:bg-accent-purple/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="h-10 w-16 rounded object-cover border border-border"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-white truncate">{v.title}</p>
                            <p className="text-xs text-text-secondary truncate">{v.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-white">{v.owner?.fullname}</p>
                            <p className="text-xs text-text-secondary">@{v.owner?.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary text-xs">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-accent-purple" />
                            {formatDate(v.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            v.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {v.isPublished ? 'Public' : 'Private'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-secondary text-xs font-bold">
                          <span className="flex items-center gap-1 text-white">
                            <Eye className="h-4 w-4 text-amber-500" />
                            {v.views}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-text-secondary">
                        No videos match the search terms
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
