import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

export default function MatrixNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);
  const grid = data.grid || [];

  const handleValueChange = (rIdx, cIdx, newValue) => {
    const newGrid = grid.map((row, r) =>
      row.map((val, c) => (r === rIdx && c === cIdx ? newValue : val))
    );
    updateNodeData(id, { grid: newGrid });
  };

  const outerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  const topRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '32px', // 30px (left column) + 2px (grid left border)
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#666',
    border: 'none',
  };

  const colLabelStyle = {
    ...labelStyle,
    width: '64px', // Matches the cell width
  };

  const rowLabelStyle = {
    ...labelStyle,
    height: '64px', // Matches the cell height
    width: '30px',
  };

  const mainAreaStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '2px', // Matches the grid top border
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
    width: '64px',
    height: '64px',
    borderRight: '1px solid #dcd7ca',
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
    width: '40px',
    outline: 'none',
  };

  const invisibleHandleStyle = {
    opacity: 0,
    width: '10px',
    height: '10px',
    border: 'none',
  };

  const colControlsStyle = {
    position: 'absolute',
    right: '-32px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };
  
  const rowControlsStyle = {
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

  const currentRows = grid.length;
  const currentCols = grid[0]?.length || 1;

  const customControls = (
    <>
      <div style={colControlsStyle}>
        <button style={btnStyle} onClick={() => updateNodeStructure(id, { rows: currentRows, cols: currentCols + 1 })}>+</button>
        <button style={btnStyle} onClick={() => updateNodeStructure(id, { rows: currentRows, cols: Math.max(1, currentCols - 1) })}>-</button>
      </div>
      <div style={rowControlsStyle}>
        <button style={btnStyle} onClick={() => updateNodeStructure(id, { rows: currentRows + 1, cols: currentCols })}>+</button>
        <button style={btnStyle} onClick={() => updateNodeStructure(id, { rows: Math.max(1, currentRows - 1), cols: currentCols })}>-</button>
      </div>
    </>
  );

  return (
    <div style={outerContainerStyle}>
      {grid.length > 0 && (
        <div style={topRowStyle}>
          {grid[0].map((_, cIdx) => (
            <div key={`col-label-${cIdx}`} style={colLabelStyle}>
              {cIdx}
            </div>
          ))}
        </div>
      )}

      <div style={mainAreaStyle}>
        <div style={leftColumnStyle}>
          {grid.map((_, rIdx) => (
            <div key={`row-label-${rIdx}`} style={rowLabelStyle}>
              {rIdx}
            </div>
          ))}
        </div>

        <BaseNodeWrapper
          id={id}
          selected={selected}
          dragHandlePosition="top"
          controls={customControls}
        >
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
                    onFocus={(e) => { useStore.getState().saveHistory(); e.target.select(); }}
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
        </BaseNodeWrapper>
      </div>
    </div>
  );
}
