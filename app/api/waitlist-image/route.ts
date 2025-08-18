import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position') || Math.floor(Math.random() * 500) + 200
    const rate = searchParams.get('rate') || '9.5'
    const score = searchParams.get('score') || '78'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundImage: `url(${process.env.NEXT_PUBLIC_APP_URL}/WAITLIST.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Main Title - positioned at top */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '48px',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              maxWidth: '900px',
              paddingLeft: '40px',
              paddingRight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            💰 CREATOR LOANS - WAITLIST
          </div>

          {/* Personalized Rate (Left Side) */}
          <div
            style={{
              position: 'absolute',
              left: '150px',
              top: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#1f2937',
                padding: '15px 30px',
                borderRadius: '30px',
                fontSize: '32px',
                fontWeight: 800,
                border: '4px solid #ffffff',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              YOUR RATE: {rate}% APR
            </div>
          </div>

          {/* Waitlist Position (Right Side) */}
          <div
            style={{
              position: 'absolute',
              right: '150px',
              top: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#1f2937',
                padding: '15px 30px',
                borderRadius: '30px',
                fontSize: '32px',
                fontWeight: 800,
                border: '4px solid #ffffff',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Position: #{position}
            </div>
          </div>

          {/* Creator Score - centered below */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#1f2937',
                padding: '12px 25px',
                borderRadius: '25px',
                fontSize: '24px',
                fontWeight: 700,
                border: '3px solid #ffffff',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Creator Score: {score}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '28px',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
            }}
          >
            🔥 Early Access • 0.5% Discount • Creator NFT
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, no-transform, max-age=300',
        },
      }
    )
  } catch (e) {
    console.error('[waitlist-image:error]', (e as Error)?.message)
    
    // Fallback minimal image following your template
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#4D61F4',
            color: '#fff',
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          💰 Creator Loans Waitlist
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
