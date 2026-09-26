import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponAPI } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [restaurantConflictModal, setRestaurantConflictModal] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('foodie_cart_items', JSON.stringify(items));
    if (items.length === 0) {
      setRestaurant(null);
      setCoupon(null);
      localStorage.removeItem('foodie_cart_restaurant');
      localStorage.removeItem('foodie_cart_coupon');
    }
  }, [items]);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('foodie_cart_restaurant', JSON.stringify(restaurant));
    }
  }, [restaurant]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('foodie_cart_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('foodie_cart_coupon');
    }
  }, [coupon]);

  // Add Item to cart
  const addToCart = (item, currentRestaurant) => {
    // Check if adding from another restaurant
    if (restaurant && restaurant._id !== currentRestaurant._id && items.length > 0) {
      return new Promise((resolve) => {
        setRestaurantConflictModal({
          newRestaurant: currentRestaurant,
          newItem: item,
          onConfirm: () => {
            setItems([{ ...item, quantity: 1 }]);
            setRestaurant({
              _id: currentRestaurant._id,
              name: currentRestaurant.name,
              deliveryFee: currentRestaurant.deliveryFee,
              minOrder: currentRestaurant.minOrder,
              image: currentRestaurant.image
            });
            setCoupon(null);
            setRestaurantConflictModal(null);
            setIsCartOpen(true);
            resolve(true);
          },
          onCancel: () => {
            setRestaurantConflictModal(null);
            resolve(false);
          }
        });
      });
    }

    // Set restaurant if first item
    if (!restaurant || items.length === 0) {
      setRestaurant({
        _id: currentRestaurant._id,
        name: currentRestaurant.name,
        deliveryFee: currentRestaurant.deliveryFee,
        minOrder: currentRestaurant.minOrder,
        image: currentRestaurant.image
      });
    }

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });

    setIsCartOpen(true);
    return Promise.resolve(true);
  };

  // Remove single quantity or remove item
  const removeFromCart = (itemId) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === itemId);
      if (!existing) return prevItems;

      if (existing.quantity === 1) {
        return prevItems.filter((i) => i._id !== itemId);
      }

      return prevItems.map((i) =>
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  // Delete item completely
  const deleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((i) => i._id !== itemId));
  };

  // Clear all items
  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setCoupon(null);
    localStorage.removeItem('foodie_cart_items');
    localStorage.removeItem('foodie_cart_restaurant');
    localStorage.removeItem('foodie_cart_coupon');
  };

  // Apply Coupon
  const applyCoupon = async (code) => {
    try {
      const res = await couponAPI.validate({
        code,
        orderAmount: subtotal
      });
      if (res.data.success) {
        setCoupon(res.data.coupon);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      return { success: false, message: msg };
    }
  };

  // Remove Coupon
  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = restaurant ? Number(restaurant.deliveryFee || 0) : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;

  // Calculate discount if coupon active
  let discount = 0;
  if (coupon && subtotal > 0) {
    const rawDiscount = (subtotal * coupon.discountPercent) / 100;
    discount = Math.min(rawDiscount, coupon.maxDiscount || 100);
    discount = Math.round(discount * 100) / 100;
  }

  const total = Math.max(0, Math.round((subtotal + deliveryFee + tax - discount) * 100) / 100);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        itemCount,
        subtotal: Math.round(subtotal * 100) / 100,
        deliveryFee,
        tax,
        discount,
        total,
        coupon,
        isCartOpen,
        restaurantConflictModal,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        deleteItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setRestaurantConflictModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
