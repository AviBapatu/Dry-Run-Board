import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../store';
import BaseNodeWrapper from '../components/BaseNodeWrapper';

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

  const customHandles = (
    <>
      <Handle type="target" position={Position.Left} id="note-target" style={handleDotStyle} />
      <Handle type="source" position={Position.Right} id="note-source" style={handleDotStyle} />
    </>
  );

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      dragHandlePosition="top"
      showResizer={true}
      customHandles={customHandles}
      containerStyleOverrides={{
        width: '100%',
        height: '100%',
        cursor: isEditing ? 'text' : 'grab',
      }}
      onDoubleClick={(e) => {
        if (e.target.closest('.react-flow__handle')) return;
        if (e.target.closest('[data-dragbar]')) return;
        setIsEditing(true);
      }}
    >
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
    </BaseNodeWrapper>
  );
}
