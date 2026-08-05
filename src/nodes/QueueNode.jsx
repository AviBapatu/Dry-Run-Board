import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function QueueNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const values = data.values || [];

  const handleValueChange = (idx, newValue) => {
    const newValues = [...values];
    newValues[idx] = newValue;
    updateNodeData(id, { values: newValues });
  };
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f4f1ea',
    borderTop: '2px solid #2c2c2c',
    borderBottom: '2px solid #2c2c2c',
    borderLeft: 'none',
    borderRight: 'none',
    boxShadow: '0px 3px 0px #2c2c2c',
  };

  const cellStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRight: '1px dashed #dcd7ca',
    minWidth: '40px',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderRight: 'none',
  };

  const inputStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c2c2c',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    width: '32px',
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
      {values.map((val, idx) => (
        <div key={idx} style={idx === values.length - 1 ? lastCellStyle : cellStyle}>
          <Handle type="target" position={Position.Top} id={`target-${idx}`} style={{ ...handleStyle, top: -4 }} />
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
          />
          <Handle type="source" position={Position.Bottom} id={`source-${idx}`} style={{ ...handleStyle, bottom: -4 }} />
        </div>
      ))}
    </div>
  );
}
