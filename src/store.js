import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      
      clearCanvas: () => set({ nodes: [], edges: [] }),
  
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
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  spawnArray: (values) => {
    const id = `array-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'arrayNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { values },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  spawnMatrix: (grid) => {
    const id = `matrix-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'matrixNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { grid },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  spawnNode: (value) => {
    const id = `node-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'graphNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { value },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnStack: (values) => {
    const id = `stack-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'stackNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { values },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnQueue: (values) => {
    const id = `queue-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'queueNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { values },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  spawnMap: (entries) => {
    const id = `map-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = {
      id,
      type: 'mapNode',
      position: { 
        x: 100 + Math.floor(Math.random() * 50), 
        y: 100 + Math.floor(Math.random() * 50) 
      },
      data: { entries },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
    }),
    {
      name: 'dry-run-board-storage',
    }
  )
);

export default useStore;
