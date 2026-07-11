import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import Channel from './pages/Channel'
import Watch from './pages/Watch'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PlaceholderPage from './pages/PlaceholderPage'
import Collections from './pages/Collections'
import LikedVideos from './pages/LikedVideos'
import WatchHistory from './pages/WatchHistory'
import MyContent from './pages/MyContent'
import PlaylistDetail from './pages/PlaylistDetail'
import Subscribers from './pages/Subscribers'
import Settings from './pages/Settings'
import Support from './pages/Support'
import CreatorStudio from './pages/CreatorStudio'
import useAuthStore from './store/authStore'

export default function App() {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser)

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="channel/:username" element={<Channel />} />
            <Route path="liked" element={<LikedVideos />} />
            <Route path="history" element={<WatchHistory />} />
            <Route path="my-content" element={<MyContent />} />
            <Route path="collections" element={<Collections />} />
            <Route path="playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="support" element={<Support />} />
            <Route path="settings" element={<Settings />} />
            <Route path="studio" element={<CreatorStudio />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#121212',
              border: '1px solid #222222',
              color: '#fff',
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
