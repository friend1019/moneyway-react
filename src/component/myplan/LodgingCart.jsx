import React from 'react';
import hotelIcon from "../../images/shopping/hotel.svg";
import '../../css/myplan/ScheduleCart.css';

const LodgingCart = ({ cartItems = [] }) => {
  const lodgingItems = cartItems.filter(item => 
    item.category === '숙소' || item.category?.includes('숙소')
  );

  return (
    <div className='side-card-container'>
      <h3>숙소 카드</h3>
      <div className="cart-list">
        {lodgingItems.length === 0 && (
          <p className='empty-text'>숙소 정보가 없습니다</p>
        )}
        {lodgingItems.map(item => (
          <div
           key={item.cartId || item.id} item={item}>
            <div className="schedule-cart-card" style={{ background: "#e8f5fa" }}>
              <div className="cart-category-row">
                <img src={hotelIcon} alt="숙소" className="cart-icon" />
                <span className="cart-category-text" style={{ color: "#339af0" }}>
                  숙소
                </span>
              </div>
              <div className="cart-place-name">
                {item.placeName || item.name || item.title}
              </div>
              <div className="cart-price">₩ {(item.price || 0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LodgingCart;