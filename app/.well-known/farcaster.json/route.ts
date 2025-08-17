import { NextResponse } from 'next/server'
import { APP_URL } from '../../../lib/constants'

export async function GET() {
  const farcasterConfig = {
    accountAssociation: {
      header:
        'eyJmaWQiOjUwMDkxNiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDM2Y2E5RjMwRDQ4YWNENUUxRkExMGVEOTk1NzgzRWREODc0MWViM0YifQ',
      payload: 'eyJkb21haW4iOiJidXp6YmFzZS5mdW4ifQ',
      signature:
        'Fts8ZVTjOnROoeA+j4KeOYQcgGg/h1W7NCKkMIrVAn1n3sHxJIaVgkJ34rOhFclDyY2EOYGifUurh1A5I0jO6Rw=',
    },
    frame: {
      version: '1',
      name: 'Buzz.fun',
      iconUrl: `${APP_URL}/logo.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/logo.png`,
      subtitle: 'Are you buzzing enough?',
      description:
        'Are you buzzing? Check your creator score, compare with friends, and unlock funding based on your social influence. Top creators get the best rates. See where you stand',
      screenshotUrls: [
        `${APP_URL}/screenshots/ss1.png`,
        `${APP_URL}/screenshots/ss2.png`,
        `${APP_URL}/screenshots/ss3.png`,
      ],
      tagline: 'Create buzz. Build credit.',
      tags: ['social', 'defi', 'creator-lending', 'credit', 'community'],
      primaryCategory: 'social',
      buttonTitle: 'Check your buzz',
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#ffffff',
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  }

  return NextResponse.json(farcasterConfig)
}
