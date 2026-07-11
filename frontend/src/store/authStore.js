import { create } from 'zustand'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/api'
import { normalizeUser } from '../lib/utils'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await getCurrentUser()
      set({ user: normalizeUser(data.data), isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await loginUser(credentials)
      set({ user: normalizeUser(data.data.user), isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      return { success: false, message: err.message }
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await registerUser(formData)
      set({ user: normalizeUser(data.data), isAuthenticated: true, isLoading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.message, isLoading: false })
      return { success: false, message: err.message }
    }
  },

  logout: async () => {
    try {
      await logoutUser()
    } catch {
      // clear local state even if API fails
    }
    set({ user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
