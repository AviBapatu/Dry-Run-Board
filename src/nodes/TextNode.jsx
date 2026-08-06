import React, { useState, useEffect, useRef } from 'react';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import useStore from '../store';

export default function TextNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!selected) setIsEditing(false);
  }, [selected]);

  useEffect(() => {
    if (isEditing && textareaRef.current) textareaRef.current.focus();
  }, [isEditing]);

  const handleChange = (e) => {
    updateNodeData(id, { text: e.target.value });
  };

  const containerStyle = {
    position: 'relative',
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    overflow: 'visible',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    cursor: isEditing ? 'text' : 'grab',
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
    flexShrink: 0,
  };

  const textareaStyle = {
    width: '100%',
    flexGrow: 1,
    fontSize: '14px',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    color: '#2c2c2c',
    background: 'transparent',
    border: 'none',
    resize: 'none',
    outline: 'none',
    overflow: 'auto',
    padding: '8px 10px',
    boxSizing: 'border-box',
    cursor: isEditing ? 'text' : 'grab',
    pointerEvents: isEditing ? 'auto' : 'none',
    caretColor: isEditing ? '#2c2c2c' : 'transparent',
  };

  const handleDotStyle = {
    width: '16px',
    height: '16px',
    background: '#2c2c2c',
    border: '2px solid #f4f1ea',
  };

  return (
    <>
      <NodeResizer
        color="#2c2c2c"
        isVisible={selected}
        minWidth={120}
        minHeight={60}
        handleStyle={{
          width: 14,
          height: 14,
          border: '2px solid #2c2c2c',
          background: '#f4f1ea',
          borderRadius: '2px',
        }}
      />
      <div
        style={containerStyle}
        onDoubleClick={(e) => {
          if (e.target.closest('.react-flow__handle')) return;
          if (e.target.closest('[data-dragbar]')) return;
          setIsEditing(true);
        }}
      >
        <Handle type="target" position={Position.Left} id="note-target" style={handleDotStyle} />
        <Handle type="source" position={Position.Right} id="note-source" style={handleDotStyle} />
        <div style={dragHandleStyle} data-dragbar="true">
          &#8943;
        </div>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="nodrag"
            style={textareaStyle}
            value={data.text || ''}
            onChange={handleChange}
            placeholder="Type a note..."
            onBlur={() => setIsEditing(false)}
            onFocus={() => useStore.getState().saveHistory()}
          />
        ) : (
          <div style={{ ...textareaStyle, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {data.text || <span style={{ color: '#999' }}>Double-click to type...</span>}
          </div>
        )}
      </div>
    </>
  );
}

