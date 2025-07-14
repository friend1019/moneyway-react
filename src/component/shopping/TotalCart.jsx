import React from "react";
import hotelIcon from "../../images/shopping/hotel.svg";
import cafeIcon from "../../images/shopping/cafe.svg";
import activityIcon from "../../images/shopping/activity.svg";
import foodIcon from "../../images/shopping/food.svg";
import shoppingIcon from "../../images/shopping/shopping.svg";
import tourIcon from "../../images/shopping/tour.svg";
import "../../css/shopping/TotalCart.css";

const TotalCart = () => {
  const categories = [
    { name: "숙소", icon: hotelIcon },
    { name: "식당", icon: foodIcon },
    { name: "관광명소", icon: tourIcon },
    { name: "액티비티", icon: activityIcon },
    { name: "카페", icon: cafeIcon },
    { name: "쇼핑", icon: shoppingIcon },
  ];

  return (
    <div className="totalcart-container">
      <h3 className="totalcart-title">합계</h3>

      <ul className="totalcart-list">
        {categories.map((cat, idx) => (
          <li className="totalcart-item" key={idx}>
            {cat.icon ? (
              <img src={cat.icon} alt={cat.name} className="totalcart-icon" />
            ) : (
              <div className="totalcart-icon-placeholder">
                {cat.name.slice(0, 1)}
              </div>
            )}
            <span className="label">{cat.name}</span>
            <span className="count">0</span>
          </li>
        ))}
      </ul>

      <div className="totalcart-total">
        <span>총</span>
        <span>0</span>
      </div>

      <button className="totalcart-button" disabled>
        플랜에 추가하기
      </button>
    </div>
  );
};

export default TotalCart;
