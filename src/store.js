import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const getDims = (node) => {
  if (node.measured && node.measured.width) {
    return { w: node.measured.width, h: node.measured.height };
  }
  if (node.width) {
    return { w: node.width, h: node.height };
  }
  return { w: 100, h: 100 };
};

const isOverlapping = (nodeA, nodeB) => {
  const dimA = getDims(nodeA);
  const dimB = getDims(nodeB);
  
  const a = { x: nodeA.position.x, y: nodeA.position.y, w: dimA.w, h: dimA.h };
  const b = { x: nodeB.position.x, y: nodeB.position.y, w: dimB.w, h: dimB.h };
  
  const buffer = 10;
  
  return (
    a.x < b.x + b.w + buffer &&
    a.x + a.w + buffer > b.x &&
    a.y < b.y + b.h + buffer &&
    a.y + a.h + buffer > b.y
  );
};

const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      past: [],
      future: [],
      clipboard: [],
      
      saveHistory: () => {
        set((state) => {
          const newPast = [...state.past, { nodes: state.nodes, edges: state.edges }].slice(-50);
          return { past: newPast, future: [] };
        });
      },
      
      undo: () => {
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, state.past.length - 1);
          return {
            past: newPast,
            future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
            nodes: previous.nodes,
            edges: previous.edges,
          };
        });
      },
    
      redo: () => {
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          return {
            past: [...state.past, { nodes: state.nodes, edges: state.edges }],
            future: newFuture,
            nodes: next.nodes,
            edges: next.edges,
          };
        });
      },

      copySelected: () => {
        set((state) => {
          const selectedNodes = state.nodes.filter(n => n.selected);
          return { clipboard: JSON.parse(JSON.stringify(selectedNodes)) };
        });
      },

      pasteClipboard: (canvasPos) => {
        get().saveHistory();
        set((state) => {
          if (!state.clipboard || state.clipboard.length === 0) return state;
          
          let offsetX = 30;
          let offsetY = 30;
          
          if (canvasPos) {
            const firstNode = state.clipboard[0];
            offsetX = canvasPos.x - firstNode.position.x;
            offsetY = canvasPos.y - firstNode.position.y;
          }

          const newNodes = state.clipboard.map((node, index) => {
            return {
              ...JSON.parse(JSON.stringify(node)),
              id: `${node.type}-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
              selected: true,
              position: {
                x: node.position.x + offsetX,
                y: node.position.y + offsetY
              }
            };
          });

          const updatedNodes = state.nodes.map(n => ({ ...n, selected: false })).concat(newNodes);
          
          return { nodes: updatedNodes };
        });
      },

      clearCanvas: () => {
        get().saveHistory();
        set({ nodes: [], edges: [] });
      },
  
  updateNodeData: (nodeId, dataUpdate) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...dataUpdate } };
        }
        return node;
      }),
    });
  },

  updateNodeStructure: (id, newDimensions) => {
    get().saveHistory();
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          let pos = { ...node.position };
          
          if (newDimensions.length !== undefined && node.data.entries) {
            const currentEntries = node.data.entries;
            const newLength = newDimensions.length;
            const diff = newLength - currentEntries.length;
            pos.y -= diff * 36;
            
            const newEntries = Array.from({ length: newLength }, (_, i) => 
              i < currentEntries.length ? currentEntries[i] : { key: 'k', value: 'v' }
            );
            return { ...node, position: pos, data: { ...node.data, entries: newEntries } };
          }
          if (newDimensions.length !== undefined && node.data.values) {
            const currentValues = node.data.values;
            const newLength = newDimensions.length;
            const diff = newLength - currentValues.length;
            
            if (node.type === 'stackNode') pos.y -= diff * 36;
            else pos.x -= diff * 57;
            
            const newValues = Array.from({ length: newLength }, (_, i) => 
              i < currentValues.length ? currentValues[i] : '0'
            );
            return { ...node, position: pos, data: { ...node.data, values: newValues } };
          }
          if (newDimensions.rows !== undefined && newDimensions.cols !== undefined && node.data.grid) {
            const currentGrid = node.data.grid;
            const newRows = newDimensions.rows;
            const newCols = newDimensions.cols;
            const diffRows = newRows - currentGrid.length;
            const diffCols = newCols - (currentGrid[0]?.length || 1);
            
            pos.y -= diffRows * 36;
            pos.x -= diffCols * 57;
            
            const newGrid = Array.from({ length: newRows }, (_, r) => 
              Array.from({ length: newCols }, (_, c) => {
                if (r < currentGrid.length && c < currentGrid[r].length) {
                  return currentGrid[r][c];
                }
                return '0';
              })
            );
            return { ...node, position: pos, data: { ...node.data, grid: newGrid } };
          }
        }
        return node;
      }),
    });
  },

  selectNode: (id) => {
    set({
      nodes: get().nodes.map(n => ({
        ...n,
        selected: n.id === id
      }))
    });
  },
  
  onNodesChange: (changes) => {
    if (changes.some(c => c.type === 'remove')) get().saveHistory();
    
    const nextNodes = applyNodeChanges(changes, get().nodes);
    
    const positionChanges = changes.filter(c => c.type === 'position' && c.position);
    if (positionChanges.length > 0) {
      let hasNewCollision = false;
      const movedNodeIds = new Set(positionChanges.map(c => c.id));
      
      for (const nodeId of movedNodeIds) {
        const movedNodeNext = nextNodes.find(n => n.id === nodeId);
        const movedNodePrev = get().nodes.find(n => n.id === nodeId);
        if (!movedNodeNext || !movedNodePrev) continue;
        
        for (const otherNode of nextNodes) {
          if (otherNode.id === nodeId) continue;
          
          const isCollidingNow = isOverlapping(movedNodeNext, otherNode);
          if (isCollidingNow) {
            const otherNodePrev = get().nodes.find(n => n.id === otherNode.id);
            const wasCollidingBefore = otherNodePrev ? isOverlapping(movedNodePrev, otherNodePrev) : false;
            
            if (!wasCollidingBefore) {
              hasNewCollision = true;
              break;
            }
          }
        }
        if (hasNewCollision) break;
      }
      
      if (hasNewCollision) {
        const nonPosChanges = changes.filter(c => c.type !== 'position' || !c.position);
        set({ nodes: applyNodeChanges(nonPosChanges, get().nodes) });
        return;
      }
    }
    
    set({ nodes: nextNodes });
  },
  
  onEdgesChange: (changes) => {
    if (changes.some(c => c.type === 'remove')) get().saveHistory();
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    get().saveHistory();
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  spawnArray: (values, pos) => {
    get().saveHistory();
    const id = `array-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'arrayNode', position, data: { values } };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  spawnMatrix: (grid, pos) => {
    get().saveHistory();
    const id = `matrix-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'matrixNode', position, data: { grid } };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  spawnNode: (value, pos) => {
    get().saveHistory();
    const id = `node-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'graphNode', position, data: { value } };
    set({ nodes: [...get().nodes, newNode] });
    return id;
  },

  addManualEdge: (source, target, sourceHandle, targetHandle) => {
    const id = `e-${source}-${target}-${Math.random().toString(36).substring(2,6)}`;
    set({ edges: [...get().edges, { id, source, target, sourceHandle, targetHandle }] });
  },

  spawnStack: (values, pos) => {
    get().saveHistory();
    const id = `stack-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'stackNode', position, data: { values } };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnQueue: (values, pos) => {
    get().saveHistory();
    const id = `queue-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'queueNode', position, data: { values } };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnMap: (entries, pos) => {
    get().saveHistory();
    const id = `map-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'mapNode', position, data: { entries } };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnText: (text, pos) => {
    get().saveHistory();
    const id = `text-${Math.random().toString(36).substring(2, 11)}`;
    const position = pos || { x: 100 + Math.floor(Math.random() * 50), y: 100 + Math.floor(Math.random() * 50) };
    const newNode = { id, type: 'textNode', position, data: { text } };
    set({ nodes: [...get().nodes, newNode] });
  },
    }),
    {
      name: 'dry-run-board-storage',
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    }
  )
);

export default useStore;
