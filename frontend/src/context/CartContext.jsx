import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cart, setCart] = useState({
    items: [],
  });

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [] });
      return;
    }

    try {
      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data);
    } catch {
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
