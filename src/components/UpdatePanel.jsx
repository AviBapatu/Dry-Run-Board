import React, { useState, useEffect } from 'react';
import UpdateSection from './UpdateSection';
import SettingsSection from './SettingsSection';
import AboutSection from './AboutSection';
import ThemeToggle from './ThemeToggle';

export default function UpdatePanel({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const isWeb = !window.__TAURI_INTERNALS__;

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: isClosing ? 0 : 1,
    transition: 'opacity 0.2s ease-out',
  };

  const panelStyle = {
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    boxShadow: '4px 4px 0px var(--shadow-primary)',
    borderRadius: '4px',
    padding: '24px',
    width: '400px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: 'var(--text-primary)',
    transform: isClosing ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
    opacity: isClosing ? 0 : 1,
    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out',
  };

  const buttonStyle = {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--text-primary)',
    border: '2px solid var(--border-primary)',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '2px 2px 0px var(--shadow-primary)',
    transition: 'all 0.1s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: isWeb ? 'var(--button-disabled-bg)' : 'var(--border-primary)',
    color: 'var(--bg-primary)',
    boxShadow: isWeb ? '2px 2px 0px var(--border-secondary)' : '2px 2px 0px var(--bg-tertiary)',
    cursor: isWeb ? 'not-allowed' : 'pointer',
    opacity: isWeb ? 0.7 : 1,
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-primary)', paddingBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            Settings & Updates
          </h2>
          <ThemeToggle />
        </div>
        
        <UpdateSection 
          isOpen={isOpen} 
          onClose={handleClose} 
          buttonStyle={buttonStyle} 
          primaryButtonStyle={primaryButtonStyle} 
        />
        
        <SettingsSection 
          isOpen={isOpen} 
          buttonStyle={buttonStyle} 
        />

        <AboutSection />
      </div>
    </div>
  );
}
