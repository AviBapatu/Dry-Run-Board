import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function MapNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const entries = data.entries || [];

  const handleKeyChange = (idx, newKey) => {
    const newEntries = [...entries];
    newEntries[idx] = { ...newEntries[idx], key: newKey };
    updateNodeData(id, { entries: newEntries });
  };

  const handleValueChange = (idx, newValue) => {
    const newEntries = [...entries];
    newEntries[idx] = { ...newEntries[idx], value: newValue };
    updateNodeData(id, { entries: newEntries });
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

  const rowStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #dcd7ca',
  };

  const lastRowStyle = {
    ...rowStyle,
    borderBottom: 'none',
  };

  const cellStyle = {
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const keyCellStyle = {
    ...cellStyle,
    borderRight: '2px solid #2c2c2c',
    backgroundColor: '#eaddc8',
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

  const handleStyle = {
    background: '#2c2c2c',
    border: 'none',
    width: '8px',
    height: '8px',
  };

  return (
    <div style={containerStyle}>
      {entries.map((entry, idx) => (
        <div key={idx} style={idx === entries.length - 1 ? lastRowStyle : rowStyle}>
          <Handle type="target" position={Position.Left} id={`target-${idx}`} style={{ ...handleStyle, left: -4 }} />
          <div style={keyCellStyle}>
            <input 
              className="nodrag"
              style={inputStyle} 
              value={entry.key} 
              onChange={(e) => handleKeyChange(idx, e.target.value)} 
            />
          </div>
          <div style={cellStyle}>
            <input 
              className="nodrag"
              style={inputStyle} 
              value={entry.value} 
              onChange={(e) => handleValueChange(idx, e.target.value)} 
            />
          </div>
          <Handle type="source" position={Position.Right} id={`source-${idx}`} style={{ ...handleStyle, right: -4 }} />
        </div>
      ))}
    </div>
  );
}
