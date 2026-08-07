import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Eye, EyeOff, KeyRound, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordRequest, forgotPasswordReset } from '../services/api'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Email Request, Step 2: OTP & Reset
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let interval = null
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0 && !canResend) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer, canResend])

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setIsLoading(true)
    try {
      await forgotPasswordRequest({ email })
      toast.success('Password reset OTP has been sent to your email.')
      setStep(2)
      setTimer(60)
      setCanResend(false)
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Please check your email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Password validation: minimum 6 characters and at least one symbol
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>_\W]/
    if (!symbolRegex.test(newPassword)) {
      toast.error('Password must contain at least one symbol')
      return
    }

    setIsLoading(true)
    try {
      await forgotPasswordReset({ email, otp, newPassword, confirmPassword })
      toast.success('Password reset successful! Please log in with your new password.')
      navigate('/login', { state: { bypass: true } })
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please check the OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    setIsLoading(true)
    try {
      await forgotPasswordRequest({ email })
      setTimer(60)
      setCanResend(false)
      toast.success('OTP has been resent to your email.')
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-accent-pink/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-accent-purple/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent-blue/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card relative w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-accent-purple/10"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Vid<span className="text-accent-purple">tube</span>
          </span>
        </Link>

        <h1 className="mb-2 text-center text-xl font-bold text-white">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h1>
        <p className="mb-6 text-center text-sm text-text-secondary">
          {step === 1
            ? 'Enter your email to receive a password reset verification code.'
            : `Enter the code sent to ${email} and your new password.`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-xs text-text-secondary hover:text-white mt-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="pl-10 text-center text-lg font-bold letter-spacing-4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="flex items-center justify-between text-xs mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className={`text-accent-purple hover:underline ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {canResend ? 'Resend Code' : `Resend in ${timer}s`}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-text-secondary hover:underline"
              >
                Change Email
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
