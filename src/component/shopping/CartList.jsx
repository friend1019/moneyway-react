import React from "react";
import "../../css/shopping/CartList.css"; // 필요 시 CSS 분리
import CartItem from "./CartItem";

const dummyCart = [
  {
    id: 1,
    name: "제주해녀박물관",
    category: "관광명소",
    count: 1,
    image: "/images/place1.jpg",
    color: "#a259ff",
  },
  {
    id: 2,
    name: "바른삼겹",
    category: "식당",
    count: 1,
    image: "/images/place2.jpg",
    color: "#ff4d4d",
  },
  {
    id: 3,
    name: "981 파크",
    category: "액티비티",
    count: 1,
    image: "/images/place3.jpg",
    color: "#45cc54",
  },
  {
    id: 4,
    name: "해지개 카페",
    category: "카페",
    count: 2,
    image: "/images/place4.jpg",
    color: "#f9851f",
  },
  {
    id: 5,
    name: "제주 풀빌라소랑",
    category: "숙소",
    count: 3,
    image: "/images/place5.jpg",
    color: "#378cff",
  },
  {
    id: 6,
    name: "제주 중앙지하상가",
    category: "쇼핑",
    count: 1,
    image: "/images/place6.jpg",
    color: "#ff3e8d",
  },
];

const CartList = () => {
  return (
    <div className="cartlist-container">
      <div className="cartlist-header">
        <p>
          <span className="highlight">일정 카드</span>에 일정을 담고
          <br />
          시간표에 추가해보세요
        </p>
      </div>

      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {dummyCart.map((item, index) => (
          <CartItem key={item.id} item={item} isBackground={index % 2 === 0} />
        ))}
      </div>

      <div className="cartlist-empty">
        <p className="empty-message">카트에 담긴 일정이 없습니다</p>
        <button className="add-schedule-btn">일정 담기</button>
      </div>
    </div>
  );
};

export default CartList;
