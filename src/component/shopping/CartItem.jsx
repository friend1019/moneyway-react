import React from "react";

const CartItem = ({ item, isBackground }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "70rem",
        height: "8rem",
        alignItems: "center",
        backgroundColor: isBackground ? "#F8F9FB" : "transparent",
        padding: "1.2rem",
        borderRadius: "1.2rem",
        marginLeft: "40rem",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: "5rem",
          height: "5rem",
          borderRadius: "0.8rem",
          objectFit: "cover",
          marginRight: "1rem",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{ fontSize: "1.8rem", fontWeight: "bold", color: item.color }}
        >
          {item.name}
        </div>
        <div style={{ color: item.color, fontSize: "1.6rem", fontWeight:"lighter", marginTop: "0.2rem" }}>
          {item.category}
        </div>
      </div>

      <button
        style={{
          marginLeft: "1rem",
          backgroundColor: "#E9EDF4",
          border: "none",
          borderRadius: "999px",
          width: "3.2rem",
          height: "3.2rem",
          fontSize: "1.9rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => console.log(`${item.name} 삭제`)}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
