import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function GraphNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  const handleValueChange = (e) => {
    updateNodeData(id, { value: e.target.value });
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '50%',
    boxShadow: '3px 3px 0px #2c2c2c',
  };

  const inputStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c2c2c',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    width: '40px',
    outline: 'none',
  };

  const handleStyle = {
    background: '#2c2c2c',
    border: 'none',
    width: '8px',
    height: '8px',
  };

  return (
    <div style={containerStyle}>
      <Handle type="target" position={Position.Top} id="top-target" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left-target" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right-source" style={handleStyle} />
      
      <input 
        className="nodrag"
        style={inputStyle} 
        value={data.value} 
        onChange={handleValueChange} 
      />
    </div>
  );
}
