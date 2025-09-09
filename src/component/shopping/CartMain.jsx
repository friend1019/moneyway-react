import React, { useEffect, useState } from "react";
import CartList from "./CartList";
import TotalCart from "./TotalCart";
import api from "../../api/axios";
import noImage from "../../images/planning/noImage.svg";

const CartMain = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      const { cartItems } = response.data;

      const mappedItems = cartItems.map((item) => ({
        id: item.cartId,
        placeId: item.placeId,
        name: item.placeName,
        category: item.category,
        image: item.imageUrl || noImage,
        price: item.price,
        address: item.address,
      }));

      setCartItems(mappedItems);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    margin: "0 auto",
  };
  const cartLeft = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    marginLeft: "2rem",
  };
  const cartRight = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={cartLeft}>
          <CartList cartItems={cartItems} setCartItems={setCartItems} />
        </div>
        <div style={cartRight}>
          <TotalCart cartItems={cartItems} />
        </div>
      </div>
    </>
  );
};

export default CartMain;
