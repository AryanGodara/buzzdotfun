'use client'

export function ComingSoonPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div
        className="bg-white border-2 border-black rounded-md p-6 text-center"
        style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
      >
        {/* Under Construction Image */}
        <div className="mb-6">
          <img
            src="/under-construction.png"
            alt="Under Construction"
            className="w-32 h-32 mx-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Coming Soon</h1>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 mb-3 text-sm leading-relaxed">
            We're working hard to bring you something amazing!
          </p>
          <p className="text-gray-500 text-xs">
            Stay tuned for updates on our exciting new features.
          </p>
        </div>

        {/* Fun message */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium">
            Focus on building your Creator Score for now!
          </p>
        </div>
      </div>
    </div>
  )
}
