import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

export default function QueueNode({ id, data, selected }) {
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
    <BaseNodeWrapper
      id={id}
      selected={selected}
      dragHandlePosition="left"
      onAdd={() => updateNodeStructure(id, { length: values.length + 1 })}
      onRemove={() => updateNodeStructure(id, { length: Math.max(1, values.length - 1) })}
      containerStyleOverrides={{
        borderLeft: 'none',
        borderRight: 'none',
      }}
    >
      {values.map((val, idx) => (
        <div key={idx} style={idx === values.length - 1 ? lastCellStyle : cellStyle}>
          <Handle type="target" position={Position.Top} id={`target-${idx}`} style={{ ...handleStyle, top: -4 }} />
          <input 
            className="nodrag"
            style={inputStyle} 
            value={val} 
            onChange={(e) => handleValueChange(idx, e.target.value)} 
            onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
          />
          <Handle type="source" position={Position.Bottom} id={`source-${idx}`} style={{ ...handleStyle, bottom: -4 }} />
        </div>
      ))}
    </BaseNodeWrapper>
  );
}
