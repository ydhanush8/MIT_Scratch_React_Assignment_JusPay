'use client';

import { useScratchStore } from '@/hooks/useScratchStore';
import { useState } from 'react';

const SPRITE_EMOJIS = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁'];

export function SpritePanel() {
  const { sprites, selectedSpriteId, addSprite, selectSprite, renameSprite } = useScratchStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const handleAddSprite = () => {
    const randomEmoji = SPRITE_EMOJIS[Math.floor(Math.random() * SPRITE_EMOJIS.length)];
    const newSprite = {
      id: `sprite-${Date.now()}`,
      name: `Sprite${sprites.length + 1}`,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      rotation: 0,
      script: [],
      bubbleText: '',
      bubbleType: null as null,
      costume: randomEmoji,
    };
    addSprite(newSprite);
  };
  
  const handleRename = (id: string, name: string) => {
    renameSprite(id, name);
    setEditingId(null);
  };
  
  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };
  
  return (
    <div className="bg-gray-50 border-t border-gray-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Sprites</h3>
        <button
          onClick={handleAddSprite}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          + Add
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            onClick={() => selectSprite(sprite.id)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedSpriteId === sprite.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white hover:bg-gray-100 text-gray-800'
            }`}
          >
            <div className="text-3xl text-center mb-1">{sprite.costume}</div>
            {editingId === sprite.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(sprite.id, editName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(sprite.id, editName);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="w-full text-center text-xs px-1 py-0.5 rounded border border-gray-300 text-gray-800"
              />
            ) : (
              <div
                className="text-xs text-center font-medium truncate"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEdit(sprite.id, sprite.name);
                }}
              >
                {sprite.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
