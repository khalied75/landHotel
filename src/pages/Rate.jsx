import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref, serverTimestamp, set } from "firebase/database";
import { auth, db } from "../component/firebase";

const categoryFields = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "service", label: "Service" },
  { key: "location", label: "Location" },
  { key: "amenities", label: "Amenities" },
];

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great!",
  5: "Excellent!",
};

function StarRating({ value, onChange, size = "h-10 w-10", interactive = false }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        if (!interactive) {
          return (
            <svg
              key={star}
              viewBox="0 0 24 24"
              className={`${size} ${active ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"}`}
            >
              <path
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.09 6.37L12 17.35l-5.72 3 1.09-6.37-4.63-4.5 6.4-.93L12 2.75Z"
              />
            </svg>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition hover:-translate-y-0.5"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`${size} ${active ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300 hover:text-amber-300"}`}
            >
              <path
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.09 6.37L12 17.35l-5.72 3 1.09-6.37-4.63-4.5 6.4-.93L12 2.75Z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function formatReviewDate(timestamp) {
  if (!timestamp) {
    return "Just now";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getUserDisplayName(user) {
  return user?.displayName?.trim() || user?.email?.split("@")[0] || "Guest";
}

export default function Rate() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({
    overall: 0,
    cleanliness: 0,
    service: 0,
    location: 0,
    amenities: 0,
  });
  const [comment, setComment] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const reviewsRef = ref(db, "reviews");
    const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const nextReviews = Object.entries(data)
        .map(([id, item]) => ({
          id,
          ...item,
        }))
        .sort((a, b) => (b.submittedAt || b.createdAt || 0) - (a.submittedAt || a.createdAt || 0));

      setReviews(nextReviews);
      setLoadingReviews(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeReviews();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const existingReview = reviews.find((item) => item.uid === user.uid);
    if (!existingReview) {
      return;
    }

    setRatings({
      overall: existingReview.overall || 0,
      cleanliness: existingReview.cleanliness || 0,
      service: existingReview.service || 0,
      location: existingReview.location || 0,
      amenities: existingReview.amenities || 0,
    });
    setComment(existingReview.comment || "");
  }, [reviews, user]);

  let stats = {
    average: "0.0",
    satisfaction: "0%",
    total: 0,
  };

  if (reviews.length) {
    const overallTotal = reviews.reduce((sum, item) => sum + (item.overall || 0), 0);
    const average = overallTotal / reviews.length;
    const satisfaction = Math.round((average / 5) * 100);

    stats = {
      average: average.toFixed(1),
      satisfaction: `${satisfaction}%`,
      total: reviews.length,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setError("Please login first to submit your review.");
      setStatus("");
      return;
    }

    const values = Object.values(ratings);
    if (values.some((value) => value < 1 || value > 5)) {
      setError("Please complete all ratings before submitting.");
      setStatus("");
      return;
    }

    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      const reviewRef = ref(db, `reviews/${user.uid}`);
      const submittedAt = Date.now();
      await set(reviewRef, {
        uid: user.uid,
        name: getUserDisplayName(user),
        email: user.email || "",
        overall: ratings.overall,
        cleanliness: ratings.cleanliness,
        service: ratings.service,
        location: ratings.location,
        amenities: ratings.amenities,
        comment: comment.trim(),
        submittedAt,
        createdAt: serverTimestamp(),
      });

      setStatus("Your review has been saved successfully.");
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to save your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 pt-16 text-slate-900">
      <section className="relative overflow-hidden px-4 py-16 text-center text-white sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.95),_transparent_35%),radial-gradient(circle_at_center,_rgba(147,51,234,0.85),_transparent_40%),linear-gradient(135deg,_#2563eb_0%,_#7c3aed_55%,_#c026d3_100%)]" />
        <div className="relative mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">Rate Your Experience</h1>
          <p className="mt-4 text-lg text-white/90 sm:mt-6 sm:text-xl md:text-3xl">Your feedback helps us serve you better</p>
        </div>
      </section>

      <section className="-mt-2 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.09 6.37L12 17.35l-5.72 3 1.09-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
              </svg>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-slate-900 sm:mt-5 sm:text-5xl">{stats.average}/5</div>
            <p className="mt-2 text-base text-slate-600 sm:mt-3 sm:text-xl">Average Rating</p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v9" />
                <path d="M14 5.88 13 10h5.83a2 2 0 0 1 1.94 2.47l-1.18 4.72A2 2 0 0 1 17.65 19H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.94-1.52L12.5 3a1.5 1.5 0 0 1 1.5 1.88Z" />
              </svg>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-slate-900 sm:mt-5 sm:text-5xl">{stats.satisfaction}</div>
            <p className="mt-2 text-base text-slate-600 sm:mt-3 sm:text-xl">Guest Satisfaction</p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="m8 14-1 7 5-3 5 3-1-7" />
              </svg>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-slate-900 sm:mt-5 sm:text-5xl">#1</div>
            <p className="mt-2 text-base text-slate-600 sm:mt-3 sm:text-xl">Top Rated Hotel</p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18 10 12l4 4 6-8" />
                <path d="M15 8h5v5" />
              </svg>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-slate-900 sm:mt-5 sm:text-5xl">{stats.total}+</div>
            <p className="mt-2 text-base text-slate-600 sm:mt-3 sm:text-xl">Happy Guests</p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8 md:p-12">
          {!user && (
            <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-blue-700">
              Login to submit your rating with your registered name.
              {" "}
              <Link to="/login" className="font-semibold underline">
                Go to Login
              </Link>
            </div>
          )}

          {user && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700">
              You are rating as <span className="font-semibold">{getUserDisplayName(user)}</span>.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">{error}</div>
          )}

          {status && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-600">{status}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl md:text-5xl">Overall Experience</h2>
              <div className="mt-6 sm:mt-8">
                <StarRating
                  value={ratings.overall}
                  onChange={(value) => setRatings((current) => ({ ...current, overall: value }))}
                  size="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16"
                  interactive
                />
              </div>
              <p className="mt-4 text-lg text-slate-600 sm:mt-5 sm:text-2xl">{ratingLabels[ratings.overall] || "Choose your rating"}</p>
            </div>

            <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
              {categoryFields.map((field) => (
                <div key={field.key} className="rounded-[1.75rem] border border-slate-200 px-4 py-5 sm:px-5 sm:py-6">
                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{field.label}</h3>
                  <div className="mt-6 sm:mt-8">
                    <StarRating
                      value={ratings[field.key]}
                      onChange={(value) => setRatings((current) => ({ ...current, [field.key]: value }))}
                      size="h-7 w-7 sm:h-9 sm:w-9"
                      interactive
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12">
              <label className="block text-xl font-bold text-slate-900 sm:text-2xl">Additional Comments</label>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell us more about your experience..."
                rows={6}
                className="mt-4 w-full rounded-[1.75rem] border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:mt-10 sm:text-2xl"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl md:text-6xl">What Our Guests Say</h2>

          {loadingReviews ? (
            <p className="mt-10 text-center text-lg text-slate-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="mt-10 text-center text-lg text-slate-500">No reviews yet. Be the first to share your experience.</p>
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                      {review.name?.charAt(0)?.toUpperCase() || "G"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 sm:text-3xl">{review.name || "Guest"}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <StarRating value={review.overall || 0} size="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-sm text-slate-500 sm:text-xl">{formatReviewDate(review.createdAt || review.submittedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-lg italic leading-8 text-slate-700 sm:mt-6 sm:text-2xl sm:leading-10">
                    "{review.comment?.trim() || "Wonderful stay and great service."}"
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
