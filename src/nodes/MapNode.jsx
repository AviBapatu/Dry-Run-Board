import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

export default function MapNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);
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
    <BaseNodeWrapper
      id={id}
      selected={selected}
      dragHandlePosition="top"
      onAdd={() => updateNodeStructure(id, { length: entries.length + 1 })}
      onRemove={() => updateNodeStructure(id, { length: Math.max(1, entries.length - 1) })}
    >
      {entries.map((entry, idx) => (
        <div key={idx} style={idx === entries.length - 1 ? lastRowStyle : rowStyle}>
          <Handle type="target" position={Position.Left} id={`target-${idx}`} style={{ ...handleStyle, left: -4 }} />
          <div style={keyCellStyle}>
            <input 
              className="nodrag"
              style={inputStyle} 
              value={entry.key} 
              onChange={(e) => handleKeyChange(idx, e.target.value)} 
              onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
            />
          </div>
          <div style={cellStyle}>
            <input 
              className="nodrag"
              style={inputStyle} 
              value={entry.value} 
              onChange={(e) => handleValueChange(idx, e.target.value)} 
              onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
            />
          </div>
          <Handle type="source" position={Position.Right} id={`source-${idx}`} style={{ ...handleStyle, right: -4 }} />
        </div>
      ))}
    </BaseNodeWrapper>
  );
}
