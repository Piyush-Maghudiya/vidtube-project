import { useState } from 'react'
import { LifeBuoy, HelpCircle, Mail, MessageSquare, ChevronDown, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function Support() {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      q: 'How do I upload a video?',
      a: 'Click the "+" button in the top right navbar, choose "Upload video", fill in the title, description, video file, and thumbnail, then click upload. You can manage uploaded videos from the "My Content" page.',
    },
    {
      id: 2,
      q: 'How do I add a video to a playlist?',
      a: 'While watching a video, click the "Save" button below the player. You can select an existing playlist or create a new one to immediately add the video.',
    },
    {
      id: 3,
      q: 'Can I delete comments I wrote?',
      a: 'Yes. If you hover over a comment you wrote, Edit and Delete action icons will appear on the right side of your comment. Click delete to remove it.',
    },
    {
      id: 4,
      q: 'How is watch history updated?',
      a: 'Whenever you watch a video page while logged in, that video is automatically appended to your watch history. You can view all previously watched videos in the "History" tab.',
    },
    {
      id: 5,
      q: 'How do I subscribe or unsubscribe from channels?',
      a: 'Click the "Subscribe" button next to the channel owner details underneath any video, or on the channel profiles. Go to the "Subscribers" tab in the sidebar to review and manage all your subscriptions.',
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Your support ticket has been submitted. We will contact you soon!')
      setSubject('')
      setCategory('general')
      setMessage('')
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-accent-purple" />
          Support & Help
        </h1>
        <p className="text-sm text-text-secondary">Get assistance or look up answers to common queries</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left column: FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-accent-purple" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id
              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between p-4 text-left font-medium text-white hover:text-accent-purple transition-colors"
                  >
                    <span className="text-sm">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-text-secondary transition-transform ${
                        isOpen ? 'rotate-180 text-accent-purple' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/50 bg-background/35 p-4 text-xs leading-relaxed text-text-secondary">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: Ticket Form */}
        <div className="rounded-2xl border border-border bg-card p-6 h-fit">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-accent-purple" />
            Contact Support
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Inquiry Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-white focus:outline-none focus:border-accent-purple"
              >
                <option value="general">General Question</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing issue</option>
                <option value="bug">Report a Bug</option>
                <option value="feedback">Feedback / Suggestion</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-message">Message *</Label>
              <Textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed description of your question or issue..."
                rows={5}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                {isSubmitting ? 'Sending ticket...' : 'Submit Support Ticket'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
