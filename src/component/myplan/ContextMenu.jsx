import React from 'react';
import '../../css/myplan/ContextMenu.css';

const ContextMenu = ({ position, items, onClose }) => {
  const menuStyle = {
    position: 'absolute',  // 반드시 절대위치
    top: `${position.y}px`,
    left: `${position.x}px`,
    zIndex: 999,
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.13)',
    border: '1px solid #ececec',
    minWidth: '110px',
    padding: '6px 0'
  };

  const handleItemClick = (action) => {
    action();
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={menuStyle}
      tabIndex={-1}
      onContextMenu={e => e.preventDefault()} // 메뉴 위에서 또 우클릭 방지
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item.action)}
            className={item.label === '삭제하기' ? 'danger' : ''}
            style={{
              padding: '10px 20px',
              fontSize: '15px',
              color: item.label === '삭제하기' ? '#FF3B30' : '#222',
              fontWeight: item.label === '삭제하기' ? 600 : 400,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background 0.15s',
            }}
            onMouseDown={e => e.preventDefault()} // 포커스 방지(모바일에서)
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
