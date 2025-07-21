import React, { useState } from "react";
import MyPlan from "../mypage/Myplan";
import hotelIcon from "../../images/shopping/hotel.svg";
import cafeIcon from "../../images/shopping/cafe.svg";
import activityIcon from "../../images/shopping/activity.svg";
import foodIcon from "../../images/shopping/food.svg";
import shoppingIcon from "../../images/shopping/shopping.svg";
import tourIcon from "../../images/shopping/tour.svg";
import "../../css/shopping/TotalCart.css";

const CATEGORY_ORDER = [
  { name: "숙소", icon: hotelIcon },
  { name: "식당", icon: foodIcon },
  { name: "관광지", icon: tourIcon },
  { name: "액티비티/체험", icon: activityIcon },
  { name: "카페", icon: cafeIcon },
  { name: "쇼핑", icon: shoppingIcon },
];

const TotalCart = ({ cartItems }) => {
  const [showPlanModal, setShowPlanModal] = useState(false);

  const getCategoryTotal = (categoryName) => {
    return cartItems
      .filter((item) => item.category === categoryName)
      .reduce((sum, item) => sum + item.price, 0);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="totalcart-container">
      <h3 className="totalcart-title">합계</h3>

      <ul className="totalcart-list">
        {CATEGORY_ORDER.map((cat, idx) => (
          <li className="totalcart-item" key={idx}>
            {cat.icon ? (
              <img src={cat.icon} alt={cat.name} className="totalcart-icon" />
            ) : (
              <div className="totalcart-icon-placeholder">
                {cat.name.slice(0, 1)}
              </div>
            )}
            <span className="label">{cat.name}</span>
            <span className="count">
              {getCategoryTotal(cat.name).toLocaleString()} ￦
            </span>
          </li>
        ))}
      </ul>

      <div className="totalcart-total">
        <span>합계</span>
        <span>{totalPrice.toLocaleString()} ￦</span>
      </div>

      <button
        className="totalcart-button"
        disabled={totalPrice === 0}
        onClick={() => setShowPlanModal(true)}
      >
        내 플랜 이동하기
      </button>
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-button"
              onClick={() => setShowPlanModal(false)}
            >
              &times;
            </button>
            <h3>플랜 선택</h3>
            <MyPlan onClose={() => setShowPlanModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalCart;
