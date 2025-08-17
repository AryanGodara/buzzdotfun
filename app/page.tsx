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
    openGraph: {
      title: 'Buzz.fun',
      description:
        'Are you buzzing enough? Check your creator score, compare with friends, and unlock funding based on your social influence. Top creators get the best rates. See where you stand!',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <BuzzApp />
}
