import { Sprite } from './types';

const SPRITE_SIZE = 60; // Approximate sprite size for collision detection

export interface CollisionPair {
  sprite1Id: string;
  sprite2Id: string;
}

/**
 * Check if two sprites are colliding using AABB (Axis-Aligned Bounding Box)
 */
export function checkCollision(sprite1: Sprite, sprite2: Sprite): boolean {
  const halfSize = SPRITE_SIZE / 2;
  
  const sprite1Left = sprite1.x - halfSize;
  const sprite1Right = sprite1.x + halfSize;
  const sprite1Top = sprite1.y - halfSize;
  const sprite1Bottom = sprite1.y + halfSize;
  
  const sprite2Left = sprite2.x - halfSize;
  const sprite2Right = sprite2.x + halfSize;
  const sprite2Top = sprite2.y - halfSize;
  const sprite2Bottom = sprite2.y + halfSize;
  
  return (
    sprite1Left < sprite2Right &&
    sprite1Right > sprite2Left &&
    sprite1Top < sprite2Bottom &&
    sprite1Bottom > sprite2Top
  );
}

/**
 * Find all pairs of sprites that are currently colliding
 */
export function findCollidingPairs(sprites: Sprite[]): CollisionPair[] {
  const pairs: CollisionPair[] = [];
  
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      if (checkCollision(sprites[i], sprites[j])) {
        pairs.push({
          sprite1Id: sprites[i].id,
          sprite2Id: sprites[j].id,
        });
      }
    }
  }
  
  return pairs;
}

/**
 * Create a unique key for a collision pair (order-independent)
 */
export function getCollisionPairKey(id1: string, id2: string): string {
  return [id1, id2].sort().join('-');
}
