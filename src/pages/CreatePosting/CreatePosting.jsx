import React, { useState } from "react";
import styles from "./CreatePosting.module.css";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  extractSkillsFromPosting,
  CreatePosting,
  fetchPostings,
} from "../../apis/JobPosting";

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobLocation: "",
    experience: "",
    jobTitle: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    jobDescription: "",
  });
  const [skills, setSkills] = useState([]);
  const { userState } = useAuthContext();
  const { user_id, token } = userState;
  const [extractedSkills, setExtractedSkills] = useState(false);
  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Form Submission
  const handleFetchSkills = async (e) => {
    e.preventDefault();
    const extractedSkills = await extractSkillsFromPosting(
      formData,
      user_id,
      token
    );
    console.log(extractedSkills);
    setSkills((skills) => extractedSkills);
    setExtractedSkills(true);
  };
  const handleCreatePosting = async (e) => {
    e.preventDefault();
    await CreatePosting(formData, user_id, skills, token);
  };
  // Remove skill from list
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          <Link to="/">HIRE</Link> &gt;&gt;{" "}
          <Link to="/createJobPosting">CREATE A POSTING</Link>
        </div>
      </div>
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.card}>
            <form>
              {/* Job Details Form Fields */}
              <div className={styles.form}>
                <div>
                  <label className={styles.label}>Job Location</label>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formData.jobLocation}
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
                    value={formData.experience}
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
                    name="jobTitle"
                    value={formData.jobTitle}
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
                            name="jobType"
                            value={type}
                            checked={formData.jobType === type}
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
                    name="minSalary"
                    value={formData.minSalary}
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
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter maximum salary"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Job Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Provide a detailed description of the job"
                    rows="5"
                    required
                  ></textarea>
                </div>
              </div>
              {/* Skills Section (Separate Row Before Buttons) */}
              {extractedSkills && skills.length > 0 && (
                <div className={styles.skillSet}>
                  <label className={styles.label}>Job Skills</label>
                  <div className={styles.skillsContainer}>
                    {skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                        <button
                          type="button"
                          className={styles.removeSkill}
                          onClick={() => removeSkill(skill)}
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Button Section */}
              <div className={styles.buttonContainer}>
                <>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={(e) => {
                      handleFetchSkills(e);
                    }}
                  >
                    Extract Skills
                  </button>
                  <button
                    type="submit"
                    className={styles.button}
                    disabled={!extractedSkills}
                    onClick={(e) => {
                      handleCreatePosting(e);
                    }}
                  >
                    Save
                  </button>
                </>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default PostJob;
