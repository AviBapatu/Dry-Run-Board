import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function GraphNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const spawnNode = useStore((state) => state.spawnNode);
  const addManualEdge = useStore((state) => state.addManualEdge);
  const nodes = useStore((state) => state.nodes);

  const handleValueChange = (e) => {
    updateNodeData(id, { value: e.target.value });
  };

  const handleHandleClick = (e, direction, handleId, handleType) => {
    e.stopPropagation();
    const thisNode = nodes.find((n) => n.id === id);
    if (!thisNode) return;
    
    const pos = { ...thisNode.position };
    const offset = 120;
    
    if (direction === 'top') pos.y -= offset;
    if (direction === 'bottom') pos.y += offset;
    if (direction === 'left') pos.x -= offset;
    if (direction === 'right') pos.x += offset;

    const newNodeId = spawnNode('0', pos);
    
    if (handleType === 'source') {
      const oppTarget = direction === 'bottom' ? 'top-target' : 'left-target';
      addManualEdge(id, newNodeId, handleId, oppTarget);
    } else {
      const oppSource = direction === 'top' ? 'bottom-source' : 'right-source';
      addManualEdge(newNodeId, id, oppSource, handleId);
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    borderRadius: '50%',
    position: 'relative',
  };

  const inputStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    width: '40px',
    outline: 'none',
  };

  const handleStyle = {
    background: 'var(--handle-bg)',
    border: 'none',
    width: '8px',
    height: '8px',
  };

  return (
    <div className="data-structure-container" style={containerStyle}>
      <Handle onClick={(e) => handleHandleClick(e, 'top', 'top-target', 'target')} type="target" position={Position.Top} id="top-target" style={handleStyle} />
      <Handle onClick={(e) => handleHandleClick(e, 'bottom', 'bottom-source', 'source')} type="source" position={Position.Bottom} id="bottom-source" style={handleStyle} />
      <Handle onClick={(e) => handleHandleClick(e, 'left', 'left-target', 'target')} type="target" position={Position.Left} id="left-target" style={handleStyle} />
      <Handle onClick={(e) => handleHandleClick(e, 'right', 'right-source', 'source')} type="source" position={Position.Right} id="right-source" style={handleStyle} />
      
      <input 
        className="nodrag"
        style={inputStyle} 
        value={data.value} 
        onChange={handleValueChange} 
        onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
      />
    </div>
  );
}
