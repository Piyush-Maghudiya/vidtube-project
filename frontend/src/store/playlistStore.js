import { create } from 'zustand'
import {
  getPlaylists,
  createPlaylist as createPlaylistApi,
  addVideoToPlaylist as addVideoToPlaylistApi,
  removeVideoFromPlaylist as removeVideoFromPlaylistApi,
} from '../services/api'
import useAuthStore from './authStore'

const DEFAULT_PLAYLISTS = [
  {
    _id: 'pl-1',
    name: 'React Tutorials',
    description: 'Best React learning resources',
    videoCount: 4,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    _id: 'pl-2',
    name: 'Watch Later',
    description: 'Videos to watch later',
    videoCount: 12,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
]

const usePlaylistStore = create((set, get) => ({
  playlists: [],
  isLoading: false,

  fetchPlaylists: async () => {
    set({ isLoading: true })
    try {
      const user = useAuthStore.getState().user
      if (!user?._id) {
        const stored = getStoredPlaylists()
        set({ playlists: stored.length ? stored : DEFAULT_PLAYLISTS, isLoading: false })
        return
      }
      const { data } = await getPlaylists(user._id)
      set({ playlists: data.data || [], isLoading: false })
    } catch {
      const stored = getStoredPlaylists()
      set({ playlists: stored.length ? stored : DEFAULT_PLAYLISTS, isLoading: false })
    }
  },

  createPlaylist: async ({ name, description }) => {
    try {
      const { data } = await createPlaylistApi({ name, description })
      const playlist = data.data
      set((state) => {
        const next = [playlist, ...state.playlists]
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true, playlist }
    } catch {
      const user = useAuthStore.getState().user
      const playlist = {
        _id: `pl-${Date.now()}`,
        name,
        description: description || '',
        videoCount: 0,
        owner: user?._id,
        createdAt: new Date().toISOString(),
      }
      set((state) => {
        const next = [playlist, ...state.playlists]
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true, playlist, mock: true }
    }
  },

  addVideoToPlaylist: async (playlistId, videoId) => {
    try {
      const { data } = await addVideoToPlaylistApi(playlistId, videoId)
      const updatedPlaylist = data.data
      set((state) => {
        const next = state.playlists.map((pl) =>
          pl._id === playlistId ? { ...pl, ...updatedPlaylist } : pl
        )
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true }
    } catch (err) {
      // Fallback
      set((state) => {
        const next = state.playlists.map((pl) => {
          if (pl._id === playlistId) {
            const currentVideos = pl.videos || []
            const hasVideo = currentVideos.some((v) => (v._id || v) === videoId)
            const nextVideos = hasVideo ? currentVideos : [...currentVideos, videoId]
            return {
              ...pl,
              videos: nextVideos,
              videoCount: nextVideos.length,
              totalvideos: nextVideos.length,
            }
          }
          return pl
        })
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true, mock: true }
    }
  },

  removeVideoFromPlaylist: async (playlistId, videoId) => {
    try {
      const { data } = await removeVideoFromPlaylistApi(playlistId, videoId)
      const updatedPlaylist = data.data
      set((state) => {
        const next = state.playlists.map((pl) =>
          pl._id === playlistId ? { ...pl, ...updatedPlaylist } : pl
        )
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true }
    } catch (err) {
      // Fallback
      set((state) => {
        const next = state.playlists.map((pl) => {
          if (pl._id === playlistId) {
            const nextVideos = (pl.videos || []).filter((v) => (v._id || v) !== videoId)
            return {
              ...pl,
              videos: nextVideos,
              videoCount: nextVideos.length,
              totalvideos: nextVideos.length,
            }
          }
          return pl
        })
        persistPlaylists(next)
        return { playlists: next }
      })
      return { success: true, mock: true }
    }
  },
}))

function getStoredPlaylists() {
  try {
    const raw = localStorage.getItem('vidtube-playlists')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistPlaylists(playlists) {
  try {
    localStorage.setItem('vidtube-playlists', JSON.stringify(playlists))
  } catch {
    // ignore quota errors
  }
}

export default usePlaylistStore
