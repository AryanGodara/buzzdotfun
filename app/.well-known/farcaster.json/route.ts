import { NextResponse } from 'next/server'
import { APP_URL } from '../../../lib/constants'

export async function GET() {
  const farcasterConfig = {
    frame: {
      name: 'Buzz.fun',
      version: '1',
      iconUrl: `${APP_URL}/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/logo.png`,
      buttonTitle: 'Rate My Buzz',
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#FFFFFF',
      webhookUrl: `${APP_URL}/api/webhook`,
      subtitle: 'Are you buzzing enough?',
      description: 'Are you buzzing enough? Check your creator score, compare with friends, and unlock funding based on your social influence. Top creators get the best rates. See where you stand!',
      primaryCategory: 'social',
      tags: [
        'social',
        'defi',
        'creator-lending',
        'credit',
        'community'
      ],
      tagline: 'Create buzz. Build credit.'
    },
    accountAssociation: {
      header: 'eyJmaWQiOjUwMDkxNiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDM2Y2E5RjMwRDQ4YWNENUUxRkExMGVEOTk1NzgzRWREODc0MWViM0YifQ',
      payload: 'eyJkb21haW4iOiJidXp6YmFzZS5mdW4ifQ',
      signature: 'Fts8ZVTjOnROoeA+j4KeOYQcgGg/h1W7NCKkMIrVAn1n3sHxJIaVgkJ34rOhFclDyY2EOYGifUurh1A5I0jO6Rw='
    }
  }

  return NextResponse.json(farcasterConfig)
}
