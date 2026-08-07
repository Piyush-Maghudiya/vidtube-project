import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import useAuthStore from './store/authStore'

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'))
const Channel = lazy(() => import('./pages/Channel'))
const Watch = lazy(() => import('./pages/Watch'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Collections = lazy(() => import('./pages/Collections'))
const LikedVideos = lazy(() => import('./pages/LikedVideos'))
const WatchHistory = lazy(() => import('./pages/WatchHistory'))
const MyContent = lazy(() => import('./pages/MyContent'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'))
const Subscribers = lazy(() => import('./pages/Subscribers'))
const Settings = lazy(() => import('./pages/Settings'))
const Support = lazy(() => import('./pages/Support'))
const CreatorStudio = lazy(() => import('./pages/CreatorStudio'))

// Dynamic loading spinner fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#0f0f0f]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
  </div>
)

export default function App() {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser)
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth)

  useEffect(() => {
    fetchCurrentUser()
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [fetchCurrentUser])

  if (isCheckingAuth) {
    return <PageLoader />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Suspense>
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
