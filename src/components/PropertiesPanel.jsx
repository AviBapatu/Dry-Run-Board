import React, { useState } from 'react';
import { useOnSelectionChange } from '@xyflow/react';
import useStore from '../store';

export default function PropertiesPanel() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
  });

  const nodes = useStore((state) => state.nodes);
  const updateNodeStructure = useStore((state) => state.updateNodeStructure);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

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
    gap: '12px',
    boxShadow: '4px 4px 0px #2c2c2c',
    borderRadius: '0',
    minWidth: '200px',
  };

  const inputStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #2c2c2c',
    padding: '4px 8px',
    fontSize: '14px',
    color: '#2c2c2c',
    outline: 'none',
    width: '60px',
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
      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#2c2c2c', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {title}
      </h3>
      <div style={{ height: '1px', backgroundColor: '#dcd7ca', marginBottom: '8px' }} />

      {isArrayLike && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c2c2c' }}>Length:</label>
          <input 
            type="number" 
            min="1" 
            max="20"
            style={inputStyle} 
            value={currentLength}
            onChange={(e) => {
              const newLen = parseInt(e.target.value, 10);
              if (!isNaN(newLen) && newLen > 0) {
                updateNodeStructure(selectedNode.id, { length: newLen });
              }
            }} 
          />
        </div>
      )}

      {isMatrix && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c2c2c' }}>Rows:</label>
            <input 
              type="number" 
              min="1" 
              max="10"
              style={inputStyle} 
              value={selectedNode.data.grid?.length || 0}
              onChange={(e) => {
                const newRows = parseInt(e.target.value, 10);
                if (!isNaN(newRows) && newRows > 0) {
                  const currentCols = selectedNode.data.grid?.[0]?.length || 1;
                  updateNodeStructure(selectedNode.id, { rows: newRows, cols: currentCols });
                }
              }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c2c2c' }}>Cols:</label>
            <input 
              type="number" 
              min="1" 
              max="10"
              style={inputStyle} 
              value={selectedNode.data.grid?.[0]?.length || 0}
              onChange={(e) => {
                const newCols = parseInt(e.target.value, 10);
                if (!isNaN(newCols) && newCols > 0) {
                  const currentRows = selectedNode.data.grid?.length || 1;
                  updateNodeStructure(selectedNode.id, { rows: currentRows, cols: newCols });
                }
              }} 
            />
          </div>
        </>
      )}

      {!isArrayLike && !isMatrix && (
        <div style={{ fontSize: '12px', color: '#666' }}>No structural properties to edit.</div>
      )}
    </div>
  );
}
