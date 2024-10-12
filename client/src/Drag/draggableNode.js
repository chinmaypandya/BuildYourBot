// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
  };

  return (
      <div
          className={type}
          onDragStart={(event) => onDragStart(event, type)}
          onDragEnd={(event) => (event.target.style.cursor = 'grab')}
          style={{ 
              cursor: 'grab', 
              minWidth: '80px', 
              height: '60px',
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: '8px',
              backgroundColor: '#1a1a1a', 
              justifyContent: 'center', 
              flexDirection: 'column',
              border: '2px solid #3ecf8e', 
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
          }} 
          draggable
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)')}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)')}
      >
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{label}</span>
      </div>
  );
};
