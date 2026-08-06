import React, { useState } from 'react';
import { useOnSelectionChange } from '@xyflow/react';
import useStore from '../store';

const NumberInput = ({ label, value, onChange, min, max }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{label}:</label>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '2px 2px 0px var(--shadow-primary)' }}>
        <button 
          style={{ width: '24px', height: '24px', backgroundColor: 'var(--bg-secondary)', border: 'none', borderRight: '1px solid var(--border-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-primary)', padding: 0 }}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </button>
        <div style={{ width: '32px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
          {value}
        </div>
        <button 
          style={{ width: '24px', height: '24px', backgroundColor: 'var(--bg-secondary)', border: 'none', borderLeft: '1px solid var(--border-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-primary)', padding: 0 }}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default function PropertiesPanel() {
  const nodes = useStore((state) => state.nodes);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedNode = nodes.find(n => n.selected);

  if (!selectedNode) return null;

  const panelStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 10,
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-primary)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: isCollapsed ? '0px' : '12px',
    boxShadow: '4px 4px 0px var(--shadow-primary)',
    borderRadius: '0',
    minWidth: '200px',
  };

  const isArrayLike = ['arrayNode', 'stackNode', 'queueNode', 'mapNode'].includes(selectedNode.type);
  const isMatrix = selectedNode.type === 'matrixNode';

  const typeName = selectedNode.type.replace('Node', '');
  const title = `Editing ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`;

  const currentLength = selectedNode.type === 'mapNode' 
    ? (selectedNode.data.entries?.length || 0) 
    : (selectedNode.data.values?.length || 0);

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', paddingRight: '16px' }}>
          {title}
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

          {isArrayLike && (
            <NumberInput 
              label="Length" 
              value={currentLength} 
              min={1} 
              max={20} 
              onChange={(newLen) => updateNodeStructure(selectedNode.id, { length: newLen })} 
            />
          )}

          {isMatrix && (
            <>
              <NumberInput 
                label="Rows" 
                value={selectedNode.data.grid?.length || 0} 
                min={1} 
                max={10} 
                onChange={(newRows) => {
                  const currentCols = selectedNode.data.grid?.[0]?.length || 1;
                  updateNodeStructure(selectedNode.id, { rows: newRows, cols: currentCols });
                }} 
              />
              <NumberInput 
                label="Cols" 
                value={selectedNode.data.grid?.[0]?.length || 0} 
                min={1} 
                max={10} 
                onChange={(newCols) => {
                  const currentRows = selectedNode.data.grid?.length || 1;
                  updateNodeStructure(selectedNode.id, { rows: currentRows, cols: newCols });
                }} 
              />
            </>
          )}

          {!isArrayLike && !isMatrix && (
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', opacity: 0.7 }}>No structural properties to edit.</div>
          )}
        </>
      )}
    </div>
  );
}
