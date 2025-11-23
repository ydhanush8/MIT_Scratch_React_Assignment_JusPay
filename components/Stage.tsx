'use client';

import { useScratchStore } from '@/hooks/useScratchStore';
import { useAnimationEngine } from '@/hooks/useAnimationEngine';

export function Stage() {
  const { sprites } = useScratchStore();
  const { startAnimation, stopAnimation, isPlaying } = useAnimationEngine();
  
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Stage</h3>
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={startAnimation}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <span>▶</span>
              Play
            </button>
          ) : (
            <button
              onClick={stopAnimation}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
            >
              <span>■</span>
              Stop
            </button>
          )}
        </div>
      </div>
      
      <div className="relative bg-white overflow-hidden" style={{ height: '400px' }}>
        {/* Coordinate system visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-px bg-gray-200"></div>
          <div className="absolute h-full w-px bg-gray-200"></div>
        </div>
        
        {/* Sprites */}
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            className="absolute transition-all duration-100"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${sprite.x}px), calc(-50% - ${sprite.y}px)) rotate(${sprite.rotation}deg)`,
            }}
          >
            {/* Speech/Thought Bubble */}
            {sprite.bubbleText && (
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg ${
                  sprite.bubbleType === 'think'
                    ? 'bg-purple-100 border-2 border-purple-300'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {sprite.bubbleText}
                <div
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${
                    sprite.bubbleType === 'think'
                      ? 'border-t-purple-300'
                      : 'border-t-gray-300'
                  }`}
                ></div>
              </div>
            )}
            
            {/* Sprite Costume */}
            <div className="text-5xl cursor-pointer hover:scale-110 transition-transform">
              {sprite.costume}
            </div>
            
            {/* Sprite Info */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
              {sprite.name}
            </div>
          </div>
        ))}
      </div>
      
      {/* Coordinate Display */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-2">
          {sprites.map((sprite) => (
            <div key={sprite.id}>
              {sprite.name}: x:{sprite.x.toFixed(0)} y:{sprite.y.toFixed(0)} ∠:{sprite.rotation.toFixed(0)}°
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
