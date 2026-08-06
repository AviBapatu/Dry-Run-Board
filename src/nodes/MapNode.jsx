import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

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
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'visible',
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
        <div style={{ ...dragHandleStyle, position: 'relative' }}>
          <Handle type="source" position={Position.Top} id="drag-handle-top" style={{ top: '-8px', width: '16px', height: '16px', background: '#2c2c2c', border: '2px solid #f4f1ea' }} />
          &#8943;
        </div>
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
      </div>
      {selected && (
        <div style={btnContainerStyle}>
          <button style={btnStyle} onClick={() => updateNodeStructure(id, { length: entries.length + 1 })}>+</button>
          <button style={btnStyle} onClick={() => updateNodeStructure(id, { length: Math.max(1, entries.length - 1) })}>-</button>
        </div>
      )}
    </div>
  );
}
