import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

export default function BaseNodeWrapper({
  id,
  selected,
  children,
  dragHandlePosition = 'top', // 'top' or 'left'
  onAdd,
  onRemove,
  controls, // custom controls (e.g. for MatrixNode)
  showResizer = false,
  resizerMinWidth = 120,
  resizerMinHeight = 60,
  containerStyleOverrides = {},
  customHandles = null,
  onDoubleClick,
}) {
  const isLeft = dragHandlePosition === 'left';
  
  const containerStyle = {
    display: 'flex',
    flexDirection: isLeft ? 'row' : 'column',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'visible',
    position: 'relative',
    boxSizing: 'border-box',
    width: showResizer ? '100%' : 'auto',
    height: showResizer ? '100%' : 'auto',
    ...containerStyleOverrides,
  };

  const dragHandleStyle = {
    backgroundColor: '#dcd7ca',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666',
    flexShrink: 0,
    position: 'relative',
    ...(isLeft 
      ? { width: '16px', borderRight: '1px solid #2c2c2c', borderBottom: 'none' } 
      : { height: '16px', borderBottom: '1px solid #2c2c2c', borderRight: 'none', lineHeight: '10px' }
    ),
  };

  const handleDotStyle = {
    background: '#2c2c2c',
    border: '2px solid #f4f1ea',
    width: '16px',
    height: '16px',
  };

  const btnContainerStyle = {
    position: 'absolute',
    display: 'flex',
    gap: '6px',
    ...(isLeft 
      ? { right: '-32px', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column' }
      : { bottom: '-32px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'row' }
    ),
  };

  const btnStyle = {
    backgroundColor: '#f4f1ea', border: '2px solid #2c2c2c', color: '#2c2c2c', cursor: 'pointer',
    fontWeight: 'bold', width: '22px', height: '22px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '14px', boxShadow: '2px 2px 0px #2c2c2c', padding: 0,
  };

  return (
    <>
      {showResizer && (
        <NodeResizer
          color="#2c2c2c"
          isVisible={selected}
          minWidth={resizerMinWidth}
          minHeight={resizerMinHeight}
          handleStyle={{
            width: 14,
            height: 14,
            border: '2px solid #2c2c2c',
            background: '#f4f1ea',
            borderRadius: '2px',
          }}
        />
      )}
      
      {/* Wrapper to hold buttons absolutely positioned outside container */}
      <div style={{ position: 'relative', width: showResizer ? '100%' : 'auto', height: showResizer ? '100%' : 'auto' }}>
        <div 
          className="data-structure-container" 
          style={containerStyle}
          onDoubleClick={onDoubleClick}
        >
          <div style={dragHandleStyle} data-dragbar="true">
            {!customHandles && (
              isLeft ? (
                <Handle type="source" position={Position.Left} id="drag-handle-left" style={{ left: '-8px', ...handleDotStyle }} />
              ) : (
                <Handle type="source" position={Position.Top} id="drag-handle-top" style={{ top: '-8px', ...handleDotStyle }} />
              )
            )}
            {isLeft ? '\u22EE' : '\u22EF'}
          </div>
          {customHandles}
          {children}
        </div>

        {selected && (onAdd || onRemove) && !controls && (
          <div style={btnContainerStyle}>
            {onAdd && <button style={btnStyle} onClick={onAdd}>+</button>}
            {onRemove && <button style={btnStyle} onClick={onRemove}>-</button>}
          </div>
        )}
        
        {selected && controls && (
          controls
        )}
      </div>
    </>
  );
}
