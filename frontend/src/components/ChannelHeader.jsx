import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, UserCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { formatSubscribers } from '@/lib/utils'
import useVideoStore from '@/store/videoStore'
import { toast } from 'sonner'

const CHANNEL_TABS = ['Videos', 'Playlists', 'Tweets', 'Following']

export default function ChannelHeader({ channel, activeTab, onTabChange }) {
  const { toggleSubscribe } = useVideoStore()
  const [subscribing, setSubscribing] = useState(false)

  if (!channel) return null

  const handleFollow = async () => {
    setSubscribing(true)
    const result = await toggleSubscribe(channel._id)
    setSubscribing(false)
    if (result?.success) {
      toast.success(channel.isSubscribed ? 'Unsubscribed' : 'Subscribed!')
    }
  }

  return (
    <div className="mb-6">
      <div className="gradient-banner h-[180px] rounded-xl sm:h-[250px]" />

      <div className="relative -mt-12 flex flex-col gap-4 px-2 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between sm:px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
            <AvatarImage src={channel.avatar} alt={channel.fullName} />
            <AvatarFallback className="text-2xl">{channel.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white sm:text-3xl"
            >
              {channel.fullName}
            </motion.h1>
            <p className="text-text-secondary">@{channel.username}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {formatSubscribers(channel.subscribersCount)} Subscribers •{' '}
              {formatSubscribers(channel.subscribedToCount || 0)} Following
            </p>
          </div>
        </div>

        <Button
          onClick={handleFollow}
          disabled={subscribing}
          variant={channel.isSubscribed ? 'outline' : 'default'}
          className="w-full sm:w-auto"
        >
          {channel.isSubscribed ? (
            <>
              <UserCheck className="h-4 w-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Follow
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="mt-8 px-2 sm:px-4">
        <TabsList>
          {CHANNEL_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
