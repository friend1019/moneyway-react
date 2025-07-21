import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import "../../css/shopping/CartItem.css";

const CartItem = ({ item, isBackground, onDelete, onPriceSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(item.price);

  const handleSave = () => {
    if (price >= 0) {
      onPriceSave(item.id, price);
      setIsEditing(false); // 저장 후 edit모드 종료
    }
  };

  return (
    <div
      className="cart-item-container"
      style={{ backgroundColor: isBackground ? "white" : "transparent" }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-image"
      />
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-category">{item.category}</div>
      </div>

      <div className="cart-item-price">
        {isEditing ? (
          <>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="cart-item-price-input"
            />
            <button className="cart-item-save" onClick={handleSave}>
              저장
            </button>
          </>
        ) : (
          <div
            className="cart-item-price-view"
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <FiEdit />
            <span>{price.toLocaleString()} ￦</span>
          </div>
        )}
      </div>

      <button
        className="cart-item-delete"
        onClick={() => onDelete(item.id)}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
