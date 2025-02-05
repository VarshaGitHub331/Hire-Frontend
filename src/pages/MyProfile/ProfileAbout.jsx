import React, { useState } from "react";
import { FaTimes, FaPen, FaCheck } from "react-icons/fa";
import styles from "./ProfileAbout.module.css";
import { useOutletContext } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { getAllSkills } from "../../apis/Skills";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  updateFreelancerSkills,
  updateFreelancerCategories,
} from "../../apis/UpdateProfile";
import { useAuthContext } from "../../contexts/AuthContext";
const ProfileSkills = () => {
  const { profileData } = useOutletContext();
  const { userState } = useAuthContext();

  const { data: allSkills, isLoadingSkills } = useQuery({
    queryFn: () => getAllSkills(),
    queryKey: ["skills"],
  });
  const { data: allCategories, isLoadingCategories } = useQuery({
    queryFn: () => getCategories(),
    queryKey: ["categories"],
  });

  // Ensure freelancerSkills and freelancerCategory are always arrays
  const [skills, setSkills] = useState(profileData.freelancerSkills || []);
  const [categories, setCategories] = useState(
    Array.isArray(profileData.freelancerCategory)
      ? profileData.freelancerCategory
      : [profileData.freelancerCategory]
  );
  const [bio, setBio] = useState(profileData.FrelancerDetails.profile);

  // Input fields for adding skills and categories
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Use Mutation hooks to make requests to the backend with mutationFn approach
  const updateSkillsMutation = useMutation({
    mutationFn: (updatedSkills) =>
      updateFreelancerSkills({
        user_id: userState.user_id,
        freelancerSkills: updatedSkills,
      }),
  });

  const updateCategoriesMutation = useMutation({
    mutationFn: (updatedCategories) =>
      updateFreelancerCategories({
        user_id: userState.user_id,
        freelancerCategories: updatedCategories,
      }),
  });

  // Remove skill
  const removeSkill = (skillName) => {
    const updatedSkills = skills.filter(
      (item) => item.skill_name !== skillName
    );
    setSkills(updatedSkills);
    updateSkillsMutation.mutate(updatedSkills); // Trigger API to update the database
  };

  // Remove category
  const removeCategory = (categoryName) => {
    const updatedCategories = categories.filter(
      (item) => item.category_name !== categoryName
    );
    setCategories(updatedCategories);
    updateCategoriesMutation.mutate(updatedCategories); // Trigger API to update the database
  };

  // Add new skill
  const addSkill = (skillName) => {
    const updatedSkills = [...skills, { skill_name: skillName }];
    setSkills(updatedSkills);
    setNewSkill(""); // Clear input field after adding
    updateSkillsMutation.mutate(updatedSkills); // Trigger API to update the database
  };

  // Add new category
  const addCategory = (categoryName) => {
    const updatedCategories = [...categories, { category_name: categoryName }];
    setCategories(updatedCategories);
    setNewCategory(""); // Clear input field after adding
    updateCategoriesMutation.mutate(updatedCategories); // Trigger API to update the database
  };

  // Filter suggestions for skills based on input
  const skillSuggestions = allSkills
    ? allSkills.filter((skill) =>
        skill.skill_name.toLowerCase().includes(newSkill.toLowerCase())
      )
    : [];

  // Filter suggestions for categories based on input
  const categorySuggestions = allCategories
    ? allCategories.filter((category) =>
        category.category_name.toLowerCase().includes(newCategory.toLowerCase())
      )
    : [];

  return (
    <div className={styles.profileSkillsContainer}>
      <div className={styles.profileInfoContainer}>
        <div>Bio</div>
        <p>{bio}</p>
        <i>
          <FaPen />
        </i>
      </div>
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
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className={styles.inputField}
          />
          {newSkill && (
            <div className={styles.suggestions}>
              {skillSuggestions.map((suggestedSkill) => (
                <div
                  key={suggestedSkill.skill_name}
                  className={styles.suggestionItem}
                  onClick={() => addSkill(suggestedSkill.skill_name)}
                >
                  {suggestedSkill.skill_name}
                  <FaCheck />
                </div>
              ))}
            </div>
          )}
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
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add a category"
            className={styles.inputField}
          />
          {newCategory && (
            <div className={styles.suggestions}>
              {categorySuggestions.map((suggestedCategory) => (
                <div
                  key={suggestedCategory.category_name}
                  className={styles.suggestionItem}
                  onClick={() => addCategory(suggestedCategory.category_name)}
                >
                  {suggestedCategory.category_name}
                  <FaCheck />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkills;
