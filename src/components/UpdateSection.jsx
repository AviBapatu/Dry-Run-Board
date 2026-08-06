import React, { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export default function UpdateSection({ isOpen, onClose, buttonStyle, primaryButtonStyle }) {
  const isWeb = !window.__TAURI_INTERNALS__;
  const [status, setStatus] = useState('idle'); // idle | checking | available | none | downloading | error
  const [updateInfo, setUpdateInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setUpdateInfo(null);
      setErrorMsg('');
    }
  }, [isOpen]);

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

  return (
    <>
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
        <button style={buttonStyle} onClick={onClose}>
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
    </>
  );
}
