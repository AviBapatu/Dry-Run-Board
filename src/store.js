import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      past: [],
      future: [],
      
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
          if (newDimensions.length !== undefined && node.data.entries) {
            const currentEntries = node.data.entries;
            const newLength = newDimensions.length;
            const newEntries = Array.from({ length: newLength }, (_, i) => 
              i < currentEntries.length ? currentEntries[i] : { key: 'k', value: 'v' }
            );
            return { ...node, data: { ...node.data, entries: newEntries } };
          }
          if (newDimensions.length !== undefined && node.data.values) {
            const currentValues = node.data.values;
            const newLength = newDimensions.length;
            const newValues = Array.from({ length: newLength }, (_, i) => 
              i < currentValues.length ? currentValues[i] : '0'
            );
            return { ...node, data: { ...node.data, values: newValues } };
          }
          if (newDimensions.rows !== undefined && newDimensions.cols !== undefined && node.data.grid) {
            const currentGrid = node.data.grid;
            const newRows = newDimensions.rows;
            const newCols = newDimensions.cols;
            const newGrid = Array.from({ length: newRows }, (_, r) => 
              Array.from({ length: newCols }, (_, c) => {
                if (r < currentGrid.length && c < currentGrid[r].length) {
                  return currentGrid[r][c];
                }
                return '0';
              })
            );
            return { ...node, data: { ...node.data, grid: newGrid } };
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
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
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
    }),
    {
      name: 'dry-run-board-storage',
    }
  )
);

export default useStore;
