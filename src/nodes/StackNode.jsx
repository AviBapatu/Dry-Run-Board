import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

export default function StackNode({ id, data, selected }) {
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-secondary)',
    minWidth: '60px',
  };

  const lastCellStyle = {
    ...cellStyle,
    borderBottom: 'none',
  };

  const inputStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
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
    <BaseNodeWrapper
      id={id}
      selected={selected}
      dragHandlePosition="top"
      onAdd={() => updateNodeStructure(id, { length: values.length + 1 })}
      onRemove={() => updateNodeStructure(id, { length: Math.max(1, values.length - 1) })}
    >
      {values.map((val, idx) => (
        <div key={idx} style={idx === values.length - 1 ? lastCellStyle : cellStyle}>
          <Handle type="target" position={Position.Left} id={`target-${idx}`} style={{ ...invisibleHandleStyle, left: 0 }} />
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
            onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
          />
          <Handle type="source" position={Position.Right} id={`source-${idx}`} style={{ ...invisibleHandleStyle, right: 0 }} />
        </div>
      ))}
    </BaseNodeWrapper>
  );
}
