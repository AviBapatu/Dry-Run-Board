import React from 'react';
import useStore from '../store';

export default function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  const handleToggleTheme = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDark = theme === 'light';
    const targetBg = isDark ? '#242424' : '#f4f1ea';

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '99999',
      pointerEvents: 'none',
      backgroundColor: targetBg,
      clipPath: `circle(0px at ${x}px ${y}px)`,
    });
    document.body.appendChild(overlay);

    const expandAnim = overlay.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      { duration: 450, easing: 'ease-in-out', fill: 'forwards' }
    );

    setTimeout(() => {
      toggleTheme();
    }, 300);

    expandAnim.onfinish = () => {
      const fadeAnim = overlay.animate(
        { opacity: [1, 0] },
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      );
      fadeAnim.onfinish = () => overlay.remove();
    };
  };

  return (
    <button 
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        border: '2px solid var(--border-primary)',
        padding: '4px 10px', 
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '2px 2px 0px var(--shadow-primary)',
        borderRadius: '0'
      }} 
      onClick={handleToggleTheme}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translate(2px, 2px)';
        e.currentTarget.style.boxShadow = '0px 0px 0px var(--border-primary)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
        e.currentTarget.style.boxShadow = '2px 2px 0px var(--shadow-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
        e.currentTarget.style.boxShadow = '2px 2px 0px var(--shadow-primary)';
      }}
    >
      {theme === 'light' ? 'THEME: DARK' : 'THEME: LIGHT'}
    </button>
  );
}
