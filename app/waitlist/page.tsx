'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual waitlist signup
    setJoined(true)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#D7FF7B' }}
    >
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xl font-bold">buzz.fun</span>
        </Link>
      </header>

      <main className="flex-1 px-4 py-4 max-w-sm mx-auto w-full flex flex-col justify-center">
        <div
          className="bg-white border-2 border-black rounded-md p-4 mb-4"
          style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
        >
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold mb-2">
              💰 CREATOR LOANS - COMING SOON
            </h1>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mb-3">
              <p className="font-bold text-base mb-1">YOUR RATE: 9.5% APR</p>
              <p className="text-xs text-gray-600">
                Based on Creator Score of {Math.floor(Math.random() * 100)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded p-3 mb-4">
            <h3 className="font-bold mb-2 text-sm">WHAT'S COMING:</h3>
            <ul className="space-y-1 text-xs">
              <li>• Instant loans up to $10k</li>
              <li>• No traditional credit check</li>
              <li>• Rates based on your activity</li>
              <li>• Collateral-backed security</li>
            </ul>
          </div>

          {!joined ? (
            <form onSubmit={handleJoinWaitlist} className="mb-3">
              <button
                type="submit"
                className="w-full border-2 border-black p-3 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-md"
                style={{
                  backgroundColor: '#4D61F4',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                }}
              >
                JOIN EXCLUSIVE WAITLIST
              </button>
            </form>
          ) : (
            <div className="text-center mb-3">
              <div className="bg-green-100 border-2 border-green-500 rounded p-3">
                <p className="font-bold text-green-800 text-sm">
                  ✅ You're on the waitlist!
                </p>
              </div>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-300 rounded p-3 mb-3">
            <h4 className="font-bold text-orange-800 mb-1 text-sm">
              🔥 Waitlist members get:
            </h4>
            <ul className="text-xs text-orange-700 space-y-1">
              <li>• First access to loans</li>
              <li>• Bonus 0.5% rate discount</li>
              <li>• Exclusive Creator Badge NFT</li>
            </ul>
          </div>

          <div className="text-center text-xs text-gray-600">
            <p className="mb-1">
              Position: #{Math.floor(Math.random() * 500) + 200}
            </p>
            <p>[Invite Friends to Jump Line]</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Creator Score
        </Link>
      </main>

      <footer className="mt-auto py-4 flex justify-center w-full border-t border-gray-100">
        <div className="text-gray-500 text-xs">Somurie ~Aryan</div>
      </footer>
    </div>
  )
}
