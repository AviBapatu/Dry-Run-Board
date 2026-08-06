import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { generateCanvasFromCode } from '../lib/codeToCanvas';

export default function CodeInitializer() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 100 });

  const groqApiKey = useStore((state) => state.groqApiKey);
  const openSettings = useStore((state) => state.openSettings);
  const setCanvasState = useStore((state) => state.setCanvasState);
  const toggleAIGen = useStore((state) => state.toggleAIGen);

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...pos };

    const handlePointerMove = (ev) => {
      setPos({
        x: initialPos.x + (ev.clientX - startX),
        y: initialPos.y + (ev.clientY - startY),
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleGenerate = async () => {
    if (!groqApiKey) {
      openSettings();
      return;
    }

    if (!code.trim()) {
      setErrorMsg("Please enter some code or a problem description.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await generateCanvasFromCode(code, groqApiKey);
      setCanvasState(result.nodes, result.edges);
      setCode('');
      toggleAIGen(); // Close on success
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate board.');
    } finally {
      setIsLoading(false);
    }
  };

  const panelStyle = {
    position: 'absolute',
    top: `${pos.y}px`,
    left: `${pos.x}px`,
    zIndex: 1000,
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '4px 4px 0px var(--shadow-primary)',
    borderRadius: '0', 
    width: '400px',
    maxWidth: '90vw'
  };

  const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    cursor: 'move',
    borderBottom: '2px solid var(--border-secondary)',
    paddingBottom: '8px',
    marginBottom: '4px'
  };

  const buttonStyle = {
    backgroundColor: 'var(--border-primary)',
    color: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    borderRadius: '0', 
    boxShadow: '2px 2px 0px var(--bg-tertiary)',
    opacity: isLoading ? 0.7 : 1,
    transition: 'transform 0.1s, box-shadow 0.1s',
  };

  const handleMousedown = (e) => {
    if (isLoading) return;
    e.currentTarget.style.transform = 'translate(2px, 2px)';
    e.currentTarget.style.boxShadow = '0px 0px 0px var(--bg-tertiary)';
  };
  
  const handleMouseup = (e) => {
    if (isLoading) return;
    e.currentTarget.style.transform = 'translate(0px, 0px)';
    e.currentTarget.style.boxShadow = '2px 2px 0px var(--bg-tertiary)';
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        toggleAIGen();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [toggleAIGen]);

  return (
    <div style={panelStyle}>
      <div style={headerStyle} onPointerDown={handlePointerDown}>
        <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', userSelect: 'none' }}>
          AI Generator
        </h3>
        <button 
          onClick={toggleAIGen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', padding: '0 4px', lineHeight: '1' }}
          title="Close (Esc or i)"
        >
          ×
        </button>
      </div>

      <textarea
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste a LeetCode problem or code snippet here..."
        style={{
          width: '100%',
          height: '120px',
          padding: '8px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '2px solid var(--border-primary)',
          resize: 'vertical',
          fontFamily: 'monospace',
          fontSize: '12px',
          boxSizing: 'border-box'
        }}
      />
      
      <button 
        style={buttonStyle} 
        onClick={handleGenerate}
        onMouseDown={handleMousedown}
        onMouseUp={handleMouseup}
        onMouseLeave={handleMouseup}
        disabled={isLoading}
      >
        {isLoading ? 'Generating... (may take up to a minute)' : 'Generate Board'}
      </button>
      
      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', border: '1px solid #ef4444', fontSize: '12px', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
