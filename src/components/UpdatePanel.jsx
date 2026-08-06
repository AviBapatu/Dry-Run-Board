import React, { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { version } from '../../package.json';

export default function UpdatePanel({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle | checking | available | none | downloading | error
  const [updateInfo, setUpdateInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const isWeb = !window.__TAURI_INTERNALS__;

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setUpdateInfo(null);
      setErrorMsg('');
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

  const handleCheck = async () => {
    if (isWeb) return;

    try {
      setStatus('checking');
      const update = await check();
      if (update) {
        setUpdateInfo(update);
        setStatus('available');
      } else {
        setStatus('none');
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.toString());
    }
  };

  const handleInstall = async () => {
    if (!updateInfo || isWeb) return;
    try {
      setStatus('downloading');
      await updateInfo.downloadAndInstall((event) => {
        // You could track progress here if needed
      });
      await relaunch();
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.toString());
    }
  };

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
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    boxShadow: '4px 4px 0px #2c2c2c',
    borderRadius: '4px',
    padding: '24px',
    width: '400px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: '#2c2c2c',
    transform: isClosing ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
    opacity: isClosing ? 0 : 1,
    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out',
  };

  const buttonStyle = {
    backgroundColor: '#fff',
    border: '2px solid #2c2c2c',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '2px 2px 0px #2c2c2c',
    transition: 'all 0.1s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: isWeb ? '#999' : '#2c2c2c',
    color: '#f4f1ea',
    boxShadow: isWeb ? '2px 2px 0px #ccc' : '2px 2px 0px #dcd7ca',
    cursor: isWeb ? 'not-allowed' : 'pointer',
    opacity: isWeb ? 0.7 : 1,
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: 0, fontSize: '20px', borderBottom: '2px solid #2c2c2c', paddingBottom: '8px' }}>
          Settings & Updates
        </h2>
        
        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          {isWeb && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', border: '1px solid #ef4444', marginBottom: '16px', fontWeight: 'bold' }}>
              Updates are only available in the installed desktop app. You are currently using the web version.
            </div>
          )}
          
          {status === 'idle' && <p>Click below to check for the latest version of Dry Run Board.</p>}
          {status === 'checking' && <p>Checking for updates...</p>}
          {status === 'none' && <p>You are on the latest version! No updates available.</p>}
          {status === 'available' && updateInfo && (
            <div>
              <p style={{ fontWeight: 'bold', color: '#27ae60' }}>Update version {updateInfo.version} is available!</p>
              {updateInfo.body && (
                <div style={{ backgroundColor: '#fff', padding: '8px', border: '1px solid #2c2c2c', marginTop: '8px', maxHeight: '100px', overflow: 'auto', fontSize: '12px' }}>
                  {updateInfo.body}
                </div>
              )}
            </div>
          )}
          {status === 'downloading' && <p>Downloading and installing update... Please wait.</p>}
          {status === 'error' && (
            <div>
              <p style={{ color: '#c0392b', fontWeight: 'bold' }}>Error checking for updates:</p>
              <p style={{ fontSize: '12px' }}>{errorMsg}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button style={buttonStyle} onClick={handleClose}>
            Close
          </button>
          
          {status !== 'available' && status !== 'downloading' && (
            <button 
              style={primaryButtonStyle} 
              onClick={handleCheck} 
              disabled={isWeb || status === 'checking'}
            >
              {status === 'checking' ? 'Checking...' : 'Check for Updates'}
            </button>
          )}

          {status === 'available' && (
            <button 
              style={primaryButtonStyle} 
              onClick={handleInstall}
              disabled={isWeb}
            >
              Download & Install
            </button>
          )}
        </div>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px dashed #2c2c2c', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#666' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Version {version}</span>
            <span>Created by <strong>Avi</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <a 
              href="https://github.com/AviBapatu" 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: '#2c2c2c', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              AviBapatu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
