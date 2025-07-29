import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import hotelIcon from "../../images/shopping/hotel.svg";
import '../../css/myplan/ScheduleCart.css';

function DraggableLodgingItem({ item, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.cartId || item.id,
    data: { ...item, origin: 'lodging' },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        cursor: 'grabbing',
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

const LodgingCart = ({ cartItems = [] }) => {
  // 여기서 '숙소'만 필터!
  const lodgingItems = cartItems.filter(item => item.category === '숙소');

  return (
    <div className='side-card-container'>
      <h3>숙소 카드</h3>
      <div className="cart-list">
        {lodgingItems.length === 0 && (
          <p className='empty-text'>숙소 정보가 없습니다</p>
        )}
        {lodgingItems.map(item => (
          <DraggableLodgingItem key={item.cartId || item.id} item={item}>
            <div className="schedule-cart-card" style={{ background: "#e8f5fa" }}>
              <div className="cart-category-row">
                <img src={hotelIcon} alt="숙소" className="cart-icon" />
                <span className="cart-category-text" style={{ color: "#339af0" }}>
                  숙소
                </span>
              </div>
              <div className="cart-place-name">{item.placeName || item.name}</div>
              <div className="cart-price">₩ {item.price?.toLocaleString()}</div>
            </div>
          </DraggableLodgingItem>
        ))}
      </div>
    </div>
  );
};

export default LodgingCart;
