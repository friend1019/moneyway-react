import React from "react";
import Header from "../common/Header";
import CartList from "./CartList";
import TotalCart from "./TotalCart";

const CartMain = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "2rem",
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <CartList />
        <TotalCart />
      </div>
    </>
  );
};

export default CartMain;
