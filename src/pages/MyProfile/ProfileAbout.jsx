import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./ProfileAbout.module.css"; // Import the CSS Module
import { useOutletContext } from "react-router-dom";

const ProfileSkills = () => {
  const { profileData } = useOutletContext();

  // Ensure freelancerSkills and freelancerCategory are always arrays
  const [skills, setSkills] = useState(profileData.freelancerSkills || []);
  const [categories, setCategories] = useState(
    Array.isArray(profileData.freelancerCategory)
      ? profileData.freelancerCategory
      : [profileData.freelancerCategory]
  );

  // Remove skill
  const removeSkill = (skillName) => {
    setSkills(skills.filter((item) => item.skill_name !== skillName));
  };

  // Remove category
  const removeCategory = (categoryName) => {
    setCategories(
      categories.filter((item) => item.category_name !== categoryName)
    );
  };

  return (
    <div className={styles.profileSkillsContainer}>
      <div className={styles.tagsContainer}>
        <div className={styles.tags}>
          <div>Skills</div>
          {skills.map((skill, index) => (
            <div key={index} className={styles.tag}>
              {skill.skill_name}
              <FaTimes
                className={styles.removeIcon}
                onClick={() => removeSkill(skill.skill_name)}
              />
            </div>
          ))}
        </div>

        <div className={styles.tags}>
          <div>Categories</div>
          {categories.map((category, index) => (
            <div key={index} className={styles.tag}>
              {category.category_name}
              <FaTimes
                className={styles.removeIcon}
                onClick={() => removeCategory(category.category_name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkills;
