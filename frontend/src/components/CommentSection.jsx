import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Edit2, Trash2, ThumbsUp, X, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { timeAgo, normalizeComment } from '@/lib/utils'
import { getVideoComments, addComment, updateComment, deleteComment, toggleCommentLike } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function CommentSection({ videoId }) {
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!videoId) return

    const fetchComments = async () => {
      setIsLoading(true)
      try {
        const { data } = await getVideoComments(videoId)
        const rawComments = data.data?.docs || data.data || []
        setLocalComments(rawComments.map(normalizeComment))
      } catch (err) {
        console.error('Failed to fetch comments:', err)
        setLocalComments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please log in to comment')
      return
    }
    if (!newComment.trim()) return

    try {
      const { data } = await addComment(videoId, newComment.trim())
      const rawComment = data.data

      const commentOwner = rawComment.owner && typeof rawComment.owner === 'object'
        ? rawComment.owner
        : {
            _id: user._id,
            fullName: user.fullName || user.fullname || '',
            username: user.username,
            avatar: user.avatar
          }

      const comment = normalizeComment({
        ...rawComment,
        owner: commentOwner
      })

      setLocalComments([comment, ...localComments])
      setNewComment('')
      toast.success('Comment added')
    } catch (err) {
      toast.error(err.message || 'Failed to add comment')
    }
  }

  const handleEditInit = (comment) => {
    setEditingCommentId(comment._id)
    setEditingText(comment.content)
  }

  const handleEditSave = async (commentId) => {
    if (!editingText.trim()) return
    try {
      await updateComment(commentId, editingText.trim())
      setLocalComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, content: editingText.trim() } : c
        )
      )
      setEditingCommentId(null)
      toast.success('Comment updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(commentId)
      setLocalComments((prev) => prev.filter((c) => c._id !== commentId))
      toast.success('Comment deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment')
    }
  }

  const handleToggleLike = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to like comments')
      return
    }
    try {
      await toggleCommentLike(commentId)
      setLocalComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            const isLiked = !c.isLiked
            return {
              ...c,
              isLiked,
              likesCount: c.likesCount + (isLiked ? 1 : -1)
            }
          }
          return c
        })
      )
    } catch (err) {
      toast.error(err.message || 'Failed to update comment like')
    }
  }

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        {localComments.length} Comments
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.fullName?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newComment.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-center text-text-secondary text-sm">Loading comments...</p>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment, i) => {
            const isOwner = isAuthenticated && user && comment.owner?._id === user._id
            const isEditing = editingCommentId === comment._id

            return (
              <motion.div
                key={comment._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 group"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={comment.owner?.avatar} />
                  <AvatarFallback>{comment.owner?.fullName?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white">
                      {comment.owner?.fullName || comment.owner?.username || 'Anonymous'}{' '}
                      <span className="font-normal text-text-secondary">
                        • {timeAgo(comment.createdAt)}
                      </span>
                    </p>

                    {isOwner && !isEditing && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditInit(comment)}
                          className="h-7 w-7 text-text-secondary hover:text-white"
                          title="Edit comment"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="h-7 w-7 text-text-secondary hover:text-red-500 hover:bg-red-500/10"
                          title="Delete comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="h-8 py-1 text-sm flex-1 bg-background"
                      />
                      <Button
                        size="icon"
                        onClick={() => handleEditSave(comment._id)}
                        className="h-8 w-8 shrink-0 bg-green-600 hover:bg-green-700"
                        title="Save changes"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setEditingCommentId(null)}
                        className="h-8 w-8 shrink-0"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="mt-1 text-sm text-text-secondary break-words">{comment.content}</p>
                      
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleLike(comment._id)}
                          className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                            comment.isLiked ? 'text-accent-purple' : 'text-text-secondary hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-accent-purple' : ''}`} />
                          <span>{comment.likesCount || 0}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
