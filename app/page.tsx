import { BuzzApp } from '@/components/BuzzApp'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/logo.png`,
  button: {
    title: 'Rate My Buzz',
    action: {
      type: 'launch_frame',
      name: 'Buzz.fun',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Buzz.fun',
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <BuzzApp />
}
