'use client';

import { useDrag } from 'react-dnd';
import { BlockType, BlockCategory, BLOCK_DEFINITIONS, DragItem } from '@/lib/types';

interface PaletteBlockProps {
  blockType: BlockType;
}

function PaletteBlock({ blockType }: PaletteBlockProps) {
  const definition = BLOCK_DEFINITIONS[blockType];
  
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'PALETTE_BLOCK',
    item: {
      type: 'PALETTE_BLOCK',
      blockType,
      category: definition.category,
    } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  return (
    <div
      ref={drag as any}
      className={`${definition.color} text-white px-3 py-2 rounded-lg cursor-move shadow-md hover:shadow-lg transition-all mb-2 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap text-sm">
        <span className="font-medium">{definition.label}</span>
        {definition.defaultParameters.map((param, idx) => (
          <span key={idx} className="bg-white text-black px-2 py-1 rounded text-xs">
            {param.value}
          </span>
        ))}
      </div>
      
      {definition.isContainer && (
        <div className="mt-1 ml-3 pl-2 border-l-2 border-white/30 text-xs text-white/70">
          container
        </div>
      )}
    </div>
  );
}

export function BlockPalette() {
  const motionBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (def) => def.category === BlockCategory.MOTION
  );
  
  const looksBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (def) => def.category === BlockCategory.LOOKS
  );
  
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Blocks</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-blue-600">Motion</h3>
        {motionBlocks.map((def) => (
          <PaletteBlock key={def.type} blockType={def.type} />
        ))}
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2 text-purple-600">Looks</h3>
        {looksBlocks.map((def) => (
          <PaletteBlock key={def.type} blockType={def.type} />
        ))}
      </div>
    </div>
  );
}
