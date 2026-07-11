import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex h-12 items-center gap-6 border-b border-border w-full', className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-1 pb-3 text-sm font-medium text-text-secondary transition-all border-b-2 border-transparent -mb-px data-[state=active]:text-white data-[state=active]:border-accent-purple hover:text-white',
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-6 focus-visible:outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
