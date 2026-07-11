import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, User, Video, CheckCircle2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getSubscribedChannels, getSubscribers, toggleSubscription } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function Subscribers() {
  const [subscribedChannels, setSubscribedChannels] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [activeTab, setActiveTab] = useState('subscribed') // 'subscribed' | 'subscribers'
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuthStore()

  const fetchData = async () => {
    if (!user?._id) return
    setIsLoading(true)
    try {
      if (activeTab === 'subscribed') {
        const { data } = await getSubscribedChannels(user._id)
        const raw = data.data || []
        const mapped = raw.map((item) => ({
          _id: item.subscribedto?._id,
          username: item.subscribedto?.username,
          fullname: item.subscribedto?.fullName || item.subscribedto?.fullname || 'Unknown Channel',
          avatar: item.subscribedto?.avatar?.url || item.subscribedto?.avatar,
          latestVideo: item.subscribedto?.latestVideo || null,
        }))
        setSubscribedChannels(mapped)
      } else {
        const { data } = await getSubscribers(user._id)
        const raw = data.data || []
        const mapped = raw.map((item) => ({
          _id: item.subscriber?._id,
          username: item.subscriber?.username,
          fullname: item.subscriber?.fullname || item.subscriber?.fullName || 'Anonymous User',
          avatar: item.subscriber?.avatar?.url || item.subscriber?.avatar,
          subscriberCount: item.subscriber?.subscribercount || 0,
          subscribedToSubscriber: item.subscriber?.subscribedtosubscriber || false,
        }))
        setSubscribers(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch subscribers data:', err)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchData()
    }
  }, [isAuthenticated, user, activeTab])

  const handleToggleSubscribe = async (channelId) => {
    try {
      await toggleSubscription(channelId)
      toast.success('Subscription updated')
      // Remove from list if in 'subscribed' tab
      if (activeTab === 'subscribed') {
        setSubscribedChannels((prev) => prev.filter((c) => c._id !== channelId))
      } else {
        // Toggle flag in 'subscribers' tab
        setSubscribers((prev) =>
          prev.map((s) =>
            s._id === channelId
              ? { ...s, subscribedToSubscriber: !s.subscribedToSubscriber }
              : s
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle subscription:', err)
      toast.error(err.message || 'Failed to update subscription')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Users className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">Subscribers</h2>
        <p className="mt-2 text-text-secondary">Log in to view and manage your subscribers.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="h-6 w-6 text-accent-purple" />
          Subscribers & Subscriptions
        </h1>
        <p className="text-sm text-text-secondary">Manage channels you follow and users following you</p>
      </div>

      {/* Tabs Menu */}
      <div className="mb-6 flex gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('subscribed')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-4 ${
            activeTab === 'subscribed'
              ? 'border-accent-purple text-white'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          Subscribed Channels
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-4 ${
            activeTab === 'subscribers'
              ? 'border-accent-purple text-white'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          My Subscribers
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card animate-pulse border border-border" />
          ))}
        </div>
      ) : activeTab === 'subscribed' ? (
        subscribedChannels.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
            <Users className="mb-4 h-12 w-12 text-text-secondary" />
            <p className="text-text-secondary">You haven&apos;t subscribed to any channels yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/">Discover Videos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subscribedChannels.map((channel, i) => (
              <motion.div
                key={channel._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-accent-purple/30 hover:shadow-lg transition-all"
              >
                <div className="flex gap-3">
                  <Link to={`/channel/${channel.username}`}>
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={channel.avatar} />
                      <AvatarFallback>{channel.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/channel/${channel.username}`}
                      className="font-semibold text-white hover:text-accent-purple transition-colors truncate block text-sm"
                    >
                      {channel.fullname}
                    </Link>
                    <p className="text-xs text-text-secondary">@{channel.username}</p>

                    {channel.latestVideo && (
                      <Link
                        to={`/watch/${channel.latestVideo._id}`}
                        className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors min-w-0"
                      >
                        <Video className="h-3 w-3 shrink-0 text-accent-purple" />
                        <span className="truncate">Latest: {channel.latestVideo.title}</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleSubscribe(channel._id)}
                    className="h-8 text-xs font-semibold"
                  >
                    Unsubscribe
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : subscribers.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <User className="mb-4 h-12 w-12 text-text-secondary" />
          <p className="text-text-secondary">No subscribers yet. Upload quality videos to attract followers!</p>
          <Button className="mt-4" asChild>
            <Link to="/my-content">My Content</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscribers.map((sub, i) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-accent-purple/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={sub.avatar} />
                  <AvatarFallback>{sub.fullname?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate text-sm">
                    {sub.fullname}
                  </h3>
                  <p className="text-xs text-text-secondary">@{sub.username}</p>
                </div>
              </div>

              <div>
                {sub.subscribedToSubscriber ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleSubscribe(sub._id)}
                    className="h-8 gap-1.5 text-xs text-text-secondary hover:text-white"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Friends
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleSubscribe(sub._id)}
                    className="h-8 text-xs font-semibold"
                  >
                    Subscribe Back
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
