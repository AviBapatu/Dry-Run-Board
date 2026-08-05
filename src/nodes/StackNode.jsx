import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function StackNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const values = data.values || [];

  const handleValueChange = (idx, newValue) => {
    const newValues = [...values];
    newValues[idx] = newValue;
    updateNodeData(id, { values: newValues });
  };
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '3px 3px 0px #2c2c2c',
  };

  const cellStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderBottom: '1px solid #dcd7ca',
    minWidth: '60px',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderBottom: 'none',
  };

  const inputStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c2c2c',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    width: '40px',
    outline: 'none',
  };

  const invisibleHandleStyle = {
    opacity: 0,
    width: '10px',
    height: '10px',
    border: 'none',
  };

  return (
    <div style={containerStyle}>
      {values.map((val, idx) => (
        <div key={idx} style={idx === values.length - 1 ? lastCellStyle : cellStyle}>
          <Handle type="target" position={Position.Left} id={`target-${idx}`} style={{ ...invisibleHandleStyle, left: 0 }} />
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
          />
          <Handle type="source" position={Position.Right} id={`source-${idx}`} style={{ ...invisibleHandleStyle, right: 0 }} />
        </div>
      ))}
    </div>
  );
}
