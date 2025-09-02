'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useCreatorScore } from './CreatorScoreProvider'
import { useFrame } from './farcaster-provider'
import { useAccount, useReadContract } from 'wagmi'

interface ContractNFT {
  tokenId: bigint
  overallScore: bigint
  engagement: bigint
  consistency: bigint
  growth: bigint
  quality: bigint
  network: bigint
  fid: bigint
  username: string
  timestamp: bigint
}

interface ProfilePageProps {
  isOpen: boolean
  onClose: () => void
}

const CONTRACT_ADDRESS = '0x008b89E347471a27D4D1F1754Bf37CD02D13BEb3'

// Contract ABI for reading NFT data
const NFT_READ_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'getTokensByOwner',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getCreatorScore',
    outputs: [
      {
        components: [
          { name: 'overallScore', type: 'uint256' },
          { name: 'engagement', type: 'uint256' },
          { name: 'consistency', type: 'uint256' },
          { name: 'growth', type: 'uint256' },
          { name: 'quality', type: 'uint256' },
          { name: 'network', type: 'uint256' },
          { name: 'fid', type: 'uint256' },
          { name: 'username', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
  const [contractNFTs, setContractNFTs] = useState<ContractNFT[]>([])
  const { scoreData, user } = useCreatorScore()
  const { context } = useFrame()
  const { address } = useAccount()

  // Get token IDs owned by user
  const { data: tokenIds, refetch: refetchTokens } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_READ_ABI,
    functionName: 'getTokensByOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isOpen },
  })

  // Read NFTs from localStorage
  useEffect(() => {
    if (isOpen) {
      console.log(
        '🔍 ProfilePage opened, checking localStorage for mintedNFTs...',
      )
      const stored = localStorage.getItem('mintedNFTs')
      console.log('📦 Raw localStorage data:', stored)

      if (stored) {
        try {
          const localNFTs = JSON.parse(stored) as Array<{
            scoreData?: {
              overallScore?: number
              components?: {
                engagement?: number
                consistency?: number
                growth?: number
                quality?: number
                network?: number
              }
            }
            userFid?: number
            username?: string
            timestamp?: number
            transactionHash?: string
          }>

          console.log('🔄 Parsed NFTs from localStorage:', localNFTs)

          // Convert to ContractNFT format
          const convertedNFTs: ContractNFT[] = localNFTs.map(
            (nft, index: number) => ({
              tokenId: BigInt(index + 1), // Mock token ID
              overallScore: BigInt(
                Math.floor(nft.scoreData?.overallScore || 0),
              ),
              engagement: BigInt(
                Math.floor(nft.scoreData?.components?.engagement || 0),
              ),
              consistency: BigInt(
                Math.floor(nft.scoreData?.components?.consistency || 0),
              ),
              growth: BigInt(
                Math.floor(nft.scoreData?.components?.growth || 0),
              ),
              quality: BigInt(
                Math.floor(nft.scoreData?.components?.quality || 0),
              ),
              network: BigInt(
                Math.floor(nft.scoreData?.components?.network || 0),
              ),
              fid: BigInt(nft.userFid || 0),
              username: nft.username || 'Unknown',
              timestamp: BigInt(
                Math.floor((nft.timestamp || Date.now()) / 1000),
              ), // Convert to seconds
            }),
          )

          console.log('✅ Converted NFTs for display:', convertedNFTs)
          setContractNFTs(convertedNFTs)
        } catch (error) {
          console.error('❌ Error parsing localStorage NFTs:', error)
          setContractNFTs([])
        }
      } else {
        console.log('📭 No NFTs found in localStorage')
        setContractNFTs([])
      }
    }
  }, [isOpen])

  // Refetch when modal opens
  useEffect(() => {
    if (isOpen && address) {
      refetchTokens()
    }
  }, [isOpen, address, refetchTokens])

  if (!isOpen) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTierBadge = (score: number) => {
    if (score >= 90) return { label: 'S TIER', color: 'bg-purple-600' }
    if (score >= 80) return { label: 'A TIER', color: 'bg-blue-600' }
    if (score >= 70) return { label: 'B TIER', color: 'bg-green-600' }
    if (score >= 60) return { label: 'C TIER', color: 'bg-yellow-600' }
    return { label: 'D TIER', color: 'bg-gray-600' }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            {context?.user?.pfpUrl && (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {context?.user?.displayName ||
                  user?.username ||
                  `User ${user?.fid}`}
              </h3>
              <p className="text-gray-600">FID: {user?.fid}</p>
            </div>
          </div>

          {/* Current Score */}
          {scoreData && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Current Creator Score
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {Math.round(scoreData.overallScore)}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTierBadge(scoreData.overallScore).color}`}
                >
                  {getTierBadge(scoreData.overallScore).label}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(scoreData.components.engagement)}
                  </div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(scoreData.components.consistency)}
                  </div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(scoreData.components.growth)}
                  </div>
                  <div className="text-sm text-gray-600">Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(scoreData.components.quality)}
                  </div>
                  <div className="text-sm text-gray-600">Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(scoreData.components.network)}
                  </div>
                  <div className="text-sm text-gray-600">Network</div>
                </div>
              </div>
            </div>
          )}

          {/* Minted NFTs */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Minted NFTs ({contractNFTs.length})
            </h4>

            {contractNFTs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎨</div>
                <p>No NFTs minted yet</p>
                <p className="text-sm">Mint your first creator score NFT!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractNFTs.map((nft) => (
                  <div
                    key={nft.tokenId.toString()}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Creator Score NFT #{nft.tokenId.toString()}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {formatDate(Number(nft.timestamp) * 1000)}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${getTierBadge(Number(nft.overallScore)).color}`}
                      >
                        {getTierBadge(Number(nft.overallScore)).label}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Score: </span>
                        <span className="font-medium">
                          {Number(nft.overallScore)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Engagement: </span>
                        <span className="font-medium">
                          {Number(nft.engagement)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality: </span>
                        <span className="font-medium">
                          {Number(nft.quality)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">User:</span>
                      <span className="font-medium">{nft.username}</span>
                      <span className="text-gray-600">FID:</span>
                      <span className="font-medium">{Number(nft.fid)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
