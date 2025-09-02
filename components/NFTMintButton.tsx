'use client'

import { SimpleNFTMint } from '@/components/SimpleNFTMint'

export function NFTMintButton() {
  return (
    <SimpleNFTMint
      className="w-full border-4 border-black p-4 text-center text-base font-bold text-black hover:bg-gray-100 transition-all rounded-xl disabled:opacity-50"
      style={{
        backgroundColor: 'white',
        boxShadow: '8px 8px 0px rgba(0,0,0,1)',
        color: 'black',
      }}
    >
      Mint Score NFT
    </SimpleNFTMint>
  )
}
