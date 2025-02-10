import React, { useState } from "react";
import styles from "./JobModal.module.css";

const JobModal = ({ job, onClose }) => {
  const [editedJob, setEditedJob] = useState({ ...job });

  const handleEdit = () => {
    // Call API to update the job
    console.log("Updated Job:", editedJob);
    onClose(); // Close modal after updating
  };

  const handleDelete = () => {
    // Call API to delete the job
    console.log("Deleted Job:", job);
    onClose(); // Close modal after deleting
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <input
          type="text"
          value={editedJob.title}
          onChange={(e) =>
            setEditedJob({ ...editedJob, title: e.target.value })
          }
        />
        <input
          type="text"
          value={editedJob.experience}
          onChange={(e) =>
            setEditedJob({ ...editedJob, experience: e.target.value })
          }
        />
        <input
          type="text"
          value={editedJob.job_type}
          onChange={(e) =>
            setEditedJob({ ...editedJob, job_type: e.target.value })
          }
        />
        <input
          type="number"
          value={editedJob.min_budget}
          onChange={(e) =>
            setEditedJob({ ...editedJob, min_budget: e.target.value })
          }
        />
        <input
          type="number"
          value={editedJob.max_budget}
          onChange={(e) =>
            setEditedJob({ ...editedJob, max_budget: e.target.value })
          }
        />

        <div className={styles.buttonContainer}>
          <button className={styles.save} onClick={handleEdit}>
            Save
          </button>
          <button className={styles.delete} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
