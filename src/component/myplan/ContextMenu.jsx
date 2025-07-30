import React from 'react';
import '../../css/myplan/ContextMenu.css';

const ContextMenu = ({ position, items, onClose }) => {
  const menuStyle = {
    top: `${position.y}px`,
    left: `${position.x}px`,
  };

  const handleItemClick = (action) => {
    action();
    onClose();
  };

  return (
    <div className="context-menu" style={menuStyle}>
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item.action)}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;