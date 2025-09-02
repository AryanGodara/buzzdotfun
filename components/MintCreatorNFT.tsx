'use client'

import { useEffect, useState } from 'react'
import { base } from 'wagmi/chains'
import {
  useAccount,
  useConnect,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { useFrame } from '@/components/farcaster-provider'
import { useCreatorScore } from '@/components/CreatorScoreProvider'

// NFT Contract Address (deployed on Base mainnet)
const CONTRACT_ADDRESS = '0x008b89E347471a27D4D1F1754Bf37CD02D13BEb3'
const BACKEND_API_URL = 'https://buzzfunbackend.buzzdotfun.workers.dev'

// NFT Contract ABI (minimal for minting)
const NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'overallScore', type: 'uint256' },
      { name: 'engagement', type: 'uint256' },
      { name: 'consistency', type: 'uint256' },
      { name: 'growth', type: 'uint256' },
      { name: 'quality', type: 'uint256' },
      { name: 'network', type: 'uint256' },
      { name: 'fid', type: 'uint256' },
      { name: 'username', type: 'string' },
    ],
    name: 'mintCreatorScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * Store NFT token mapping in backend after successful mint
 */
const storeNFTMetadata = async (tokenId: number, fid: number, contractAddress: string, ownerAddress: string) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/nft/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: Number.parseInt(tokenId.toString()),
        fid: Number.parseInt(fid.toString()),
        contractAddress: contractAddress,
        ownerAddress: ownerAddress
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to store NFT metadata');
    }

    const result = await response.json();
    console.log('✅ NFT metadata stored:', result.metadataUrl);
    return result;

  } catch (error) {
    console.error('❌ Failed to store NFT metadata:', error);
    throw error;
  }
};

/**
 * Preview what the NFT will look like before minting
 */
const previewNFTMetadata = async (fid: number) => {
  try {
    const scoreResponse = await fetch(`${BACKEND_API_URL}/api/score/creator/${fid}`);
    const scoreData = await scoreResponse.json();
    
    if (!scoreData.success) {
      throw new Error('No creator score found');
    }
    
    return {
      canMint: true,
      preview: {
        name: 'Buzz Creator Score NFT',
        description: `Creator Score NFT for ${scoreData.data.username || 'User'} with score ${scoreData.data.overallScore}/100`,
        tier: scoreData.data.tierInfo.tier,
        score: scoreData.data.overallScore,
        username: scoreData.data.username,
        pfpUrl: scoreData.data.pfpUrl
      }
    };
    
  } catch (error) {
    return {
      canMint: false,
      error: 'User must have a creator score to mint NFT'
    };
  }
};

/**
 * Handle minting errors with user-friendly messages
 */
const handleMintError = (error: Error, fid: number) => {
  if (error.message.includes('Creator score not found')) {
    return {
      title: 'Score Required',
      message: `FID ${fid} doesn't have a creator score yet. Please ensure the user has activity on Farcaster and try again later.`,
      action: 'Check Score'
    };
  }
  
  if (error.message.includes('Invalid token ID')) {
    return {
      title: 'Invalid Token',
      message: 'There was an issue with the token ID. Please try minting again.',
      action: 'Retry'
    };
  }
  
  return {
    title: 'Minting Failed', 
    message: 'Unable to mint NFT. Please check your connection and try again.',
    action: 'Retry'
  };
};

interface MintCreatorNFTProps {
  className?: string
  children?: React.ReactNode
}

export function MintCreatorNFT({
  className = '',
  children,
}: MintCreatorNFTProps) {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, chainId, address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { scoreData, user } = useCreatorScore()
  const [mintingState, setMintingState] = useState<'idle' | 'minting' | 'storing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [canMint, setCanMint] = useState<boolean>(false)

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Check if user can mint NFT on component mount
  useEffect(() => {
    const checkMintEligibility = async () => {
      if (user?.fid) {
        const preview = await previewNFTMetadata(user.fid)
        setCanMint(preview.canMint)
        if (!preview.canMint) {
          setErrorMessage(preview.error || 'Unable to mint NFT')
        }
      }
    }
    
    checkMintEligibility()
  }, [user?.fid])

  // Handle successful blockchain transaction
  useEffect(() => {
    const handleTransactionSuccess = async () => {
      if (isConfirmed && hash && user?.fid && address) {
        try {
          setMintingState('storing')
          
          // Extract token ID from transaction receipt (simplified - in real implementation, parse logs)
          const tokenId = Date.now() % 10000 // Temporary token ID generation
          
          // Store NFT metadata in backend
          await storeNFTMetadata(
            tokenId,
            user.fid,
            CONTRACT_ADDRESS,
            address
          )
          
          setMintingState('success')
          console.log(`✅ NFT minted successfully! Token ID: ${tokenId}`)
          
        } catch (error) {
          console.error('Failed to store NFT metadata:', error)
          setMintingState('error')
          setErrorMessage('NFT minted but metadata storage failed. Please contact support.')
        }
      }
    }
    
    handleTransactionSuccess()
  }, [isConfirmed, hash, user?.fid, address])

  const handleMintNFT = async () => {
    try {
      if (!isEthProviderAvailable) {
        alert('Wallet connection only available via Warpcast')
        return
      }

      if (!isConnected) {
        connect({ connector: miniAppConnector() })
        return
      }

      if (chainId !== base.id) {
        switchChain({ chainId: base.id })
        return
      }

      if (!scoreData || !user?.fid || !address) {
        const errorInfo = handleMintError(new Error('No score data'), user?.fid || 0)
        alert(errorInfo.message)
        return
      }

      if (!canMint) {
        alert(errorMessage || 'Unable to mint NFT. Please ensure you have a creator score.')
        return
      }

      setMintingState('minting')
      setErrorMessage('')

      // Mint NFT with creator score data
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintCreatorScore',
        args: [
          address,
          BigInt(scoreData.overallScore),
          BigInt(scoreData.components.engagement),
          BigInt(scoreData.components.consistency),
          BigInt(scoreData.components.growth),
          BigInt(scoreData.components.quality),
          BigInt(scoreData.components.network),
          BigInt(user.fid),
          user.username || 'unknown',
        ],
      })
    } catch (error) {
      console.error('NFT minting failed:', error)
      const errorInfo = handleMintError(error as Error, user?.fid || 0)
      setMintingState('error')
      setErrorMessage(errorInfo.message)
      alert(errorInfo.message)
    }
  }

  const getButtonText = () => {
    if (mintingState === 'storing') return 'Storing Metadata...'
    if (mintingState === 'success') return 'NFT Minted Successfully!'
    if (mintingState === 'error') return 'Minting Failed'
    if (isConfirming) return 'Confirming Transaction...'
    if (isPending) return 'Minting NFT...'
    if (isConfirmed) return 'Processing...'
    if (!isEthProviderAvailable) return 'Wallet Unavailable'
    if (!isConnected) return 'Connect Wallet'
    if (chainId !== base.id) return 'Switch to Base'
    if (!scoreData) return 'Calculate Score First'
    if (!canMint) return 'Score Required'
    return children || 'Mint Creator NFT'
  }

  const isDisabled = isPending || isConfirming || !isEthProviderAvailable || !scoreData || !canMint || mintingState === 'storing'

  return (
    <button
      type="button"
      className={`border-4 border-black p-4 text-center text-base font-bold text-white hover:brightness-110 transition-all rounded-xl disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: mintingState === 'success' ? '#10B981' : mintingState === 'error' ? '#EF4444' : '#4D61F4',
        boxShadow: '8px 8px 0px rgba(0,0,0,1)',
      }}
      onClick={handleMintNFT}
      disabled={isDisabled}
    >
      {getButtonText()}
    </button>
  )
}
