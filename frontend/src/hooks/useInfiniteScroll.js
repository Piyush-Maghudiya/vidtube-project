import { useEffect, useRef, useCallback } from 'react'

export default function useInfiniteScroll({ onLoadMore, hasMore, isLoading }) {
  const observerRef = useRef(null)

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore()
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      )

      if (node) observerRef.current.observe(node)
    },
    [onLoadMore, hasMore, isLoading]
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  return lastElementRef
}
