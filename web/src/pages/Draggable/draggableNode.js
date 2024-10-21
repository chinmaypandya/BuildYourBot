import React from 'react';
import './Drag_styles.css'; 
export const DraggableNode = ({ type, label }) => {
  // Function to handle the start of dragging
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }; // Data to be transferred during the drag
    event.target.classList.add('grabbing'); // Add grabbing class
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData)); // Set the data for the drag event
    event.dataTransfer.effectAllowed = 'move'; // Allow move operation
  };

  const onDragEnd = (event) => {
    event.target.classList.remove('grabbing'); // Remove grabbing class on drag end
  };

  return (
    <div
      className={`draggable-node ${type}`} 
      onDragStart={(event) => onDragStart(event, type)} // Start drag event
      onDragEnd={onDragEnd} // Reset cursor style on drag end
      draggable // Enable dragging
    >
      <span className='node-titles'>{label}</span> {/* Display label */}
    </div>
  );
};
