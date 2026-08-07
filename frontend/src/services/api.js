import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    error.message = message
    return Promise.reject(error)
  }
)

export default api

// Auth
export const registerUser = (formData) =>
  api.post('/api/v1/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const loginUser = (credentials) =>
  api.post('/api/v1/users/login', credentials)

export const logoutUser = () => api.post('/api/v1/users/logout')

export const getCurrentUser = () => api.get('/api/v1/users/current-user')

export const verifyOtp = (data) => api.post('/api/v1/users/verify-otp', data)
export const resendOtp = (data) => api.post('/api/v1/users/resend-otp', data)
export const forgotPasswordRequest = (data) => api.post('/api/v1/users/forgot-password-request', data)
export const forgotPasswordReset = (data) => api.post('/api/v1/users/forgot-password-reset', data)

export const getAdminStats = () => api.get('/api/v1/admin/stats')
export const getAdminUsers = () => api.get('/api/v1/admin/users')
export const getAdminVideos = () => api.get('/api/v1/admin/videos')

// Videos  (backend mounts at /api/v1/video — singular)
export const getVideos = (params) => api.get('/api/v1/video/', { params })

export const getVideoById = (videoId) => api.get(`/api/v1/video/${videoId}`)

export const uploadVideo = (formData, onProgress) =>
  api.post('/api/v1/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    }
  })

export const deleteVideo = (videoId) => api.delete(`/api/v1/video/${videoId}`)

// Channels
export const getChannelProfile = (username) =>
  api.get(`/api/v1/users/c/${username}`)

// Subscriptions  (backend mounts at /api/v1/subcriptions — with typo)
// Backend uses a single POST toggle — no separate DELETE route
export const toggleSubscription = (channelId) =>
  api.post(`/api/v1/subcriptions/c/${channelId}`)

// Likes
export const toggleVideoLike = (videoId) =>
  api.post(`/api/v1/likes/toggle/v/${videoId}`)

// Playlists  (backend mounts at /api/v1/playlist — singular)
export const getPlaylists = (userId) =>
  api.get(`/api/v1/playlist/user/${userId}`)

export const getPlaylistById = (playlistId) =>
  api.get(`/api/v1/playlist/${playlistId}`)

export const createPlaylist = (data) => api.post('/api/v1/playlist', data)

export const addVideoToPlaylist = (playlistId, videoId) =>
  api.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`)

export const removeVideoFromPlaylist = (playlistId, videoId) =>
  api.patch(`/api/v1/playlist/remove/${videoId}/${playlistId}`)

// Comments
export const getVideoComments = (videoId, params) =>
  api.get(`/api/v1/comment/${videoId}`, { params })

export const addComment = (videoId, content) =>
  api.post(`/api/v1/comment/${videoId}`, { content })

// Watch History & Liked Videos
export const getWatchHistory = () => api.get('/api/v1/users/history')
export const getLikedVideos = () => api.get('/api/v1/likes/videos')

// Subscribers / Subscriptions
export const getSubscribers = (channelId) => api.get(`/api/v1/subcriptions/c/${channelId}`)
export const getSubscribedChannels = (subscriberId) => api.get(`/api/v1/subcriptions/u/${subscriberId}`)

// Comments actions
export const updateComment = (commentId, content) => api.patch(`/api/v1/comment/${commentId}`, { content })
export const deleteComment = (commentId) => api.delete(`/api/v1/comment/${commentId}`)
export const toggleCommentLike = (commentId) => api.post(`/api/v1/likes/toggle/c/${commentId}`)

// Playlists actions
export const updatePlaylist = (playlistId, data) => api.patch(`/api/v1/playlist/${playlistId}`, data)
export const deletePlaylist = (playlistId) => api.delete(`/api/v1/playlist/${playlistId}`)

// Video actions
export const updateVideo = (videoId, formData) =>
  api.patch(`/api/v1/video/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Settings & Profile actions
export const updateAccount = (data) => api.patch('/api/v1/users/update-account', data)
export const changePassword = (data) => api.post('/api/v1/users/change-password', data)
export const updateAvatar = (formData) =>
  api.patch('/api/v1/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const updateCoverImage = (formData) =>
  api.patch('/api/v1/users/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Creator Dashboard
export const getChannelStats = () => api.get('/api/v1/dashboard/stats')
export const getChannelVideos = () => api.get('/api/v1/dashboard/videos')

// Tweets
export const getUserTweets = (userId) => api.get(`/api/v1/tweets/users/${userId}`)
export const createTweet = (data) => api.post('/api/v1/tweets', data)
export const deleteTweet = (tweetId) => api.delete(`/api/v1/tweets/${tweetId}`)
export const toggleTweetLike = (tweetId) => api.post(`/api/v1/likes/toggle/t/${tweetId}`)
