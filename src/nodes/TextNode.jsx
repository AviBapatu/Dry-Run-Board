import React, { useRef, useEffect } from 'react';
import useStore from '../store';

export default function TextNode({ id, data, selected }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [data.text]);

  const handleChange = (e) => {
    updateNodeData(id, { text: e.target.value });
    adjustHeight();
  };

  const containerStyle = {
    backgroundColor: '#fef3c7', // light yellow for a note vibe, or we can use standard #f4f1ea
    border: selected ? '2px solid #2c2c2c' : '2px solid transparent',
    padding: '8px',
    boxShadow: selected ? '4px 4px 0px #2c2c2c' : 'none',
    minWidth: '150px',
    transition: 'all 0.1s ease',
  };

  // Override to standard theme color for consistency if desired, let's use a slight yellow tint for notes
  containerStyle.backgroundColor = '#fffbeb'; 
  containerStyle.border = '2px solid #2c2c2c';
  containerStyle.boxShadow = '2px 2px 0px #2c2c2c';

  const textareaStyle = {
    width: '100%',
    minHeight: '40px',
    fontSize: '16px',
    fontFamily: 'inherit',
    color: '#2c2c2c',
    background: 'transparent',
    border: 'none',
    resize: 'none',
    outline: 'none',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <textarea
        ref={textareaRef}
        className="nodrag"
        style={textareaStyle}
        value={data.text || ''}
        onChange={handleChange}
        placeholder="Type a note..."
        onFocus={() => useStore.getState().saveHistory()}
      />
    </div>
  );
}
