import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-orange-600 block">404</span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The page you're looking for seems to have been eaten or moved. Let's get you back to safety!
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};
