import React, { useState, useEffect } from 'react';
import useStore from '../store';

export default function SettingsSection({ isOpen, buttonStyle }) {
  const groqApiKey = useStore((state) => state.groqApiKey);
  const setGroqApiKey = useStore((state) => state.setGroqApiKey);
  const [localApiKey, setLocalApiKey] = useState(groqApiKey || '');

  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(groqApiKey || '');
    }
  }, [isOpen, groqApiKey]);

  return (
    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid var(--border-primary)' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
        Groq API Key
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="password"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
          placeholder="gsk_..."
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '2px solid var(--border-primary)',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <button 
          style={{ ...buttonStyle, backgroundColor: 'var(--border-primary)', color: 'var(--bg-primary)', boxShadow: '2px 2px 0px var(--bg-tertiary)' }} 
          onClick={() => setGroqApiKey(localApiKey)}
        >
          Save
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', margin: 0 }}>
        Your API key is stored locally and never sent to our servers.
      </p>
    </div>
  );
}
