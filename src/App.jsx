import React, { useEffect } from 'react';
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

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

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await check();
        if (update) {
          const yes = await ask(`Update to version ${update.version} is available!\n\nRelease notes: ${update.body}\n\nDo you want to install it?`, { 
            title: 'Update Available', 
            kind: 'info',
            okLabel: 'Update',
            cancelLabel: 'Cancel'
          });
          if (yes) {
            await update.downloadAndInstall();
            await relaunch();
          }
        }
      } catch (e) {
        console.error('Failed to check for updates:', e);
      }
    };
    
    // Only check for updates in Tauri environment (not web browser)
    if (window.__TAURI_INTERNALS__) {
      checkForUpdates();
    }
  }, []);

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
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f4f1ea' }}>
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
          <Background variant="dots" color="#dcd7ca" gap={16} size={1.5} />
          <Controls style={{ boxShadow: '2px 2px 0px #2c2c2c', border: '2px solid #2c2c2c', borderRadius: '0', backgroundColor: '#f4f1ea' }} />
          <ControlPanel />
          <PropertiesPanel />
      </ReactFlow>
    </div>
  );
}
