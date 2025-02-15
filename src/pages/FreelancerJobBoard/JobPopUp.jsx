import React from "react";
import styles from "./JobPopUp.module.css";
import { useNavigate } from "react-router-dom";

const Pop = ({ job, onClose }) => {
  const navigate = useNavigate();
  if (!job) return null; // Don't render if no job is selected

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h4>{job.title}</h4>
        <p>{job.description}</p>
        <div className={styles.category}>
          <h6>Category</h6>

          {job.Categories.map((jobCat) => (
            <span className={styles.tags}>{jobCat.category_name}</span>
          ))}
        </div>
        <div className={styles.skill}>
          <h6>Skills</h6>
          {job.Skills.map((jobSkill) => (
            <span className={styles.tags}>{jobSkill.skill_name}</span>
          ))}
        </div>
        <hr />
        <p>
          ₹{job.min_budget} - ₹{job.max_budget}
        </p>
        <button
          onClick={(e) => {
            navigate("/createProposal", {
              state: {
                job,
              },
            });
          }}
        >
          APPLY
        </button>
      </div>
    </div>
  );
};

export default Pop;
