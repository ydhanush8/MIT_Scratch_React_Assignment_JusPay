'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScratchStore } from './useScratchStore';
import { executeScript } from '@/lib/blockExecutor';
import { findCollidingPairs, getCollisionPairKey } from '@/lib/collisionUtils';

export function useAnimationEngine() {
  const { sprites, isPlaying, updateSprite, swapScripts, setPlaying } = useScratchStore();
  const animationRef = useRef<number | null>(null);
  const executingSprites = useRef<Set<string>>(new Set());
  const shouldStopRef = useRef(false);
  const handledCollisions = useRef<Set<string>>(new Set());
  
  const stopAnimation = useCallback(() => {
    shouldStopRef.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    executingSprites.current.clear();
    handledCollisions.current.clear();
    setPlaying(false);
  }, [setPlaying]);
  
  const startAnimation = useCallback(async () => {
    shouldStopRef.current = false;
    handledCollisions.current.clear();
    setPlaying(true);
    
    // Start execution for all sprites simultaneously
    sprites.forEach((sprite) => {
      if (sprite.script.length > 0) {
        executingSprites.current.add(sprite.id);
        
        // Get fresh sprite reference for execution
        const getCurrentSprite = () => {
          return useScratchStore.getState().getSpriteById(sprite.id);
        };
        
        executeScript(
          sprite.script,
          sprite,
          (updates) => updateSprite(sprite.id, updates),
          () => shouldStopRef.current
        ).then(() => {
          executingSprites.current.delete(sprite.id);
          
          // Stop animation when all sprites finish
          if (executingSprites.current.size === 0) {
            stopAnimation();
          }
        });
      }
    });
    
    // Start collision detection loop
    const checkCollisions = () => {
      if (shouldStopRef.current) return;
      
      const currentSprites = useScratchStore.getState().sprites;
      const collidingPairs = findCollidingPairs(currentSprites);
      
      collidingPairs.forEach((pair) => {
        const pairKey = getCollisionPairKey(pair.sprite1Id, pair.sprite2Id);
        
        // Only handle each collision pair once
        if (!handledCollisions.current.has(pairKey)) {
          handledCollisions.current.add(pairKey);
          console.log(`Collision detected between ${pair.sprite1Id} and ${pair.sprite2Id}`);
          swapScripts(pair.sprite1Id, pair.sprite2Id);
        }
      });
      
      // Remove collision pairs that are no longer colliding
      const currentPairKeys = new Set(
        collidingPairs.map((p) => getCollisionPairKey(p.sprite1Id, p.sprite2Id))
      );
      handledCollisions.current.forEach((key) => {
        if (!currentPairKeys.has(key)) {
          handledCollisions.current.delete(key);
        }
      });
      
      animationRef.current = requestAnimationFrame(checkCollisions);
    };
    
    checkCollisions();
  }, [sprites, updateSprite, swapScripts, setPlaying, stopAnimation]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return {
    startAnimation,
    stopAnimation,
    isPlaying,
  };
}
