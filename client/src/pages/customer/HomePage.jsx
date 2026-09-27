import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bike, ChevronLeft, ChevronRight, Headphones, Search, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import heroImage from '../../assets/quickbite/quickbite-hero.png';

const cuisineIcons = { all: '🍽️', indian: '🍛', 'north indian': '🥘', 'south indian': '🥥', punjabi: '🫓', biryani: '🍚', chinese: '🥡', 'street food': '🥙', thali: '🍱', pizza: '🍕', burgers: '🍔', burger: '🍔', desserts: '🍰', beverages: '🥤', italian: '🍝', pasta: '🍝', japanese: '🍣', sushi: '🍣', ramen: '🍜', asian: '🥢', vegetarian: '🥗', curry: '🍛', 'fast food': '🍔', mediterranean: '🫒', american: '🍔', wings: '🍗' };

export const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState(['All']);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { restaurantAPI.getCuisines().then((res) => res.data.success && setCuisines(res.data.cuisines)).catch(() => {}); }, []);
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try { const params = { sort: 'featured' }; if (searchQuery) params.search = searchQuery; if (selectedCuisine !== 'All') params.cuisine = selectedCuisine; const res = await restaurantAPI.getAll(params); if (res.data.success) setRestaurants(res.data.restaurants); }
      catch { setError('We could not load restaurants right now. Please try again.'); }
      finally { setLoading(false); }
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCuisine]);

  return <div className="quickbite-home -mt-6 pb-12">
    <section className="home-hero relative min-h-[450px] overflow-hidden rounded-b-[1.5rem] md:min-h-[480px] md:rounded-[1.8rem] lg:min-h-[clamp(560px,46vw,680px)]" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/46 to-black/5" />
      <div className="relative z-10 flex min-h-[450px] max-w-[760px] flex-col justify-center px-6 py-7 md:min-h-[480px] md:px-8 md:py-8 lg:min-h-[clamp(560px,46vw,680px)] lg:px-16 lg:py-14">
        <h1 className="hero-enter hero-enter-2 max-w-[650px] text-[clamp(2.55rem,6.1vw,7rem)] font-black leading-[.92] tracking-[-.055em] text-white">Crave It.<br /><span className="text-orange-500">Get It.</span><br />Love It.</h1>
        <p className="hero-enter hero-enter-3 mt-4 max-w-[560px] text-sm leading-5 text-white/90 md:mt-5 md:text-[15px] md:leading-6 lg:text-lg lg:leading-7">Order from top local restaurants, track your delivery in real-time, and enjoy delicious food at your doorstep.</p>
        <div className="hero-enter hero-enter-4 mt-5 w-full max-w-[700px] md:mt-6"><div className="hero-search flex items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/35"><Search className="ml-2 h-4 w-4 shrink-0 text-orange-600 md:ml-3 md:h-5 md:w-5" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search restaurants or cuisines" placeholder="Search for restaurants, cuisines, or dishes..." className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-xs text-stone-900 outline-none placeholder:text-stone-400 md:py-3 md:text-sm" /><button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-700 active:scale-95 md:px-5 md:py-3 md:text-sm">Search <ArrowRight className="hidden h-4 w-4 sm:block" /></button></div><div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-white md:mt-3 md:text-xs"><span>🔥 Fresh</span><i className="h-1 w-1 rounded-full bg-orange-400" /><span>Tasty</span><i className="h-1 w-1 rounded-full bg-orange-400" /><span>Local</span></div></div>
      </div>
    </section>

    <section className="relative z-10 mx-4 -mt-1 rounded-2xl bg-white px-2 py-2 shadow-md shadow-stone-200/70 sm:mx-6 sm:mt-5 sm:px-3 lg:mx-0">
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">{cuisines.map((cuisine) => <button key={cuisine} onClick={() => setSelectedCuisine(cuisine)} className={`flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition sm:min-w-[76px] ${selectedCuisine === cuisine ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25' : 'text-stone-700 hover:bg-orange-50'}`}><span className={`grid h-8 w-8 place-items-center rounded-lg text-base ${selectedCuisine === cuisine ? 'bg-white/15' : 'bg-orange-50'}`}>{cuisineIcons[cuisine.toLowerCase()] || '🍽️'}</span><span className="whitespace-nowrap">{cuisine}</span></button>)}</div>
    </section>

    <section id="restaurants" className="scroll-mt-28 mt-8"><div className="mb-4 flex items-end justify-between"><div><h2 className="text-2xl font-black tracking-tight text-stone-950">Popular <span className="text-orange-600">Restaurants</span></h2><p className="mt-0.5 text-sm text-stone-500">{restaurants.length} places available for delivery</p></div><div className="hidden items-center gap-2 sm:flex"><Link to="/restaurants" className="text-sm font-bold text-orange-600 hover:text-orange-700">View all →</Link><span className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-stone-700"><ChevronLeft className="h-4 w-4" /></span><span className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-stone-700"><ChevronRight className="h-4 w-4" /></span></div></div>
      {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((n) => <div key={n} className="h-[280px] animate-pulse rounded-2xl bg-stone-200" />)}</div> : error ? <div className="rounded-2xl border border-orange-100 bg-orange-50 p-10 text-center"><p className="font-bold text-stone-800">{error}</p><button onClick={() => setSearchQuery('')} className="mt-3 text-sm font-bold text-orange-600">Try again</button></div> : restaurants.length === 0 ? <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center"><UtensilsCrossed className="mx-auto h-9 w-9 text-orange-500" /><h3 className="mt-3 text-lg font-bold">No restaurants found</h3><button onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }} className="mt-3 text-sm font-bold text-orange-600">Clear filters</button></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{restaurants.slice(0, 4).map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} compact />)}</div>}
      <Link to="/restaurants" className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-orange-600 sm:hidden">View all restaurants <ArrowRight className="h-4 w-4" /></Link>
    </section>

    <section className="mt-7 grid overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-[#fff3e8] via-[#fffaf3] to-[#fff3e8] sm:grid-cols-2 lg:grid-cols-4">{[[Bike, 'Lightning Fast Delivery', 'Average 30 mins to your door'], [UtensilsCrossed, 'Fresh & Hygienic', '100% verified kitchens'], [ShieldCheck, 'Safe & Secure Payments', 'Cards, UPI & Cash on Delivery'], [Headphones, '24/7 Live Support', 'Always here to help you']].map(([Icon, title, text], index) => <div key={title} className={`flex items-center gap-3 px-5 py-4 ${index ? 'border-t border-orange-100 sm:border-t-0 lg:border-l' : ''}`}><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-orange-600 shadow-sm"><Icon className="h-5 w-5" /></div><div><h3 className="text-xs font-black text-stone-900">{title}</h3><p className="mt-0.5 text-[11px] text-stone-600">{text}</p></div></div>)}</section>
  </div>;
};
