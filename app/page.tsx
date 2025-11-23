'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BlockPalette } from '@/components/BlockPalette';
import { ScriptEditor } from '@/components/ScriptEditor';
import { Stage } from '@/components/Stage';
import { SpritePanel } from '@/components/SpritePanel';

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Left Sidebar - Block Palette */}
        <BlockPalette />
        
        {/* Center - Script Editor */}
        <ScriptEditor />
        
        {/* Right Panel - Stage and Sprites */}
        <div className="w-[450px] flex flex-col border-l border-gray-300">
          <Stage />
          <SpritePanel />
        </div>
      </div>
    </DndProvider>
  );
}
