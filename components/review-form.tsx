'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Send, Check } from 'lucide-react';
import Link from 'next/link';

interface ReviewFormProps {
  igdbId: number;
  existingReview?: {
    rating: number;
    title?: string;
    body?: string;
  };
}

function StarRating({ rating, onRatingChange, disabled = false }: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
      <span className="ml-3 text-lg font-bold text-foreground min-w-[3rem]">
        {rating > 0 ? `${rating}/10` : ''}
      </span>
    </div>
  );
}

export default function ReviewForm({ igdbId, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [body, setBody] = useState(existingReview?.body || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || rating === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          igdbId,
          rating,
          title: title.trim() || null,
          body: body.trim() || null
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-muted/50 rounded-xl border border-border p-6 text-center">
        <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground mb-4">Sign in to write a review</p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Your Rating
        </label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating}
          disabled={loading}
        />
        {rating === 0 && (
          <p className="text-sm text-muted-foreground mt-2">Click a star to rate</p>
        )}
      </div>

      {/* Review Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Review Title
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
          placeholder="Summarize your thoughts..."
        />
      </div>

      {/* Review Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-foreground mb-2">
          Review
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none disabled:opacity-50"
          placeholder="Share your detailed thoughts about this game..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          'Submitting...'
        ) : (
          <>
            <Send className="h-4 w-4" />
            {existingReview ? 'Update Review' : 'Submit Review'}
          </>
        )}
      </button>

      {/* Success Message */}
      {success && (
        <div className="flex items-center justify-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
          <Check className="h-4 w-4" />
          Review {existingReview ? 'updated' : 'submitted'} successfully!
        </div>
      )}
    </form>
  );
}
