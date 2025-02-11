import React, { useState } from "react";
import styles from "./FreelancerJobBoard.module.css";
import { useQuery } from "@tanstack/react-query";
const JobPostings = () => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={styles.container}>
      {/* Top Section: Filter Button, Search Bar */}
      <div className={styles.topSection}>
        <button className={styles.filterButton} onClick={toggleFilters}>
          &#x25BC; Filter
        </button>
        <input
          type="text"
          placeholder="Search jobs..."
          className={styles.searchBar}
        />
        <button className={styles.searchButton}>Search</button>
      </div>

      {/* Horizontal Divider */}
      <hr className={styles.divider} />

      <div className={styles.mainContent}>
        {/* Sidebar (Filters) */}
        <div className={`${styles.sidebar} ${showFilters ? styles.show : ""}`}>
          <h5>Categories</h5>
          <ul>
            <li>
              <input type="checkbox" /> Software Development
            </li>
            <li>
              <input type="checkbox" /> Data Science
            </li>
            <li>
              <input type="checkbox" /> Design
            </li>
            <li>
              <input type="checkbox" /> Marketing
            </li>
            <li>
              <input type="checkbox" /> Finance
            </li>
          </ul>

          <h5>Budget</h5>
          <ul>
            <li>
              <input type="checkbox" /> ₹0 - ₹10,000
            </li>
            <li>
              <input type="checkbox" /> ₹10,000 - ₹50,000
            </li>
            <li>
              <input type="checkbox" /> ₹50,000+
            </li>
          </ul>
          <h5>Categories</h5>
          <ul>
            <li>
              <input type="checkbox" /> Software Development
            </li>
            <li>
              <input type="checkbox" /> Data Science
            </li>
            <li>
              <input type="checkbox" /> Design
            </li>
            <li>
              <input type="checkbox" /> Marketing
            </li>
            <li>
              <input type="checkbox" /> Finance
            </li>
          </ul>
          <h5>Budget</h5>
          <ul>
            <li>
              <input type="checkbox" /> ₹0 - ₹10,000
            </li>
            <li>
              <input type="checkbox" /> ₹10,000 - ₹50,000
            </li>
            <li>
              <input type="checkbox" /> ₹50,000+
            </li>
          </ul>
        </div>

        {/* Job Listings */}
        <div className={styles.jobsContainer}>
          <div className={styles.jobCard}>
            <h4>Frontend Developer</h4>
            <p>Company XYZ - Remote</p>
            <span className={styles.category}>Tech</span>
            <p className={styles.salary}>₹50,000</p>
          </div>

          <div className={styles.jobCard}>
            <h4>Data Analyst</h4>
            <p>ABC Corp - Bangalore</p>
            <span className={styles.category}>Data Science</span>
            <p className={styles.salary}>₹60,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostings;
