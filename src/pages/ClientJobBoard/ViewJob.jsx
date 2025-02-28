import React, { useState } from "react";
import styles from "./ViewJob.module.css";
import { useLocation, Link } from "react-router-dom";
import { editPosting, closePosting } from "../../apis/JobPosting";
import { useAuthContext } from "../../contexts/AuthContext";
const ViewJob = () => {
  const location = useLocation();
  const job = location?.state?.job || {}; // Ensure job is defined
  console.log(job);
  const [editedJob, setEditedJob] = useState({ ...job });
  const [saving, setSaving] = useState(false);
  const { userState } = useAuthContext();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedJob({
      ...editedJob,
      [name]: type === "radio" ? value : value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedJob = await editPosting(editedJob, userState.token);
    setEditedJob(updatedJob);
    setSaving(false);
  };
  const handleClosePosting = async (e, postingStatus) => {
    e.preventDefault();
    const updatedJob = await closePosting(
      editedJob.job_id,
      postingStatus,
      userState.token
    );
    setEditedJob(updatedJob);
  };
  return (
    <>
      <div className={styles.direction}>
        <Link to="/">HIRE</Link> &gt;&gt;{" "}
        <Link to={`/clientJobs/${job.job_id}`}>VIEW POSTING</Link>
      </div>
      <div className={styles.card}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.form}>
            <div>
              <label className={styles.label}>Job Location</label>
              <input
                type="text"
                name="location"
                value={editedJob.location || ""}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label className={styles.label}>Experience</label>
              <select
                name="experience"
                value={editedJob.experience || ""}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Select Experience</option>
                <option value="Entry">Entry</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div>
              <label className={styles.label}>Job Title</label>
              <input
                type="text"
                name="title"
                value={editedJob.title || ""}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., SDE Intern"
                required
              />
            </div>

            <div>
              <label className={styles.label}>Job Type</label>
              <div className={styles.radioGroup}>
                {["Full-time", "Part-time", "Contract", "Freelance"].map(
                  (type) => (
                    <label key={type} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="job_type"
                        value={type}
                        checked={editedJob.job_type === type}
                        onChange={handleChange}
                        className={styles.radio}
                        required
                      />
                      {type}
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className={styles.label}>Minimum Salary</label>
              <input
                type="number"
                name="min_budget"
                value={editedJob.min_budget || ""}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter minimum salary"
                required
              />
            </div>

            <div>
              <label className={styles.label}>Maximum Salary</label>
              <input
                type="number"
                name="max_budget"
                value={editedJob.max_budget || ""}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter maximum salary"
                required
              />
            </div>

            <div>
              <label className={styles.label}>Job Description</label>
              <textarea
                name="description"
                value={editedJob.description || ""}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Provide a detailed description of the job"
                rows="5"
                required
              ></textarea>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={handleSave}
            >
              {saving == true ? "Saving" : "Save"}
            </button>

            <button
              type="button"
              className={styles.button}
              onClick={(e) => {
                handleClosePosting(
                  e,
                  editedJob.status == "Closed" ? "Open" : "Closed"
                );
              }}
            >
              {editedJob.status != "Closed" ? "Close" : "Open"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ViewJob;
