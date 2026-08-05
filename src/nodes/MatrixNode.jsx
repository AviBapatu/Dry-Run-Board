import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function MatrixNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const grid = data.grid || [];
  
  const handleValueChange = (rIdx, cIdx, newValue) => {
    const newGrid = grid.map((row, r) => 
      row.map((val, c) => (r === rIdx && c === cIdx ? newValue : val))
    );
    updateNodeData(id, { grid: newGrid });
  };

  const containerStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    boxShadow: '3px 3px 0px #2c2c2c',
    overflow: 'hidden',
  };

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #dcd7ca',
  };

  const lastRowStyle = {
    ...rowStyle,
    borderBottom: 'none',
  };

  const cellStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRight: '1px solid #dcd7ca',
    minWidth: '40px',
    minHeight: '40px',
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

  const invisibleHandleStyle = {
    opacity: 0,
    width: '10px',
    height: '10px',
    border: 'none',
  };

  return (
    <div style={containerStyle}>
      {grid.map((row, rIdx) => (
        <div key={rIdx} style={rIdx === grid.length - 1 ? lastRowStyle : rowStyle}>
          {row.map((val, cIdx) => (
            <div key={cIdx} style={cIdx === row.length - 1 ? lastCellStyle : cellStyle}>
              <Handle 
                type="target" 
                position={Position.Top} 
                id={`target-${rIdx}-${cIdx}`} 
                style={{ ...invisibleHandleStyle, top: 0 }} 
              />
              <input 
                className="nodrag"
                style={inputStyle} 
                value={val} 
                onChange={(e) => handleValueChange(rIdx, cIdx, e.target.value)} 
              />
              <Handle 
                type="source" 
                position={Position.Bottom} 
                id={`source-${rIdx}-${cIdx}`} 
                style={{ ...invisibleHandleStyle, bottom: 0 }} 
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
