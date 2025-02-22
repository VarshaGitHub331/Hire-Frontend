import React from "react";
import styles from "./Reviews.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFreelancerReviews } from "../../apis/User";
import { FaStar } from "react-icons/fa";

const Reviews = ({ user_id }) => {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", user_id],
    queryFn: ({ pageParam = 1 }) => fetchFreelancerReviews(user_id, pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.reviews.length > 0 ? pages.length + 1 : undefined;
    },
  });

  // Flattening the paginated data
  const reviewsData = data?.pages?.flatMap((page) => page.reviews) || [];

  // Loading state
  if (isLoading) return <div>Loading reviews...</div>;

  // Error state
  if (isError) return <div>Error loading reviews! Please try again later.</div>;

  // Empty state
  if (reviewsData.length === 0) return <div>No reviews yet.</div>;

  // Star Rating Component
  const StarRating = ({ rating }) => (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          color={index < rating ? "#eecc0f" : "#e0e0e0"}
          size={10}
        />
      ))}
    </div>
  );

  // Main JSX
  return (
    <section className={styles.reviewsSection}>
      <h4 className={styles.heading}>Client Reviews</h4>
      {reviewsData.map((review) => (
        <div className={styles.reviewCard} key={review.review_id}>
          <div className={styles.reviewHeader}>
            <h4 className={styles.reviewerName}>{review.reviewer_name}</h4>
            <StarRating rating={review.rating} />

            {review.isRepeatClient && (
              <span className={styles.repeatClient}>• Repeat Client</span>
            )}
          </div>
          <div className={styles.timeAgo}>{review.timeAgo}</div>
          <p className={styles.feedback}>{review.comment}</p>
          <div className={styles.reviewDetails}>
            <span className={styles.price}>
              ₹ {parseInt(review["Order.payable"], 10)}
            </span>
          </div>
        </div>
      ))}
      {hasNextPage && (
        <button
          className={styles.viewAllButton}
          onClick={fetchNextPage}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "View More"}
        </button>
      )}
    </section>
  );
};

export default Reviews;
