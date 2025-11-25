import { Block, BlockType, Sprite } from './types';

export type SpriteGetter = () => Sprite;
export type SpriteUpdater = (updates: Partial<Sprite>) => void;

/**
 * Execute a single block and update the sprite state
 */
export async function executeBlock(
  block: Block,
  getSpriteState: SpriteGetter,
  updateSprite: SpriteUpdater
): Promise<void> {
  const sprite = getSpriteState(); // Get fresh sprite state
  
  switch (block.type) {
    case BlockType.MOVE_STEPS: {
      const steps = Number(block.parameters[0]?.value || 0);
      await animateMovement(getSpriteState, steps, updateSprite);
      break;
    }
    
    case BlockType.TURN_DEGREES: {
      const degrees = Number(block.parameters[0]?.value || 0);
      await animateRotation(getSpriteState, degrees, updateSprite);
      break;
    }
    
    case BlockType.GO_TO_XY: {
      const x = Number(block.parameters[0]?.value || 0);
      const y = Number(block.parameters[1]?.value || 0);
      await animateGoTo(getSpriteState, x, y, updateSprite);
      break;
    }
    
    case BlockType.SAY_FOR_SECONDS: {
      const text = String(block.parameters[0]?.value || '');
      const seconds = Number(block.parameters[1]?.value || 2);
      await showBubble(text, seconds, 'say', updateSprite);
      break;
    }
    
    case BlockType.THINK_FOR_SECONDS: {
      const text = String(block.parameters[0]?.value || '');
      const seconds = Number(block.parameters[1]?.value || 2);
      await showBubble(text, seconds, 'think', updateSprite);
      break;
    }
    
    case BlockType.REPEAT: {
      const times = Number(block.parameters[0]?.value || 1);
      const children = block.children || [];
      
      for (let i = 0; i < times; i++) {
        for (const childBlock of children) {
          await executeBlock(childBlock, getSpriteState, updateSprite);
        }
      }
      break;
    }
  }
}

/**
 * Animate movement in the current direction
 */
async function animateMovement(
  getSpriteState: SpriteGetter,
  steps: number,
  updateSprite: SpriteUpdater
): Promise<void> {
  const sprite = getSpriteState();
  const radians = (sprite.rotation * Math.PI) / 180;
  const targetX = sprite.x + steps * Math.cos(radians);
  const targetY = sprite.y + steps * Math.sin(radians);
  
  return animateToPosition(getSpriteState, targetX, targetY, updateSprite);
}

/**
 * Animate rotation
 */
async function animateRotation(
  getSpriteState: SpriteGetter,
  degrees: number,
  updateSprite: SpriteUpdater
): Promise<void> {
  const sprite = getSpriteState();
  const startRotation = sprite.rotation;
  const targetRotation = sprite.rotation + degrees;
  const duration = 300; // ms
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentRotation = startRotation + (targetRotation - startRotation) * progress;
      updateSprite({ rotation: currentRotation });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

/**
 * Animate to a specific position
 */
async function animateToPosition(
  getSpriteState: SpriteGetter,
  targetX: number,
  targetY: number,
  updateSprite: SpriteUpdater
): Promise<void> {
  const sprite = getSpriteState();
  const startX = sprite.x;
  const startY = sprite.y;
  const duration = 500; // ms
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + (targetX - startX) * progress;
      const currentY = startY + (targetY - startY) * progress;
      
      updateSprite({ x: currentX, y: currentY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

/**
 * Animate go to x, y
 */
async function animateGoTo(
  getSpriteState: SpriteGetter,
  x: number,
  y: number,
  updateSprite: SpriteUpdater
): Promise<void> {
  return animateToPosition(getSpriteState, x, y, updateSprite);
}

/**
 * Show speech or thought bubble
 */
async function showBubble(
  text: string,
  seconds: number,
  type: 'say' | 'think',
  updateSprite: SpriteUpdater
): Promise<void> {
  updateSprite({ bubbleText: text, bubbleType: type });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      updateSprite({ bubbleText: '', bubbleType: null });
      resolve();
    }, seconds * 1000);
  });
}

/**
 * Execute an entire script sequentially
 */
export async function executeScript(
  blocks: Block[],
  getSpriteState: SpriteGetter,
  updateSprite: SpriteUpdater,
  shouldStop: () => boolean
): Promise<void> {
  for (const block of blocks) {
    if (shouldStop()) {
      break;
    }
    await executeBlock(block, getSpriteState, updateSprite);
  }
}
