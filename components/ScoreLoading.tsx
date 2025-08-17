'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const RANDOM_FACTS = [
  'Did you know? Top 20% of creators get 2.5% lower interest rates!',
  'Fun fact: Consistent posting increases engagement by 67% on average',
  "Creators who reply to comments see 3x more growth than those who don't",
  'The best time to post on Farcaster is between 2-4 PM EST',
  'Quality content gets 5x more recasts than quantity-focused posts',
  'Network effects compound - each new follower brings 1.3 more on average',
  'Creators with custom frames see 40% higher engagement rates',
  'Cross-platform creators have 2.8x higher retention rates',
  'Visual content performs 12x better than text-only posts',
  "Engaging with other creators' content boosts your visibility by 45%",
]

interface ScoreLoadingProps {
  onComplete?: () => void
}

export function ScoreLoading({ onComplete }: ScoreLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentFact, setCurrentFact] = useState('')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const steps = [
    'Engagement Quality',
    'Posting Consistency',
    'Audience Growth',
    'Content Quality',
    'Network Effects',
  ]

  useEffect(() => {
    // Set random fact on mount
    const randomIndex = Math.floor(Math.random() * RANDOM_FACTS.length)
    setCurrentFact(RANDOM_FACTS[randomIndex])

    // Simulate realistic loading with variable speeds over 7 seconds
    const totalDuration = 7000
    const interval = 100
    let currentProgress = 0
    let startTime = Date.now()

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const timeRatio = elapsed / totalDuration

      // Variable speed phases to simulate real backend loading
      let targetProgress
      if (timeRatio < 0.15) {
        // Slow start: 0-15% of time gets us to 10% progress
        targetProgress = (timeRatio / 0.15) * 10
      } else if (timeRatio < 0.35) {
        // Very slow phase: 15-35% of time gets us from 10% to 25%
        targetProgress = 10 + ((timeRatio - 0.15) / 0.2) * 15
      } else if (timeRatio < 0.65) {
        // Speed up: 35-65% of time gets us from 25% to 70%
        targetProgress = 25 + ((timeRatio - 0.35) / 0.3) * 45
      } else if (timeRatio < 0.85) {
        // Fast phase: 65-85% of time gets us from 70% to 90%
        targetProgress = 70 + ((timeRatio - 0.65) / 0.2) * 20
      } else {
        // Final push: 85-100% of time gets us from 90% to 100%
        targetProgress = 90 + ((timeRatio - 0.85) / 0.15) * 10
      }

      // Smooth interpolation to target progress
      const smoothingFactor = 0.3
      currentProgress += (targetProgress - currentProgress) * smoothingFactor

      setProgress(currentProgress)

      // Mark steps as completed based on progress with delays
      const stepThresholds = [15, 35, 55, 75, 95]
      const newCompletedSteps: string[] = []
      stepThresholds.forEach((threshold, index) => {
        if (currentProgress >= threshold) {
          newCompletedSteps.push(steps[index])
        }
      })
      setCompletedSteps(newCompletedSteps)

      if (elapsed >= totalDuration || currentProgress >= 99.5) {
        clearInterval(progressInterval)
        setProgress(100)
        setCompletedSteps(steps)
        setTimeout(() => {
          onComplete?.()
        }, 300)
      }
    }, interval)

    return () => clearInterval(progressInterval)
  }, [onComplete])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1
          className="text-lg font-bold text-white mb-4"
          style={{
            textShadow:
              '2px 2px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
          }}
        >
          ANALYZING YOUR IMPACT...
        </h1>

        {/* Animated Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-300" />

          {/* Progress circle - pie chart style */}
          <div className="absolute inset-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={`${progress * 2.89} 289`}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
          </div>

          {/* Progress text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <p className="text-sm text-white mb-6">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Progress Steps */}
      <div
        className="bg-white border-2 border-black rounded-md p-4 mb-6"
        style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}
      >
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step)
            const isInProgress = !isCompleted && completedSteps.length === index

            return (
              <div key={step} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Completed"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : isInProgress ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <span
                  className={`text-sm ${isCompleted ? 'text-green-600 font-medium' : isInProgress ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                  {step}
                </span>
                <div className="flex-1">
                  {(isCompleted || isInProgress) && (
                    <div className="w-full h-2 bg-gray-200 rounded-full ml-2">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500 w-full' : 'bg-blue-500'}`}
                        style={{
                          width: isCompleted
                            ? '100%'
                            : isInProgress
                              ? '60%'
                              : '0%',
                          transitionDelay: isInProgress ? '200ms' : '0ms',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center mb-6">
        <p className="text-sm text-black font-medium">
          "Crunching data from your last 45 days of Farcaster activity..."
        </p>
      </div>

      {/* Random Fact Quote */}
      <div className="text-center">
        <p className="text-xs text-gray-600 italic">"{currentFact}"</p>
      </div>
    </div>
  )
}
