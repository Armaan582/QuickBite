import React, { useEffect, useState } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import { RestaurantCard } from '../../components/customer/RestaurantCard';

const cuisineIcons = { all: '✦', indian: '🍛', 'north indian': '🥘', 'south indian': '🥥', punjabi: '🫓', biryani: '🍚', chinese: '🥡', pizza: '🍕', burgers: '🍔', burger: '🍔', desserts: '🍰', beverages: '🥤', italian: '🍝', pasta: '🍝', japanese: '🍣', sushi: '🍣', ramen: '🍜', asian: '🥢', vegetarian: '🥗', curry: '🍛', 'fast food': '🍔', mediterranean: '🫒', american: '🍔', wings: '🍗' };

export const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState(['All']);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    restaurantAPI.getCuisines().then((res) => res.data.success && setCuisines(res.data.cuisines)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const params = { sort: 'featured' };
        if (searchQuery) params.search = searchQuery;
        if (selectedCuisine !== 'All') params.cuisine = selectedCuisine;
        const res = await restaurantAPI.getAll(params);
        if (res.data.success) setRestaurants(res.data.restaurants);
      } catch { setError('We could not load restaurants right now. Please try again.'); }
      finally { setLoading(false); }
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCuisine]);

  return <div className="pb-14 pt-3">
    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-[#fff9ed] to-white px-6 py-10 sm:px-10">
      <p className="section-kicker">Chandigarh, Punjab</p>
      <div className="mt-2 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">All restaurants</h1><p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Explore verified local kitchens and find exactly what you are craving.</p></div><div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm"><Search className="ml-2 h-5 w-5 shrink-0 text-orange-600" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search restaurants" placeholder="Search restaurants, cuisines or dishes" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-stone-400" /></div></div>
    </section>
    <section className="mt-9"><div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">{cuisines.map((cuisine) => <button key={cuisine} onClick={() => setSelectedCuisine(cuisine)} className={`flex min-w-[112px] flex-col items-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-bold transition ${selectedCuisine === cuisine ? 'border-orange-500 bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'border-stone-200 bg-white text-stone-700 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50'}`}><span className="text-2xl">{cuisineIcons[cuisine.toLowerCase()] || '🍽️'}</span><span className="whitespace-nowrap">{cuisine}</span></button>)}</div></section>
    <section className="mt-10"><div className="mb-6 flex items-end justify-between"><div><p className="section-kicker">Delivered to your door</p><h2 className="section-title">{selectedCuisine === 'All' ? 'Every restaurant' : `${selectedCuisine} restaurants`}</h2></div><span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">{restaurants.length} places</span></div>{loading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4,5,6,7,8].map((item) => <div key={item} className="h-[340px] animate-pulse rounded-3xl bg-stone-200" />)}</div> : error ? <div className="rounded-3xl border border-orange-100 bg-orange-50 p-12 text-center"><p className="font-bold text-stone-800">{error}</p><button onClick={() => setSearchQuery('')} className="mt-3 text-sm font-bold text-orange-600">Try again</button></div> : restaurants.length === 0 ? <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center"><UtensilsCrossed className="mx-auto h-9 w-9 text-orange-500" /><h3 className="mt-3 text-lg font-bold text-stone-900">No restaurants found</h3><p className="mt-1 text-sm text-stone-500">Try another cuisine or search term.</p><button onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }} className="mt-4 text-sm font-bold text-orange-600">Clear filters</button></div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}</div>}</section>
  </div>;
};
