import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ChannelHeader from '@/components/ChannelHeader'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import useVideoStore from '@/store/videoStore'
import usePlaylistStore from '@/store/playlistStore'
import useAuthStore from '@/store/authStore'
import { ListMusic, ThumbsUp, Trash2, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getUserTweets, createTweet, deleteTweet, toggleTweetLike } from '@/services/api'
import { toast } from 'sonner'

export default function Channel() {
  const { username } = useParams()
  const [activeTab, setActiveTab] = useState('videos')
  const { channel, isLoading, fetchChannel } = useVideoStore()
  const { playlists, fetchPlaylists } = usePlaylistStore()
  const { user } = useAuthStore()
  const isOwnChannel = user?.username === username

  useEffect(() => {
    if (username) fetchChannel(username)
  }, [username, fetchChannel])

  useEffect(() => {
    if (activeTab === 'playlists' && isOwnChannel) fetchPlaylists()
  }, [activeTab, isOwnChannel, fetchPlaylists])

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <div className="mt-8 flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const channelVideos = channel?.videos || []

  return (
    <div>
      <ChannelHeader
        channel={channel}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'videos' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {channelVideos.length > 0 ? (
            channelVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} showChannel={false} />
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-text-secondary">
              No videos uploaded yet.
            </p>
          )}
        </motion.div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isOwnChannel && playlists.length > 0 ? (
            playlists.map((pl) => (
              <div
                key={pl._id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/20">
                  <ListMusic className="h-5 w-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pl.name}</h3>
                  <p className="text-xs text-text-secondary">{pl.videoCount ?? 0} videos</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-text-secondary">
              {isOwnChannel ? 'No playlists yet. Create one from your profile menu.' : 'No public playlists.'}
            </p>
          )}
        </div>
      )}

      {activeTab === 'following' && (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-text-secondary">Following list coming soon</p>
        </div>
      )}

      {activeTab === 'tweets' && (
        <ChannelTweets channelId={channel._id} isOwnChannel={isOwnChannel} />
      )}
    </div>
  )
}

function ChannelTweets({ channelId, isOwnChannel }) {
  const [tweets, setTweets] = useState([])
  const [newTweet, setNewTweet] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuthStore()

  const fetchTweets = async () => {
    try {
      setIsLoading(true)
      const { data } = await getUserTweets(channelId)
      setTweets(data.data || [])
    } catch (err) {
      console.error('Failed to fetch channel tweets:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (channelId) fetchTweets()
  }, [channelId])

  const handlePostTweet = async (e) => {
    e.preventDefault()
    if (!newTweet.trim()) return
    try {
      const { data } = await createTweet({ content: newTweet.trim() })
      toast.success('Community post shared!')
      setNewTweet('')
      const tweetOwner = {
        username: user.username,
        fullname: user.fullName || user.fullname,
        avatar: user.avatar
      }
      setTweets([{ ...data.data, owner: tweetOwner, tweetlikescount: 0, istweetliked: false }, ...tweets])
    } catch (err) {
      toast.error('Failed to share post')
    }
  }

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await deleteTweet(tweetId)
      toast.success('Post deleted')
      setTweets(tweets.filter((t) => t._id !== tweetId))
    } catch (err) {
      toast.error('Failed to delete post')
    }
  }

  const handleLikeTweet = async (tweetId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts')
      return
    }
    try {
      await toggleTweetLike(tweetId)
      setTweets(
        tweets.map((t) => {
          if (t._id === tweetId) {
            const liked = !t.istweetliked
            return {
              ...t,
              istweetliked: liked,
              tweetlikescount: (t.tweetlikescount || 0) + (liked ? 1 : -1)
            }
          }
          return t
        })
      )
    } catch (err) {
      toast.error('Failed to update like')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 w-full rounded-xl bg-card animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {isOwnChannel && (
        <form onSubmit={handlePostTweet} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <Textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="Share something with your community..."
            rows={3}
            className="bg-background resize-none text-sm"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" className="gap-2">
              <Send className="h-3.5 w-3.5" />
              Post
            </Button>
          </div>
        </form>
      )}

      {tweets.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-text-secondary">
          No community posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet, i) => {
            const isOwner = isAuthenticated && user && tweet.owner?._id === user._id
            const avatarSrc = typeof tweet.owner?.avatar === 'object' ? tweet.owner.avatar?.url : tweet.owner?.avatar

            return (
              <motion.div
                key={tweet._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4 flex gap-3 group"
              >
                <Avatar className="h-10 w-10 shrink-0 border border-border">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{tweet.owner?.fullname?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-white text-sm block sm:inline">
                        {tweet.owner?.fullname || tweet.owner?.username}
                      </span>
                      <span className="text-xs text-text-secondary sm:ml-2">
                        @{tweet.owner?.username}
                      </span>
                    </div>

                    {isOwnChannel && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTweet(tweet._id)}
                        className="h-7 w-7 text-text-secondary hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete post"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-text-secondary break-words leading-relaxed">
                    {tweet.content}
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => handleLikeTweet(tweet._id)}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                        tweet.istweetliked ? 'text-accent-purple' : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${tweet.istweetliked ? 'fill-accent-purple' : ''}`} />
                      <span>{tweet.tweetlikescount || 0}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
