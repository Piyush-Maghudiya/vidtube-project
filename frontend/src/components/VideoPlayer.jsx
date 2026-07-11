import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function VideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (video.muted) {
      setVolume(0)
    } else {
      setVolume(video.volume || 1)
    }
  }

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = newVol
      videoRef.current.muted = newVol === 0
    }
    setVolume(newVol)
    setMuted(newVol === 0)
  }



  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    video.currentTime = pct * video.duration
  }

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-black aspect-video">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
          aria-label={`Play ${title}`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-purple/90 shadow-lg shadow-accent-purple/50">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <div
          className="mb-2 h-1 cursor-pointer rounded-full bg-white/30"
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full bg-accent-purple transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-accent-purple cursor-pointer">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-1.5">
            <button onClick={toggleMute} className="text-white hover:text-accent-purple cursor-pointer">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1 w-16 cursor-pointer accent-accent-purple bg-white/20 rounded-lg appearance-none"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-[10px] font-bold text-white hover:text-accent-purple bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
              title="Playback speed"
            >
              {speed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-border rounded-lg p-1 flex flex-col gap-1 min-w-[70px] shadow-xl z-50">
                {[1, 1.25, 1.5, 1.75, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.playbackRate = s
                      setSpeed(s)
                      setShowSpeedMenu(false)
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-semibold text-center cursor-pointer transition-colors ${
                      speed === s
                        ? 'bg-accent-purple text-white'
                        : 'text-text-secondary hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen} className="ml-auto text-white hover:text-accent-purple cursor-pointer">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
