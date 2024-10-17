// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  // Function to handle the start of dragging
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }; // Data to be transferred during the drag
    event.target.style.cursor = 'grabbing'; // Change cursor style
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData)); // Set the data for the drag event
    event.dataTransfer.effectAllowed = 'move'; // Allow move operation
  };

  return (
    <div
      className={type} // Class name based on node type
      onDragStart={(event) => onDragStart(event, type)} // Start drag event
      onDragEnd={(event) => (event.target.style.cursor = 'grab')} // Reset cursor style on drag end
      style={{ 
        cursor: 'grab', // Initial cursor style
        minWidth: '80px', 
        height: '30px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        borderRadius: '8px',
        backgroundColor: '#4CAF50',  
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
        transition: 'transform 0.2s, box-shadow 0.2s', 
      }} 
      draggable // Enable dragging
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)')} // Increase shadow on hover
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)')} // Reset shadow on mouse out
    >
      <span style={{ color: '#fff', fontWeight: 'bold' }}>{label}</span> {/* Display label */}
    </div>
  );
};
