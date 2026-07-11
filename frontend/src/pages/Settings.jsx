import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Settings as SettingsIcon, ShieldAlert, Image, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAccount, changePassword, updateAvatar, updateCoverImage } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function Settings() {
  const { user, isAuthenticated, fetchCurrentUser } = useAuthStore()

  // Profile fields
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password fields
  const [oldpassword, setOldpassword] = useState('')
  const [newpassword, setNewpassword] = useState('')
  const [confpassword, setConfpassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Picture fields
  const [avatarFile, setAvatarFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  useEffect(() => {
    if (user) {
      setFullname(user.fullName || user.fullname || '')
      setEmail(user.email || '')
      setAvatarPreview(user.avatar || '')
      setCoverPreview(user.coverImage || '')
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!fullname.trim() || !email.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsUpdatingProfile(true)
    try {
      await updateAccount({ fullname: fullname.trim(), email: email.trim() })
      toast.success('Profile details updated!')
      await fetchCurrentUser()
    } catch (err) {
      toast.error(err.message || 'Failed to update profile details')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!oldpassword || !newpassword || !confpassword) {
      toast.error('All fields are required')
      return
    }
    if (newpassword !== confpassword) {
      toast.error('New password and confirm password must match')
      return
    }

    setIsUpdatingPassword(true)
    try {
      await changePassword({ oldpassword, newpassword, confpassword })
      toast.success('Password changed successfully!')
      setOldpassword('')
      setNewpassword('')
      setConfpassword('')
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('avatar', file)

    setIsUploadingAvatar(true)
    try {
      await updateAvatar(formData)
      toast.success('Avatar updated successfully!')
      await fetchCurrentUser()
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('coverImage', file)

    setIsUploadingCover(true)
    try {
      await updateCoverImage(formData)
      toast.success('Cover image updated successfully!')
      await fetchCurrentUser()
    } catch (err) {
      toast.error(err.message || 'Failed to upload cover image')
    } finally {
      setIsUploadingCover(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <SettingsIcon className="mb-4 h-16 w-16 text-accent-purple" />
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="mt-2 text-text-secondary">Log in to customize your settings.</p>
        <Button className="mt-6" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-accent-purple" />
          Settings
        </h1>
        <p className="text-sm text-text-secondary">Manage your channel details and account preferences</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Section 1: Profile Form */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-accent-purple" />
              Channel Details
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Display Full Name</Label>
                <Input
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto">
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </div>
            </form>
          </div>

          {/* Section 2: Password Form */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent-purple" />
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldpassword">Current Password</Label>
                <Input
                  id="oldpassword"
                  type="password"
                  value={oldpassword}
                  onChange={(e) => setOldpassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newpassword">New Password</Label>
                  <Input
                    id="newpassword"
                    type="password"
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confpassword">Confirm New Password</Label>
                  <Input
                    id="confpassword"
                    type="password"
                    value={confpassword}
                    onChange={(e) => setConfpassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={isUpdatingPassword} className="w-full sm:w-auto">
                  {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Section 3: Visual Elements (Avatar / Cover Image) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Channel Artwork
            </h2>

            {/* Cover Image Upload */}
            <div className="mb-6 space-y-2">
              <Label>Cover Banner</Label>
              <div className="relative group aspect-[3/1] w-full overflow-hidden rounded-xl bg-accent-purple/10 border border-border flex items-center justify-center">
                {coverPreview ? (
                  <img src={coverPreview} className="h-full w-full object-cover opacity-85" alt="Cover preview" />
                ) : (
                  <Image className="h-6 w-6 text-text-secondary" />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} disabled={isUploadingCover} />
                </label>
              </div>
              <p className="text-[10px] text-text-secondary text-center">
                {isUploadingCover ? 'Uploading cover...' : 'Hover and click camera icon to upload cover image'}
              </p>
            </div>

            {/* Avatar Image Upload */}
            <div className="space-y-2">
              <Label>Avatar Photo</Label>
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative group h-24 w-24 overflow-hidden rounded-full border border-border bg-accent-purple/10 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} className="h-full w-full object-cover" alt="Avatar preview" />
                  ) : (
                    <User className="h-10 w-10 text-text-secondary" />
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
                  </label>
                </div>
                <p className="text-[10px] text-text-secondary text-center mt-3">
                  {isUploadingAvatar ? 'Uploading avatar...' : 'Hover and click camera icon to upload profile photo'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
