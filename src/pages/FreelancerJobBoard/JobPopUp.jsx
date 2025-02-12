import React from "react";
import styles from "./JobPopUp.module.css";

const Pop = ({ job, onClose }) => {
  if (!job) return null; // Don't render if no job is selected

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h5>{job.title}</h5>
        <p>{job.description}</p>
        <div className={styles.category}>
          <h5>Category</h5>

          {job.Categories.map((jobCat) => (
            <span className={styles.tags}>{jobCat.category_name}</span>
          ))}
        </div>
        <div className={styles.skill}>
          <h5>Skills</h5>
          {job.Skills.map((jobSkill) => (
            <span className={styles.tags}>{jobSkill.skill_name}</span>
          ))}
        </div>
        <hr />
        <p>
          ₹{job.min_budget} - ₹{job.max_budget}
        </p>
      </div>
    </div>
  );
};

export default Pop;
