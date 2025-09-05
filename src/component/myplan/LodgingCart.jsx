import React from 'react';
import hotelIcon from "../../images/shopping/hotel.svg";
import '../../css/myplan/ScheduleCart.css';

const LodgingCart = ({ cartItems = [], isEditMode, dailySchedules = {} }) => {
  // 디버깅용 로그
  console.log('LodgingCart - cartItems:', cartItems);
  console.log('LodgingCart - dailySchedules:', dailySchedules);

  // 숙소 카드들만 필터링 (스케줄 상태와 관계없이 일단 모든 숙소 표시)
  const lodgingItems = cartItems.filter(item => 
    item.category === '숙소' || item.category?.includes('숙소')
  );

  console.log('LodgingCart - lodgingItems:', lodgingItems);

  return (
    <div className='side-card-container'>
      <h3>숙소 카드</h3>
      <div className="cart-list">
        {lodgingItems.length === 0 && (
          <p className='empty-text'>숙소 정보가 없습니다</p>
        )}
        {lodgingItems.map(item => (
          <div key={item.cartId || item.id}>
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