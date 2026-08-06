import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function ArrayNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);
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
    overflow: 'visible',
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

  const dragHandleStyle = {
    width: '16px',
    backgroundColor: '#dcd7ca',
    borderRight: '1px solid #2c2c2c',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666',
  };

  const wrapperStyle = { position: 'relative' };
  
  const btnContainerStyle = {
    position: 'absolute',
    right: '-32px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const btnStyle = {
    backgroundColor: '#f4f1ea', border: '2px solid #2c2c2c', color: '#2c2c2c', cursor: 'pointer',
    fontWeight: 'bold', width: '22px', height: '22px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '14px', boxShadow: '2px 2px 0px #2c2c2c', padding: 0,
  };

  return (
    <div style={wrapperStyle}>
      <div className="data-structure-container" style={containerStyle}>
        <div style={{ ...dragHandleStyle, position: 'relative' }}>
          <Handle type="source" position={Position.Left} id="drag-handle-left" style={{ left: '-8px', width: '16px', height: '16px', background: '#2c2c2c', border: '2px solid #f4f1ea' }} />
          &#8942;
        </div>
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
              onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
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
      {selected && (
        <div style={btnContainerStyle}>
          <button style={btnStyle} onClick={() => updateNodeStructure(id, { length: values.length + 1 })}>+</button>
          <button style={btnStyle} onClick={() => updateNodeStructure(id, { length: Math.max(1, values.length - 1) })}>-</button>
        </div>
      )}
    </div>
  );
}
