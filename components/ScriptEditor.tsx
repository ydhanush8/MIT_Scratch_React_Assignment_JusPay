'use client';

import { useDrop } from 'react-dnd';
import { useScratchStore } from '@/hooks/useScratchStore';
import { Block } from './Block';
import { Block as BlockType, BLOCK_DEFINITIONS, DragItem } from '@/lib/types';

export function ScriptEditor() {
  const { selectedSpriteId, getSelectedSprite, updateSpriteScript } = useScratchStore();
  const selectedSprite = getSelectedSprite();
  
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'PALETTE_BLOCK',
    drop: (item: DragItem) => {
      if (!selectedSprite || !item.blockType || !item.category) return;
      
      const newBlock: BlockType = {
        id: `block-${Date.now()}-${Math.random()}`,
        type: item.blockType,
        category: item.category,
        parameters: [...BLOCK_DEFINITIONS[item.blockType].defaultParameters],
        children: BLOCK_DEFINITIONS[item.blockType].isContainer ? [] : undefined,
      };
      
      updateSpriteScript(selectedSprite.id, [...selectedSprite.script, newBlock]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  
  if (!selectedSprite) {
    return (
      <div className="flex-1 bg-white p-6 flex items-center justify-center">
        <p className="text-gray-500">Select a sprite to edit its script</p>
      </div>
    );
  }
  
  const updateBlock = (index: number, updatedBlock: BlockType) => {
    const newScript = selectedSprite.script.map((block, idx) =>
      idx === index ? updatedBlock : block
    );
    updateSpriteScript(selectedSprite.id, newScript);
  };
  
  const removeBlock = (index: number) => {
    const newScript = selectedSprite.script.filter((_, idx) => idx !== index);
    updateSpriteScript(selectedSprite.id, newScript);
  };
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newScript = [...selectedSprite.script];
    const [movedBlock] = newScript.splice(fromIndex, 1);
    newScript.splice(toIndex, 0, movedBlock);
    updateSpriteScript(selectedSprite.id, newScript);
  };
  
  const addChildBlock = (parentIndex: number, child: BlockType) => {
    const newScript = selectedSprite.script.map((block, idx) => {
      if (idx === parentIndex && block.children) {
        return { ...block, children: [...block.children, child] };
      }
      return block;
    });
    updateSpriteScript(selectedSprite.id, newScript);
  };
  
  return (
    <div
      ref={drop as any}
      className={`flex-1 bg-white p-6 overflow-y-auto ${isOver ? 'bg-blue-50' : ''}`}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Script for {selectedSprite.name}
        </h2>
        <p className="text-sm text-gray-500">
          Drag blocks from the palette or reorder them here
        </p>
      </div>
      
      <div className="max-w-2xl">
        {selectedSprite.script.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Drag blocks here to start coding!
          </div>
        ) : (
          selectedSprite.script.map((block, index) => (
            <Block
              key={block.id}
              block={block}
              index={index}
              spriteId={selectedSprite.id}
              onUpdate={updateBlock}
              onRemove={removeBlock}
              onMove={moveBlock}
              onAddChild={addChildBlock}
            />
          ))
        )}
      </div>
    </div>
  );
}
