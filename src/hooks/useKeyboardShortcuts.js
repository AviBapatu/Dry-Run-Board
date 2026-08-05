import { useEffect } from 'react';
import useStore from '../store';

export default function useKeyboardShortcuts() {
  const spawnArray = useStore((state) => state.spawnArray);
  const spawnMatrix = useStore((state) => state.spawnMatrix);
  const spawnNode = useStore((state) => state.spawnNode);
  const spawnStack = useStore((state) => state.spawnStack);
  const spawnQueue = useStore((state) => state.spawnQueue);
  const spawnMap = useStore((state) => state.spawnMap);
  const clearCanvas = useStore((state) => state.clearCanvas);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if the user is typing inside a node (input/textarea)
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || 
         document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
          spawnArray(['0', '0', '0', '0']);
          break;
        case 'm':
          spawnMap([{ key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' }]);
          break;
        case 'q':
          spawnQueue(['0', '0', '0', '0']);
          break;
        case 's':
          spawnStack(['0', '0', '0', '0']);
          break;
        case 'x':
          spawnMatrix([['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0']]);
          break;
        case 'g':
          spawnNode('A');
          break;
        case 'c':
          // Require alt/ctrl for clear so they don't accidentally wipe it
          if (e.altKey || e.ctrlKey || e.metaKey) { 
             clearCanvas();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [spawnArray, spawnMatrix, spawnNode, spawnStack, spawnQueue, spawnMap, clearCanvas]);
}
