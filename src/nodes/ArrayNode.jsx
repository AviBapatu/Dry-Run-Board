import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function ArrayNode({ id, data }) {
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
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '3px 3px 0px #2c2c2c',
  };

  const cellStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRight: '1px solid #dcd7ca',
    minWidth: '40px',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderRight: 'none',
  };

  const indexStyle = {
    fontSize: '10px',
    color: '#2c2c2c',
    opacity: 0.7,
    marginBottom: '4px',
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
          <Handle 
            type="target" 
            position={Position.Top} 
            id={`target-${idx}`} 
            style={{ ...handleStyle, top: -4 }}
          />
          <div style={indexStyle}>{idx}</div>
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
          />
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id={`source-${idx}`} 
            style={{ ...handleStyle, bottom: -4 }}
          />
        </div>
      ))}
    </div>
  );
}
