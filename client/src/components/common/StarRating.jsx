import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, numReviews, size = 'sm', interactive = false, onRatingChange }) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const currentSize = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${currentSize} ${
                star <= Math.round(rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className={`font-bold text-gray-800 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-xs'}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
      {numReviews !== undefined && (
        <span className="text-xs text-gray-500">
          ({numReviews})
        </span>
      )}
    </div>
  );
};
