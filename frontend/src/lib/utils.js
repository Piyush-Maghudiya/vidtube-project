import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatViews(count) {
  if (!count && count !== 0) return '0 views'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K views`
  return `${count} views`
}

export function formatSubscribers(count) {
  if (!count && count !== 0) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`
  return String(count)
}

export function timeAgo(date) {
  if (!date) return 'Recently'
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

// --- Data normalization helpers ---
// Backend uses different field names than frontend expects.
// These helpers transform backend responses so components work consistently.

/** Normalize a user/owner object from backend format to frontend format */
export function normalizeUser(user) {
  if (!user) return user
  return {
    ...user,
    fullName: user.fullName || user.fullname || '',
    isSubscribed: user.isSubscribed ?? user.issubscribed ?? false,
    avatar: typeof user.avatar === 'object' ? user.avatar?.url : user.avatar,
    coverImage: typeof user.coverImage === 'object' ? user.coverImage?.url : user.coverImage,
  }
}

/** Normalize a channel profile from backend format to frontend format */
export function normalizeChannel(ch) {
  if (!ch) return ch
  return {
    ...ch,
    fullName: ch.fullName || ch.fullname || '',
    avatar: typeof ch.avatar === 'object' ? ch.avatar?.url : ch.avatar,
    coverImage: typeof ch.coverImage === 'object' ? ch.coverImage?.url : ch.coverImage,
    subscribersCount: ch.subscribersCount ?? ch.subscribercount ?? 0,
    subscribedToCount: ch.subscribedToCount ?? ch.chhanelsubscribedtocount ?? 0,
    isSubscribed: ch.isSubscribed ?? ch.issubcribed ?? false,
  }
}

/** Normalize a video object from backend format to frontend format */
export function normalizeVideo(video) {
  if (!video) return video
  return {
    ...video,
    likesCount: video.likesCount ?? video.likescount ?? 0,
    isLiked: video.isLiked ?? video.isliked ?? false,
    owner: video.owner ? normalizeUser(video.owner) : video.owner,
  }
}

/** Normalize a comment object from backend format to frontend format */
export function normalizeComment(comment) {
  if (!comment) return comment
  return {
    ...comment,
    owner: comment.owner ? {
      ...comment.owner,
      fullName: comment.owner.fullName || comment.owner.fullname || '',
      avatar: typeof comment.owner.avatar === 'object' ? comment.owner.avatar?.url : comment.owner.avatar,
    } : comment.owner
  }
}

