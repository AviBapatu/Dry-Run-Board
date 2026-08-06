import React, { useState } from 'react';
import { useOnSelectionChange } from '@xyflow/react';
import useStore from '../store';

const NumberInput = ({ label, value, onChange, min, max }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c2c2c' }}>{label}:</label>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #2c2c2c', backgroundColor: '#f4f1ea', boxShadow: '2px 2px 0px #2c2c2c' }}>
        <button 
          style={{ width: '24px', height: '24px', backgroundColor: '#eaddc8', border: 'none', borderRight: '1px solid #2c2c2c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2c2c2c', padding: 0 }}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </button>
        <div style={{ width: '32px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#2c2c2c', fontWeight: 'bold' }}>
          {value}
        </div>
        <button 
          style={{ width: '24px', height: '24px', backgroundColor: '#eaddc8', border: 'none', borderLeft: '1px solid #2c2c2c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2c2c2c', padding: 0 }}
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
    backgroundColor: '#f4f1ea',
    border: '2px solid #2c2c2c',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: isCollapsed ? '0px' : '12px',
    boxShadow: '4px 4px 0px #2c2c2c',
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
        <h3 style={{ margin: 0, fontSize: '16px', color: '#2c2c2c', textTransform: 'uppercase', letterSpacing: '1px', paddingRight: '16px' }}>
          {title}
        </h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#2c2c2c', padding: '0 4px' }}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div style={{ height: '1px', backgroundColor: '#dcd7ca', marginTop: '4px', marginBottom: '8px' }} />

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
            <div style={{ fontSize: '12px', color: '#666' }}>No structural properties to edit.</div>
          )}
        </>
      )}
    </div>
  );
}
