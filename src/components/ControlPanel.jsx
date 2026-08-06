import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import useStore from '../store';

export default function ControlPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const spawnArray = useStore((state) => state.spawnArray);
  const spawnMatrix = useStore((state) => state.spawnMatrix);
  const spawnNode = useStore((state) => state.spawnNode);
  const spawnStack = useStore((state) => state.spawnStack);
  const spawnQueue = useStore((state) => state.spawnQueue);
  const spawnMap = useStore((state) => state.spawnMap);
  const spawnText = useStore((state) => state.spawnText);
  const clearCanvas = useStore((state) => state.clearCanvas);

  const getPos = () => window.lastMousePos ? screenToFlowPosition(window.lastMousePos) : undefined;

  const panelStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: isCollapsed ? '0px' : '12px',
    boxShadow: '4px 4px 0px var(--shadow-primary)',
    borderRadius: '0', 
  };

  const buttonStyle = {
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '0', 
    boxShadow: '2px 2px 0px var(--shadow-primary)',
    transition: 'transform 0.1s, box-shadow 0.1s',
  };

  const clearStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error-text)',
    borderColor: 'var(--error-border)',
    boxShadow: '2px 2px 0px var(--error-border)',
  };

  const handleMousedown = (e) => {
    e.currentTarget.style.transform = 'translate(2px, 2px)';
    e.currentTarget.style.boxShadow = '0px 0px 0px ' + (e.currentTarget.style.borderColor || 'var(--border-primary)');
  };
  
  const handleMouseup = (e, color = 'var(--shadow-primary)') => {
    e.currentTarget.style.transform = 'translate(0px, 0px)';
    e.currentTarget.style.boxShadow = '2px 2px 0px ' + color;
  };

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', paddingRight: '16px' }}>
          Dry Run Tools
        </h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', padding: '0 4px' }}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>
      
      {!isCollapsed && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--border-secondary)', marginTop: '4px', marginBottom: '8px' }} />
          
          <button style={buttonStyle} onClick={() => spawnArray(['0','0','0','0'], getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Array [A]</button>
          <button style={buttonStyle} onClick={() => spawnStack(['0','0','0','0'], getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Stack [S]</button>
          <button style={buttonStyle} onClick={() => spawnQueue(['0','0','0','0'], getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Queue [Q]</button>
          <button style={buttonStyle} onClick={() => spawnMap([{key:'k',value:'v'}], getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Map [M]</button>
          <button style={buttonStyle} onClick={() => spawnMatrix([['0','0','0'],['0','0','0'],['0','0','0']], getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Matrix [X]</button>
          <button style={buttonStyle} onClick={() => spawnNode('0', getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Graph Node [G]</button>
          <button style={buttonStyle} onClick={() => spawnText('', getPos())} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e)} onMouseLeave={e => handleMouseup(e)}>Text Note [T]</button>
          
          <div style={{ height: '1px', backgroundColor: 'var(--border-secondary)', margin: '4px 0' }} />
          <button style={clearStyle} onClick={() => clearCanvas()} onMouseDown={handleMousedown} onMouseUp={e => handleMouseup(e, 'var(--error-border)')} onMouseLeave={e => handleMouseup(e, 'var(--error-border)')}>Clear Canvas [⇧+ C]</button>
        </>
      )}
    </div>
  );
}
