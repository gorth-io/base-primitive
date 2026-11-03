"use client"

import { Button } from '@/components/custom/button'
import { LucideIcon, TriangleAlert } from "lucide-react"
import { useRouter } from 'next/navigation'
import { cn } from 'cn'

export default function MiscellaneousLayout({
  name = 404,
  icon: Icon = TriangleAlert,
  color = "text-muted-foreground",
  title = "Error",
  description = ["Error", "Description"],
}: {
  name: number
  icon: LucideIcon
  color: string
  title: string
  description: [string, string]
}) {
  const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-9xl leading-tight font-bold'>{name}</h1>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <span className='font-medium'>{title}</span>
          <Icon className={cn('size-4', color)} />
        </div>
        <p className='text-center text-muted-foreground'>
          {description[0]} <br /> {description[1]}
          {/*description.map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))*/}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}