import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";

function useCart() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  function addToCart(item) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= 5) return;

      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id) {
    const updatedCard = cart.map((item) => {
      if (item.id === id && item.quantity < 5)
        return { ...item, quantity: item.quantity + 1 };

      return item;
    });

    setCart(updatedCard);
  }

  function decrementQuantity(id) {
    const updatedCard = cart.map((item) => {
      if (item.id === id && item.quantity > 1)
        return { ...item, quantity: item.quantity - 1 };

      return item;
    });
    setCart(updatedCard);
  }

  function clearCart() {
    setCart([]);
  }

  // state derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decrementQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
}

export default useCart;
