import React from "react";
import styles from "./GigsSection.module.css";

const gigsData = [
  {
    image: "https://via.placeholder.com/300x200",
    title: "I will do UI UX design for websites and landing pages using figma",
    price: "₹43,263",
  },
  {
    image: "https://via.placeholder.com/300x200",
    title: "I will convert figma to react nextjs or vuejs using tailwind css",
    price: "₹34,155",
  },
  {
    image: "https://via.placeholder.com/300x200",
    title: "I will do figma landing page design and website development",
    price: "₹43,263",
  },
  {
    image: "https://via.placeholder.com/300x200",
    title: "I will redesign your landing page or website",
    price: "₹86,981",
  },
];

const GigsSection = () => {
  return (
    <section className={styles.gigsSection}>
      <h3 className={styles.heading}>My Gigs</h3>
      <div className={styles.gigsContainer}>
        {gigsData.map((gig, index) => (
          <div key={index} className={styles.gigCard}>
            <img src={gig.image} alt="Gig" className={styles.gigImage} />
            <p className={styles.gigTitle}>{gig.title}</p>
            <p className={styles.gigPrice}>From {gig.price}</p>
            <p className={styles.consultation}>📹 Offers video consultations</p>
          </div>
        ))}
      </div>
      <button className={styles.viewAllButton}>View all (22)</button>
    </section>
  );
};

export default GigsSection;
