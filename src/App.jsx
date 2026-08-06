import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from './store';
import ArrayNode from './nodes/ArrayNode';
import MatrixNode from './nodes/MatrixNode';
import GraphNode from './nodes/GraphNode';
import StackNode from './nodes/StackNode';
import QueueNode from './nodes/QueueNode';
import MapNode from './nodes/MapNode';
import TextNode from './nodes/TextNode';
import ControlPanel from './components/ControlPanel';
import PropertiesPanel from './components/PropertiesPanel';
import UpdatePanel from './components/UpdatePanel';
import CodeInitializer from './components/CodeInitializer';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Define the custom node types outside the component to avoid re-renders
const nodeTypes = {
  arrayNode: ArrayNode,
  matrixNode: MatrixNode,
  graphNode: GraphNode,
  stackNode: StackNode,
  queueNode: QueueNode,
  mapNode: MapNode,
  textNode: TextNode,
};

export default function App() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const selectNode = useStore((state) => state.selectNode);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();
  const theme = useStore((state) => state.theme);
  const isSettingsOpen = useStore((state) => state.isSettingsOpen);
  const toggleSettings = useStore((state) => state.toggleSettings);
  const isAIGenOpen = useStore((state) => state.isAIGenOpen);

  useEffect(() => {
    const trackMouse = (e) => {
      window.lastMousePos = { x: e.clientX, y: e.clientY };
    };
    
    const handleGlobalKeydown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+' || e.key === '-') {
          e.preventDefault();
          if (e.key === '-') zoomOut();
          else zoomIn();
        } else if (e.key === '0') {
          e.preventDefault();
          fitView({ maxZoom: 1, padding: 0.2 });
        } else if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) useStore.getState().redo();
          else useStore.getState().undo();
        } else if (e.key.toLowerCase() === 'c') {
          useStore.getState().copySelected();
        } else if (e.key.toLowerCase() === 'v') {
          let pos = null;
          if (window.lastMousePos) {
            pos = screenToFlowPosition({ x: window.lastMousePos.x, y: window.lastMousePos.y });
          }
          useStore.getState().pasteClipboard(pos);
        } else if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          useStore.getState().toggleAIGen();
        }
      } else if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'i') {
        // Also allow 'i' without modifiers, as long as we're not focused on an input
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          useStore.getState().toggleAIGen();
        }
      }
    };

    window.addEventListener('mousemove', trackMouse);
    window.addEventListener('keydown', handleGlobalKeydown, { passive: false });
    return () => {
      window.removeEventListener('mousemove', trackMouse);
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, [zoomIn, zoomOut]);

  useKeyboardShortcuts();

  const onNodeMouseEnter = (event, node) => {
    selectNode(node.id);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeDragStart={() => useStore.getState().saveHistory()}
          nodeTypes={nodeTypes}
          panOnScroll={true}
          zoomOnScroll={false}
          proOptions={{ hideAttribution: true }}
          multiSelectionKeyCode={['Control', 'Meta', 'Shift']}
          connectionMode="loose"
          fitView
          fitViewOptions={{ maxZoom: 1.1, padding: 0.2 }}
        >
          <Background variant="dots" color="var(--border-secondary)" gap={16} size={1.5} />
          <Controls style={{ boxShadow: '2px 2px 0px var(--shadow-primary)', border: '2px solid var(--border-primary)', borderRadius: '0', backgroundColor: 'var(--bg-primary)' }} />
          <ControlPanel />
          {isAIGenOpen && <CodeInitializer />}
          <PropertiesPanel />
          <UpdatePanel isOpen={isSettingsOpen} onClose={toggleSettings} />
      </ReactFlow>
    </div>
  );
}
