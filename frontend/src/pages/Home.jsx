import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'
import useVideoStore from '@/store/videoStore'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

const CATEGORIES = ['All', 'Education', 'Vlogs', 'Coding', 'Music', 'Gaming']

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const { videos, isLoading, isLoadingMore, hasMore, fetchVideos, loadMoreVideos } =
    useVideoStore()

  useEffect(() => {
    fetchVideos(true)
  }, [fetchVideos])

  const lastRef = useInfiniteScroll({
    onLoadMore: loadMoreVideos,
    hasMore,
    isLoading: isLoadingMore,
  })

  const displayVideos = videos.filter((v) => {
    const matchesQuery = query
      ? v.title?.toLowerCase().includes(query) ||
        v.owner?.fullName?.toLowerCase().includes(query) ||
        v.owner?.username?.toLowerCase().includes(query)
      : true

    let matchesCategory = false
    if (selectedCategory === 'All') {
      matchesCategory = true
    } else if (selectedCategory === 'Education') {
      const eduKeywords = ['education', 'tutorial', 'course', 'learn', 'react', 'js', 'javascript', 'coding', 'programming', 'teach', 'science', 'math', 'guide']
      const titleLower = v.title?.toLowerCase() || ''
      const descLower = v.description?.toLowerCase() || ''
      matchesCategory = eduKeywords.some((keyword) => titleLower.includes(keyword) || descLower.includes(keyword))
    } else {
      matchesCategory = v.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                        v.description?.toLowerCase().includes(selectedCategory.toLowerCase())
    }

    return matchesQuery && matchesCategory
  })

  return (
    <div>
      {/* Category Pills */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30'
                : 'bg-card text-text-secondary border border-border hover:bg-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {query && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl font-semibold text-white"
        >
          Search results for &quot;{searchParams.get('q')}&quot;
        </motion.h2>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : displayVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
      </div>

      {!isLoading && displayVideos.length === 0 && (
        <p className="py-16 text-center text-text-secondary">No videos found.</p>
      )}

      {!isLoading && hasMore && !query && (
        <div ref={lastRef} className="flex justify-center py-8">
          {isLoadingMore && (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
