import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import useStore from '../store';

export default function useKeyboardShortcuts() {
  const { screenToFlowPosition } = useReactFlow();
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
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT'
      ) {
        return;
      }

      const position = window.lastMousePos ? screenToFlowPosition(window.lastMousePos) : undefined;

      switch (e.key.toLowerCase()) {
        case 'a':
          spawnArray(['0', '0', '0', '0'], position);
          break;
        case 'q':
          spawnQueue(['0', '0', '0', '0'], position);
          break;
        case 's':
          spawnStack(['0', '0', '0', '0'], position);
          break;
        case 'm':
          spawnMap([{ key: 'k', value: 'v' }], position);
          break;
        case 'x':
          spawnMatrix([
            ['0', '0', '0'],
            ['0', '0', '0'],
            ['0', '0', '0'],
          ], position);
          break;
        case 'g':
          spawnNode('0', position);
          break;
        case 'c':
          if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
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
