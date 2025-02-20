import React from "react";
import styles from "./Reviews.module.css";

const reviewsData = [
  {
    id: 1,
    name: "poulolson",
    location: "United States",
    isRepeatClient: true,
    rating: 5,
    timeAgo: "1 month ago",
    feedback:
      "I've had a great experience working with Amit and his team over the last several months on the buildout of my small business website. They've been very accommodating of making revisions to improve the performance of the site even after the project was delivered. They also have showed me how to make updates...",
    price: "₹17,600–₹35,200",
    duration: "10 days",
    serviceType: "Website UI/UX Design",
    imageUrl: "https://via.placeholder.com/100x60", // Replace with actual image URL
  },
  {
    id: 2,
    name: "batuhankrbb",
    location: "Turkey",
    isRepeatClient: true,
    rating: 5,
    timeAgo: "2 months ago",
    feedback:
      "SOOO good. It's my third time working with massiveworks team and every time they provide exceptional value. Every time I need a website to be designed and developed, they are the only freelancer I go to. Definitely recommended.",
    price: "₹70,400–₹88,000",
    duration: "3 weeks",
    serviceType: "Webflow",
    imageUrl: "https://via.placeholder.com/100x60", // Replace with actual image URL
  },
];

const Reviews = () => {
  return (
    <section className={styles.reviewsSection}>
      <h3 className={styles.heading}>Client Reviews</h3>
      {reviewsData.map((review) => (
        <div className={styles.reviewCard} key={review.id}>
          <div className={styles.reviewHeader}>
            <h4>{review.name}</h4>
            <span className={styles.location}>{review.location}</span>
            {review.isRepeatClient && (
              <span className={styles.repeatClient}>• Repeat Client</span>
            )}
          </div>
          <div className={styles.rating}>⭐ {review.rating}</div>
          <div className={styles.timeAgo}>{review.timeAgo}</div>
          <p className={styles.feedback}>{review.feedback}</p>
          <div className={styles.reviewDetails}>
            <span className={styles.price}>{review.price}</span>
            <span className={styles.duration}>{review.duration}</span>
            <span className={styles.serviceType}>{review.serviceType}</span>
          </div>
          <img
            className={styles.reviewImage}
            src={review.imageUrl}
            alt="Service snapshot"
          />
          <div className={styles.responseSection}>
            <button className={styles.helpfulButton}>Helpful</button>
            <button className={styles.notHelpfulButton}>Not Helpful</button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Reviews;
