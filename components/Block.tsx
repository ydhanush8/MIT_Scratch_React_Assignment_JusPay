'use client';

import { useDrag, useDrop } from 'react-dnd';
import { Block as BlockType, BLOCK_DEFINITIONS, DragItem, BlockParameter } from '@/lib/types';

interface BlockProps {
  block: BlockType;
  index: number;
  spriteId: string;
  onUpdate: (index: number, block: BlockType) => void;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onAddChild?: (parentIndex: number, child: BlockType) => void;
}

export function Block({ block, index, spriteId, onUpdate, onRemove, onMove, onAddChild }: BlockProps) {
  const definition = BLOCK_DEFINITIONS[block.type];
  
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'BLOCK',
    item: { type: 'BLOCK', block, sourceIndex: index, spriteId } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: 'BLOCK',
    canDrop: (item: DragItem) => {
      // Can't drop a block onto itself
      return item.sourceIndex !== index || item.spriteId !== spriteId;
    },
    drop: (item: DragItem, monitor) => {
      if (!monitor.canDrop()) return;
      
      if (item.sourceIndex !== undefined && item.spriteId === spriteId) {
        // Calculate target index - if dragging down, account for the removal
        let targetIndex = index;
        if (item.sourceIndex < index) {
          targetIndex = index;
        } else if (item.sourceIndex > index) {
          targetIndex = index + 1;
        }
        
        onMove(item.sourceIndex, targetIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));
  
  const [{ isOverChild }, dropChild] = useDrop<DragItem, void, { isOverChild: boolean }>(() => ({
    accept: ['BLOCK', 'PALETTE_BLOCK'],
    drop: (item: DragItem) => {
      if (item.type === 'PALETTE_BLOCK' && item.blockType && item.category && onAddChild) {
        const newBlock: BlockType = {
          id: `block-${Date.now()}-${Math.random()}`,
          type: item.blockType,
          category: item.category,
          parameters: [...BLOCK_DEFINITIONS[item.blockType].defaultParameters],
          children: [],
        };
        onAddChild(index, newBlock);
      }
    },
    collect: (monitor) => ({
      isOverChild: monitor.isOver(),
    }),
  }));
  
  const updateParameter = (paramIndex: number, value: string | number) => {
    const updatedBlock = {
      ...block,
      parameters: block.parameters.map((param, idx) =>
        idx === paramIndex ? { ...param, value } : param
      ),
    };
    onUpdate(index, updatedBlock);
  };
  
  const removeChildBlock = (childIndex: number) => {
    const updatedBlock = {
      ...block,
      children: block.children?.filter((_, idx) => idx !== childIndex),
    };
    onUpdate(index, updatedBlock);
  };
  
  const updateChildBlock = (childIndex: number, updatedChild: BlockType) => {
    const updatedBlock = {
      ...block,
      children: block.children?.map((child, idx) =>
        idx === childIndex ? updatedChild : child
      ),
    };
    onUpdate(index, updatedBlock);
  };
  
  const moveChildBlock = (fromIdx: number, toIdx: number) => {
    if (!block.children) return;
    const newChildren = [...block.children];
    const [movedBlock] = newChildren.splice(fromIdx, 1);
    newChildren.splice(toIdx, 0, movedBlock);
    
    const updatedBlock = { ...block, children: newChildren };
    onUpdate(index, updatedBlock);
  };
  
  return (
    <div
      ref={drop as any}
      className={`mb-2 relative ${isOver && canDrop ? 'mt-4' : ''}`}
    >
      {/* Drop indicator */}
      {isOver && canDrop && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-400 rounded-full shadow-lg z-10" />
      )}
      
      <div
        ref={drag as any}
        className={`${definition.color} text-white px-3 py-2 rounded-lg cursor-move shadow-md hover:shadow-lg transition-shadow ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{definition.label}</span>
          
          {block.parameters.map((param, idx) => (
            <input
              key={idx}
              type={param.type === 'number' ? 'number' : 'text'}
              value={param.value}
              onChange={(e) => {
                const value = param.type === 'number' ? Number(e.target.value) : e.target.value;
                updateParameter(idx, value);
              }}
              className="bg-white text-black px-2 py-1 rounded w-16 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ))}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="ml-auto text-white hover:text-red-200 text-sm"
          >
            ✕
          </button>
        </div>
        
        {definition.isContainer && (
          <div
            ref={dropChild as any}
            className={`mt-2 ml-4 pl-2 border-l-2 border-white/30 min-h-[40px] ${
              isOverChild ? 'bg-white/10' : ''
            }`}
          >
            {block.children && block.children.length > 0 ? (
              block.children.map((child, childIdx) => (
                <Block
                  key={child.id}
                  block={child}
                  index={childIdx}
                  spriteId={spriteId}
                  onUpdate={updateChildBlock}
                  onRemove={removeChildBlock}
                  onMove={moveChildBlock}
                  onAddChild={(parentIdx, newChild) => {
                    const updatedBlock = {
                      ...block,
                      children: block.children?.map((c, idx) => {
                        if (idx === parentIdx && c.children) {
                          return { ...c, children: [...(c.children || []), newChild] };
                        }
                        return c;
                      }),
                    };
                    onUpdate(index, updatedBlock);
                  }}
                />
              ))
            ) : (
              <div className="text-white/50 text-sm py-2">Drop blocks here</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
