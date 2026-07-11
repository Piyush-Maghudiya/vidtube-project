import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Users, Eye, ThumbsUp, Film, Calendar, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getChannelStats, getChannelVideos } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { formatViews } from '@/lib/utils'
import { toast } from 'sonner'

export default function CreatorStudio() {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const [statsRes, videosRes] = await Promise.all([
          getChannelStats(),
          getChannelVideos(),
        ])
        setStats(statsRes.data.data)
        setVideos(videosRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        toast.error('Failed to load Creator Studio analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <BarChart3 className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">Creator Studio</h2>
        <p className="mt-2 text-text-secondary">Log in to view your creator metrics.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Views',
      value: formatViews(stats?.totalviews || 0),
      icon: Eye,
      color: 'text-accent-blue bg-accent-blue/10',
    },
    {
      label: 'Subscribers',
      value: stats?.totalsubscriber || 0,
      icon: Users,
      color: 'text-accent-purple bg-accent-purple/10',
    },
    {
      label: 'Total Likes',
      value: stats?.totallikes || 0,
      icon: ThumbsUp,
      color: 'text-accent-pink bg-accent-pink/10',
    },
    {
      label: 'Uploaded Videos',
      value: stats?.totalvideos || 0,
      icon: Film,
      color: 'text-green-500 bg-green-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-accent-purple" />
          Creator Studio
        </h1>
        <p className="text-sm text-text-secondary">Channel analytics dashboard for @{user.username}</p>
      </div>

      {isLoading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-card animate-pulse border border-border" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-card animate-pulse border border-border" />
        </>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Videos Performance */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Video Performance</h2>

            {videos.length === 0 ? (
              <p className="text-center py-12 text-text-secondary text-sm">
                No videos uploaded yet. Upload videos to see their stats here!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-text-secondary">
                  <thead className="text-xs font-semibold text-white border-b border-border bg-background/30 uppercase">
                    <tr>
                      <th className="px-6 py-3">Video</th>
                      <th className="px-6 py-3">Likes</th>
                      <th className="px-6 py-3">Uploaded Date</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {videos.map((video, index) => (
                      <motion.tr
                        key={video._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="hover:bg-background/25 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/watch/${video._id}`} className="shrink-0">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-10 w-16 rounded-md object-cover border border-border"
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                to={`/watch/${video._id}`}
                                className="font-medium text-white hover:text-accent-purple truncate max-w-xs block"
                              >
                                {video.title}
                              </Link>
                              <span className="text-[10px] text-text-secondary truncate block max-w-xs">
                                {video.description || 'No description'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5 text-accent-pink" />
                            {video.likescount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {video.createdAt
                              ? `${video.createdAt.day}/${video.createdAt.month}/${video.createdAt.year}`
                              : 'Recent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
                              video.isPublished
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}
                          >
                            {video.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
