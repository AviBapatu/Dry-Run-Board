import React, { useEffect } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from './store';
import ArrayNode from './nodes/ArrayNode';
import MatrixNode from './nodes/MatrixNode';
import GraphNode from './nodes/GraphNode';
import StackNode from './nodes/StackNode';
import QueueNode from './nodes/QueueNode';
import MapNode from './nodes/MapNode';
import ControlPanel from './components/ControlPanel';
import PropertiesPanel from './components/PropertiesPanel';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Define the custom node types outside the component to avoid re-renders
const nodeTypes = {
  arrayNode: ArrayNode,
  matrixNode: MatrixNode,
  graphNode: GraphNode,
  stackNode: StackNode,
  queueNode: QueueNode,
  mapNode: MapNode,
};

export default function App() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const selectNode = useStore((state) => state.selectNode);

  useEffect(() => {
    const trackMouse = (e) => {
      window.lastMousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  useKeyboardShortcuts();

  const onNodeMouseEnter = (event, node) => {
    selectNode(node.id);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f4f1ea' }}>
      <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeMouseEnter={onNodeMouseEnter}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant="dots" color="#dcd7ca" gap={16} size={1.5} />
          <Controls style={{ boxShadow: '2px 2px 0px #2c2c2c', border: '2px solid #2c2c2c', borderRadius: '0', backgroundColor: '#f4f1ea' }} />
          <ControlPanel />
          <PropertiesPanel />
      </ReactFlow>
    </div>
  );
}
