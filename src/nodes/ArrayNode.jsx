import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

export default function ArrayNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);
  const values = data.values || [];

  const handleValueChange = (idx, newValue) => {
    const newValues = [...values];
    newValues[idx] = newValue;
    updateNodeData(id, { values: newValues });
  };
  
  const cellStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRight: '1px solid var(--border-secondary)',
    minWidth: '40px',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderRight: 'none',
  };

  const indexStyle = {
    fontSize: '10px',
    color: 'var(--text-primary)',
    opacity: 0.7,
    marginBottom: '4px',
  };

  const inputStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
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
    <BaseNodeWrapper
      id={id}
      selected={selected}
      dragHandlePosition="left"
      onAdd={() => updateNodeStructure(id, { length: values.length + 1 })}
      onRemove={() => updateNodeStructure(id, { length: Math.max(1, values.length - 1) })}
    >
      {values.map((val, idx) => (
        <div key={idx} style={idx === values.length - 1 ? lastCellStyle : cellStyle}>
          <div style={indexStyle}>{idx}</div>
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
            onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
          />
        </div>
      ))}
    </BaseNodeWrapper>
  );
}
