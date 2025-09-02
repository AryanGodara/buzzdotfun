'use client'

import { X } from 'lucide-react'

interface NFTSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transactionHash: string
  onViewProfile?: () => void
}

export function NFTSuccessModal({
  isOpen,
  onClose,
  transactionHash,
  onViewProfile,
}: NFTSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl">🎉</div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            NFT Minted Successfully!
          </h2>

          <p className="text-gray-600 mb-6">
            Your creator score NFT has been minted on Base network
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {transactionHash}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`https://basescan.org/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View on BaseScan
            </a>

            {onViewProfile && (
              <button
                onClick={() => {
                  onViewProfile()
                  onClose()
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                View My Profile
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
