import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Upload, Image, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  })
  const avatarRef = useRef(null)
  const coverRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFilePreview = (file, setter) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setter(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('fullname', form.fullName)
    formData.append('username', form.username)
    formData.append('email', form.email)
    formData.append('password', form.password)
    if (avatarRef.current?.files[0]) formData.append('avatar', avatarRef.current.files[0])
    if (coverRef.current?.files[0]) formData.append('coverImage', coverRef.current.files[0])

    const result = await register(formData)
    if (result.success) {
      localStorage.setItem('isRegistered', 'true')
      toast.success('Account created!')
      navigate('/')
    } else {
      toast.error(result.message || 'Registration failed.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-accent-pink/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-accent-purple/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card relative w-full max-w-lg rounded-2xl p-8"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Vid<span className="text-accent-purple">tube</span>
          </span>
        </Link>

        <h1 className="mb-6 text-center text-xl font-bold text-white">Create your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Avatar</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-4 transition-colors hover:border-accent-purple">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-text-secondary" />
                )}
                <span className="text-xs text-text-secondary">Upload avatar</span>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilePreview(e.target.files[0], setAvatarPreview)}
                />
              </label>
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-4 transition-colors hover:border-accent-purple">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="h-16 w-full rounded object-cover" />
                ) : (
                  <Image className="h-6 w-6 text-text-secondary" />
                )}
                <span className="text-xs text-text-secondary">Upload cover</span>
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilePreview(e.target.files[0], setCoverPreview)}
                />
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" state={{ bypass: true }} className="text-accent-purple hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
