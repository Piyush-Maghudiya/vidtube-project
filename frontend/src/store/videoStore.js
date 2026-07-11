import { create } from 'zustand'
import {
  getVideos,
  getVideoById,
  getChannelProfile,
  toggleVideoLike,
  toggleSubscription,
  uploadVideo as uploadVideoApi,
} from '../services/api'
import useAuthStore from './authStore'
import { normalizeVideo, normalizeChannel } from '../lib/utils'

const useVideoStore = create((set, get) => ({
  videos: [],
  currentVideo: null,
  channel: null,
  comments: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  useMock: false,

  fetchVideos: async (reset = true) => {
    const page = reset ? 1 : get().page
    set({
      isLoading: reset,
      isLoadingMore: !reset,
      error: null,
      ...(reset && { videos: [], page: 1, hasMore: true }),
    })
    try {
      const { data } = await getVideos({ page, limit: 8 })
      const rawVideos = data.data?.docs || data.data || []
      const newVideos = rawVideos.map(normalizeVideo)
      set((state) => ({
        videos: reset ? newVideos : [...state.videos, ...newVideos],
        page: page + 1,
        hasMore: newVideos.length >= 8,
        isLoading: false,
        isLoadingMore: false,
        useMock: false,
      }))
    } catch (err) {
      set({
        videos: [],
        hasMore: false,
        page: page + 1,
        isLoading: false,
        isLoadingMore: false,
        error: err.message || 'Failed to fetch videos',
        useMock: false,
      })
    }
  },

  loadMoreVideos: async () => {
    const { hasMore, isLoadingMore } = get()
    if (!hasMore || isLoadingMore) return
    await get().fetchVideos(false)
  },

  fetchVideoById: async (videoId) => {
    set({ isLoading: true, error: null, currentVideo: null })
    try {
      const { data } = await getVideoById(videoId)
      set({ currentVideo: normalizeVideo(data.data), isLoading: false, useMock: false })
    } catch (err) {
      set({ currentVideo: null, isLoading: false, error: err.message, useMock: false })
    }
  },

  fetchChannel: async (username) => {
    set({ isLoading: true, error: null, channel: null })
    try {
      const { data } = await getChannelProfile(username)
      set({ channel: normalizeChannel(data.data), isLoading: false, useMock: false })
    } catch (err) {
      set({ channel: null, isLoading: false, error: err.message, useMock: false })
    }
  },

  toggleLike: async (videoId) => {
    try {
      await toggleVideoLike(videoId)
      set((state) => {
        if (!state.currentVideo || state.currentVideo._id !== videoId) return state
        const isLiked = !state.currentVideo.isLiked
        return {
          currentVideo: {
            ...state.currentVideo,
            isLiked,
            likesCount: (state.currentVideo.likesCount || 0) + (isLiked ? 1 : -1),
          },
        }
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  toggleSubscribe: async (channelId, options = {}) => {
    const { channel, currentVideo } = get()
    const isSubscribed = options.isSubscribed ?? channel?.isSubscribed ?? false

    try {
      await toggleSubscription(channelId)
    } catch (err) {
      return { success: false, error: err.message }
    }

    if (channel?._id === channelId) {
      set({
        channel: {
          ...channel,
          isSubscribed: !isSubscribed,
          subscribersCount: (channel.subscribersCount || 0) + (isSubscribed ? -1 : 1),
        },
      })
    }

    if (currentVideo?.owner?._id === channelId) {
      set({
        currentVideo: {
          ...currentVideo,
          owner: { ...currentVideo.owner, isSubscribed: !isSubscribed },
        },
      })
    }

    return { success: true }
  },

  uploadVideo: async (formData, onProgress) => {
    try {
      const { data } = await uploadVideoApi(formData, onProgress)
      const newVideo = data.data
      set((state) => ({ videos: [newVideo, ...state.videos] }))
      return { success: true, video: newVideo }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to upload video' }
    }
  },
}))

export default useVideoStore
