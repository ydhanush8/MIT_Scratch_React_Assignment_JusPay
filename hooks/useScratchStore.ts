'use client';

import { create } from 'zustand';
import { Sprite, Block } from '@/lib/types';

interface ScratchStore {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  isPlaying: boolean;
  
  // Sprite management
  addSprite: (sprite: Sprite) => void;
  removeSprite: (id: string) => void;
  updateSprite: (id: string, updates: Partial<Sprite>) => void;
  selectSprite: (id: string) => void;
  renameSprite: (id: string, name: string) => void;
  
  // Script management
  updateSpriteScript: (id: string, script: Block[]) => void;
  swapScripts: (id1: string, id2: string) => void;
  
  // Animation control
  setPlaying: (playing: boolean) => void;
  
  // Helpers
  getSelectedSprite: () => Sprite | null;
  getSpriteById: (id: string) => Sprite | null;
}

export const useScratchStore = create<ScratchStore>((set, get) => ({
  sprites: [
    {
      id: 'sprite-1',
      name: 'Cat',
      x: 0,
      y: 0,
      rotation: 0,
      script: [],
      bubbleText: '',
      bubbleType: null,
      costume: '🐱',
    },
  ],
  selectedSpriteId: 'sprite-1',
  isPlaying: false,
  
  addSprite: (sprite) => set((state) => ({
    sprites: [...state.sprites, sprite],
    selectedSpriteId: sprite.id,
  })),
  
  removeSprite: (id) => set((state) => ({
    sprites: state.sprites.filter((s) => s.id !== id),
    selectedSpriteId: state.selectedSpriteId === id ? state.sprites[0]?.id || null : state.selectedSpriteId,
  })),
  
  updateSprite: (id, updates) => set((state) => ({
    sprites: state.sprites.map((sprite) =>
      sprite.id === id ? { ...sprite, ...updates } : sprite
    ),
  })),
  
  selectSprite: (id) => set({ selectedSpriteId: id }),
  
  renameSprite: (id, name) => set((state) => ({
    sprites: state.sprites.map((sprite) =>
      sprite.id === id ? { ...sprite, name } : sprite
    ),
  })),
  
  updateSpriteScript: (id, script) => set((state) => ({
    sprites: state.sprites.map((sprite) =>
      sprite.id === id ? { ...sprite, script } : sprite
    ),
  })),
  
  swapScripts: (id1, id2) => set((state) => {
    const sprite1 = state.sprites.find((s) => s.id === id1);
    const sprite2 = state.sprites.find((s) => s.id === id2);
    
    if (!sprite1 || !sprite2) return state;
    
    return {
      sprites: state.sprites.map((sprite) => {
        if (sprite.id === id1) {
          return { ...sprite, script: sprite2.script };
        }
        if (sprite.id === id2) {
          return { ...sprite, script: sprite1.script };
        }
        return sprite;
      }),
    };
  }),
  
  setPlaying: (playing) => set({ isPlaying: playing }),
  
  getSelectedSprite: () => {
    const state = get();
    return state.sprites.find((s) => s.id === state.selectedSpriteId) || null;
  },
  
  getSpriteById: (id) => {
    const state = get();
    return state.sprites.find((s) => s.id === id) || null;
  },
}));
