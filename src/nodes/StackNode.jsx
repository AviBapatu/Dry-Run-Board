import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function StackNode({ id, data, selected }) {
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
    flexDirection: 'column',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'hidden',
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

  const dragHandleStyle = {
    height: '16px',
    backgroundColor: '#dcd7ca',
    borderBottom: '1px solid #2c2c2c',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666',
    lineHeight: '10px',
  };

  const wrapperStyle = { position: 'relative' };
  
  const btnContainerStyle = {
    position: 'absolute',
    bottom: '-32px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
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
        <div style={dragHandleStyle}>&#8943;</div>
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
