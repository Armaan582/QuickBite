import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { reviewAPI } from '../../services/api';
import { Sparkles } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, restaurantId, restaurantName, orderId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share a few words about your meal experience.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await reviewAPI.add({
        restaurantId,
        orderId,
        rating,
        comment: comment.trim()
      });

      if (res.data.success) {
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate & Review ${restaurantName || 'Restaurant'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 font-medium">
            How was your food and delivery experience?
          </p>
          <div className="flex justify-center py-2">
            <StarRating rating={rating} size="lg" interactive={true} onRatingChange={setRating} />
          </div>
          <span className="text-xs font-bold text-orange-600">
            {rating === 5 && 'Outstanding! 🌟'}
            {rating === 4 && 'Very Good! 😊'}
            {rating === 3 && 'Average 🙂'}
            {rating === 2 && 'Below expectations 😕'}
            {rating === 1 && 'Poor 😞'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Your Review
          </label>
          <textarea
            rows="4"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others what you loved about the food, flavors, and packaging..."
            className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all"
          />
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
