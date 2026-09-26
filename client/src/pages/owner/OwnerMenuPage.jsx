import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  UtensilsCrossed,
  Sparkles,
  Flame,
  Check,
  X
} from 'lucide-react';
import { OwnerNavbar } from '../../components/owner/OwnerNavbar';
import { MenuModal } from '../../components/owner/MenuModal';
import { restaurantAPI, menuAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const OwnerMenuPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenu = async () => {
    try {
      const restRes = await restaurantAPI.getMyRestaurant();
      if (restRes.data.success && restRes.data.restaurant) {
        setRestaurant(restRes.data.restaurant);
        const menuRes = await menuAPI.getByRestaurant(restRes.data.restaurant._id);
        if (menuRes.data.success) {
          setMenuItems(menuRes.data.items);
        }
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await menuAPI.toggleAvailability(itemId);
      if (res.data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === itemId ? res.data.item : i))
        );
      }
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from your menu?')) {
      return;
    }

    try {
      const res = await menuAPI.deleteItem(itemId);
      if (res.data.success) {
        setMenuItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Group by category
  const categoriesMap = {};
  menuItems.forEach((item) => {
    if (!categoriesMap[item.category]) {
      categoriesMap[item.category] = [];
    }
    categoriesMap[item.category].push(item);
  });

  return (
    <div className="space-y-8 pb-20">
      <OwnerNavbar
        restaurant={restaurant}
        onStatusToggle={(newStatus) => setRestaurant({ ...restaurant, isOpen: newStatus })}
      />

      {/* Header & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Menu Dishes ({menuItems.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add new recipes, adjust prices, and toggle in-stock availability.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Dish
        </button>
      </div>

      {/* Menu Catalog Grouped by Category */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">Your Menu is Empty</h3>
          <p className="text-xs text-gray-500">
            Start adding your delicious dishes and pizzas to attract hungry customers!
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl"
          >
            Add First Dish
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(categoriesMap).map((catName) => (
            <section key={catName} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <h3 className="font-extrabold text-gray-900 text-lg">{catName}</h3>
                <span className="text-xs font-bold text-gray-400">
                  ({categoriesMap[catName].length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoriesMap[catName].map((dish) => (
                  <div
                    key={dish._id}
                    className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 transition-all ${
                      !dish.isAvailable ? 'opacity-60 bg-gray-50/70' : ''
                    }`}
                  >
                    <img
                      src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                      alt={dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Veg/Nonveg indicator */}
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center p-0.5 ${
                            dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </div>
                        <h4 className="font-bold text-xs text-gray-900 truncate">
                          {dish.name}
                        </h4>
                        {dish.popular && (
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {dish.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-extrabold text-xs text-gray-900">
                          {formatCurrency(dish.price)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            dish.isAvailable
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* In Stock toggle */}
                      <button
                        onClick={() => handleToggleAvailability(dish._id)}
                        title={dish.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                        className={`p-2 rounded-xl border transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingItem(dish);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(dish._id)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Add / Edit Menu Modal */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        onItemSaved={() => fetchMenu()}
      />
    </div>
  );
};
