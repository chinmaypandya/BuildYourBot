import React from 'react';
import './Draggable_styles.css'; 

export const DraggableNode = ({ type, label }) => {
  // Handle the start of dragging
  const handleDragStart = (event) => {
    const appData = { nodeType: type };
    
    // Add grabbing style and set drag data
    event.target.classList.add('is-grabbing');
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle the end of dragging
  const handleDragEnd = (event) => {
    event.target.classList.remove('is-grabbing');
  };

  return (
    <div
      className={`draggable-node draggable-node--${type}`} // Use BEM convention for CSS class names
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable // Make the node draggable
    >
      <span className='draggable-node__label'>{label}</span> {/* Node label */}
    </div>
  );
};
