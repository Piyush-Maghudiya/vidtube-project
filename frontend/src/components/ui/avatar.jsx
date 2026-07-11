import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-border', className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-accent-purple/20 text-accent-purple font-semibold', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
