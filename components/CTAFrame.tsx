'use client'

interface CTAFrameProps {
  type: 'score' | 'waitlist'
  score?: number
  userName?: string
}

interface CTAFrameData {
  image: string
  text: string
  subtext: string
  embedUrl: string
}

const MINIAPP_URL = 'https://farcaster.xyz/miniapps/B17cQgOJGymU/buzzfun'

export function CTAFrame({
  type,
  score = 78,
  userName = 'Creator',
}: CTAFrameProps) {
  const frameData: CTAFrameData = {
    score: {
      image: '/SCORE_CARD.png',
      text: `Just calculated my Creator Score: ${score}/100! 🚀`,
      subtext: 'beat my creator score',
      embedUrl: MINIAPP_URL,
    },
    waitlist: {
      image: '/WAITLIST.png',
      text: 'Join the waitlist for better loan rates! 💰',
      subtext: 'get early access',
      embedUrl: MINIAPP_URL,
    },
  }[type]

  return {
    text: frameData.text,
    subtext: frameData.subtext,
    embedUrl: frameData.embedUrl,
    image: frameData.image,
  }
}

export function generateCTAFrameUrl(
  type: 'score' | 'waitlist',
  score?: number,
): string {
  const frame = CTAFrame({ type, score })

  // Create the frame metadata for Farcaster
  const frameText = `${frame.text}\n\n${frame.subtext}`

  // Return the compose URL with embedded frame
  return `https://warpcast.com/~/compose?text=${encodeURIComponent(frameText)}&embeds[]=${encodeURIComponent(frame.embedUrl)}`
}

// Hook for sharing CTA frames
export function useCTAFrameShare() {
  const shareScoreFrame = async (score: number) => {
    const shareUrl = generateCTAFrameUrl('score', score)

    try {
      // Try to use SDK first, fallback to window.open
      const { sdk } = await import('@farcaster/miniapp-sdk')
      await sdk.actions.openUrl(shareUrl)
    } catch (error) {
      console.error('Failed to compose cast with SDK:', error)
      window.open(shareUrl, '_blank')
    }
  }

  const shareWaitlistFrame = async () => {
    const shareUrl = generateCTAFrameUrl('waitlist')

    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      await sdk.actions.openUrl(shareUrl)
    } catch (error) {
      console.error('Failed to compose cast with SDK:', error)
      window.open(shareUrl, '_blank')
    }
  }

  return {
    shareScoreFrame,
    shareWaitlistFrame,
  }
}
