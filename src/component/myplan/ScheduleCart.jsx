import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import api from "../../api/axios";
import hotelIcon from "../../images/shopping/hotel.svg";
import cafeIcon from "../../images/shopping/cafe.svg";
import activityIcon from "../../images/shopping/activity.svg";
import foodIcon from "../../images/shopping/food.svg";
import shoppingIcon from "../../images/shopping/shopping.svg";
import tourIcon from "../../images/shopping/tour.svg";
import "../../css/myplan/ScheduleCart.css";

// 카테고리별 스타일 반환
const getCartStyle = (category = "") => {
  if (category.includes("액티비티")) return { icon: activityIcon, color: "#7ddc7e", bg: "#f6fff2" };
  if (category.includes("쇼핑")) return { icon: shoppingIcon, color: "#f06595", bg: "#fff0f6" };
  if (category.includes("식당")) return { icon: foodIcon, color: "#fa5252", bg: "#fff6f3" };
  if (category.includes("카페")) return { icon: cafeIcon, color: "#fab005", bg: "#fffbe4" };
  if (category.includes("숙소")) return { icon: hotelIcon, color: "#339af0", bg: "#e8f5fa" };
  // '관광', '관광지', '관광명소' 모두 인식
  if (category.includes("관광")) return { icon: tourIcon, color: "#845ef7", bg: "#f4f2fd" };
  return { icon: activityIcon, color: "#7ddc7e", bg: "#f6fff2" };
};

function DraggableCartItem({ item, children, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.cartId || item.id,
    data: { ...item, origin: "cart" },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        cursor: "grabbing",
      }
    : undefined;

  // 우클릭시 해당 아이템 서버/로컬에서 삭제
  const handleContextMenu = async (e) => {
    e.preventDefault();
    if (!window.confirm("이 카드를 삭제할까요?")) return;
    try {
      if (item.cartId) await api.delete(`/cart/${item.cartId}`);
      if (onDelete) onDelete(item.cartId);
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
}

const ScheduleCart = ({ cartItems: initialCartItems = [], dailySchedules = {} }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  // 서버에서 카트 목록 불러오기 (스케줄에 추가된 아이템은 제외)
  const handleFetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      const newCartItems = res.data.cartItems || [];
      
      // 현재 스케줄에 있는 cartId들을 수집
      const scheduledCartIds = new Set();
      Object.values(dailySchedules || {}).forEach(dayItems => {
        (dayItems || []).forEach(item => {
          if (item.cartId) {
            scheduledCartIds.add(item.cartId);
          }
        });
      });
      
      // 스케줄에 없는 아이템들만 필터링
      const filteredItems = newCartItems.filter(item => 
        !scheduledCartIds.has(item.cartId)
      );
      
      setCartItems(filteredItems);
    } catch (error) {
      console.error('카드 불러오기 실패:', error);
      alert("카드 불러오기 실패");
    }
    setLoading(false);
  };

  // 한 아이템 삭제(로컬에서도 제거)
  const handleDelete = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // 현재 스케줄에 있는 cartId들을 수집
  const scheduledCartIds = new Set();
  Object.values(dailySchedules || {}).forEach(dayItems => {
    (dayItems || []).forEach(item => {
      if (item.cartId) {
        scheduledCartIds.add(item.cartId);
      }
    });
  });

  // 숙소가 아닌 항목만 필터링하고, 이미 스케줄에 추가된 것은 제외
  const nonLodgingItems = cartItems.filter(item => 
    !item.category?.includes("숙소") && 
    !scheduledCartIds.has(item.cartId) &&
    item.cartId // cartId가 있는 아이템만 표시
  );

  return (
    <div className="side-card-container">
      <h3>일정 카드</h3>
      <button className="card-button" onClick={handleFetchCart} disabled={loading}>
        {loading ? "불러오는 중..." : "카드 불러오기"}
      </button>
      <div className="cart-list">
        {nonLodgingItems.length === 0 && (
          <p className="empty-text">일정 카드가 없습니다</p>
        )}
        {nonLodgingItems.map((item) => {
          const { icon, color, bg } = getCartStyle(item.category || "액티비티");
          return (
            <DraggableCartItem key={item.cartId || item.id} item={item} onDelete={handleDelete}>
              <div className="schedule-cart-card" style={{ background: bg }}>
                <div className="cart-category-row">
                  {icon && <img src={icon} alt={item.category} className="cart-icon" />}
                  <span className="cart-category-text" style={{ color }}>
                    {item.category || "액티비티"}
                  </span>
                </div>
                <div className="cart-place-name">
                  {item.placeName || item.name || item.title}
                </div>
                <div className="cart-price">
                  ₩ {(item.price || item.cost || 0).toLocaleString()}
                </div>
              </div>
            </DraggableCartItem>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCart;