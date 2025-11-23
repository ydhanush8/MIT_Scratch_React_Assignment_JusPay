// Block Types
export enum BlockCategory {
  MOTION = 'motion',
  LOOKS = 'looks',
}

export enum BlockType {
  MOVE_STEPS = 'move_steps',
  TURN_DEGREES = 'turn_degrees',
  GO_TO_XY = 'go_to_xy',
  REPEAT = 'repeat',
  SAY_FOR_SECONDS = 'say_for_seconds',
  THINK_FOR_SECONDS = 'think_for_seconds',
}

export interface BlockParameter {
  name: string;
  value: string | number;
  type: 'number' | 'text';
}

export interface Block {
  id: string;
  type: BlockType;
  category: BlockCategory;
  parameters: BlockParameter[];
  children?: Block[]; // For nested blocks like Repeat
}

// Sprite Types
export interface Sprite {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number; // degrees
  script: Block[];
  bubbleText: string;
  bubbleType: 'say' | 'think' | null;
  costume: string; // emoji or image
}

// Animation Types
export interface AnimationState {
  isPlaying: boolean;
  spriteStates: Map<string, SpriteExecutionState>;
}

export interface SpriteExecutionState {
  currentBlockIndex: number;
  isExecuting: boolean;
  repeatStack: RepeatState[];
}

export interface RepeatState {
  blockId: string;
  currentIteration: number;
  maxIterations: number;
  childBlockIndex: number;
}

// Drag and Drop Types
export interface DragItem {
  type: 'BLOCK' | 'PALETTE_BLOCK';
  block?: Block;
  blockType?: BlockType;
  category?: BlockCategory;
  sourceIndex?: number;
  spriteId?: string;
}

// Block Definitions for Palette
export interface BlockDefinition {
  type: BlockType;
  category: BlockCategory;
  label: string;
  color: string;
  defaultParameters: BlockParameter[];
  isContainer: boolean; // Can contain nested blocks
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  [BlockType.MOVE_STEPS]: {
    type: BlockType.MOVE_STEPS,
    category: BlockCategory.MOTION,
    label: 'move',
    color: 'bg-blue-500',
    defaultParameters: [
      { name: 'steps', value: 10, type: 'number' }
    ],
    isContainer: false,
  },
  [BlockType.TURN_DEGREES]: {
    type: BlockType.TURN_DEGREES,
    category: BlockCategory.MOTION,
    label: 'turn',
    color: 'bg-blue-500',
    defaultParameters: [
      { name: 'degrees', value: 15, type: 'number' }
    ],
    isContainer: false,
  },
  [BlockType.GO_TO_XY]: {
    type: BlockType.GO_TO_XY,
    category: BlockCategory.MOTION,
    label: 'go to x:',
    color: 'bg-blue-500',
    defaultParameters: [
      { name: 'x', value: 0, type: 'number' },
      { name: 'y', value: 0, type: 'number' }
    ],
    isContainer: false,
  },
  [BlockType.REPEAT]: {
    type: BlockType.REPEAT,
    category: BlockCategory.MOTION,
    label: 'repeat',
    color: 'bg-blue-500',
    defaultParameters: [
      { name: 'times', value: 10, type: 'number' }
    ],
    isContainer: true,
  },
  [BlockType.SAY_FOR_SECONDS]: {
    type: BlockType.SAY_FOR_SECONDS,
    category: BlockCategory.LOOKS,
    label: 'say',
    color: 'bg-purple-500',
    defaultParameters: [
      { name: 'text', value: 'Hello!', type: 'text' },
      { name: 'seconds', value: 2, type: 'number' }
    ],
    isContainer: false,
  },
  [BlockType.THINK_FOR_SECONDS]: {
    type: BlockType.THINK_FOR_SECONDS,
    category: BlockCategory.LOOKS,
    label: 'think',
    color: 'bg-purple-500',
    defaultParameters: [
      { name: 'text', value: 'Hmm...', type: 'text' },
      { name: 'seconds', value: 2, type: 'number' }
    ],
    isContainer: false,
  },
};
