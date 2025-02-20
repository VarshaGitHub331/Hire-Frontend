import React, { useState } from "react";
import { FaTimes, FaPen, FaCheck } from "react-icons/fa";
import styles from "./ProfileAbout.module.css";
import { useOutletContext } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { getAllSkills } from "../../apis/Skills";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  updateFreelancerSkills,
  updateFreelancerCategories,
} from "../../apis/UpdateProfile";
import { useAuthContext } from "../../contexts/AuthContext";

const ProfileSkills = () => {
  const { profileData, refetch } = useOutletContext();
  const { userState } = useAuthContext();

  const { data: allSkills = [], isLoading: isLoadingSkills } = useQuery({
    queryFn: getAllSkills,
    queryKey: ["skills"],
  });

  const { data: allCategories = [], isLoading: isLoadingCategories } = useQuery(
    {
      queryFn: getCategories,
      queryKey: ["categories"],
    }
  );

  const [skills, setSkills] = useState(profileData.freelancerSkills || []);
  const [categories, setCategories] = useState(
    Array.isArray(profileData.freelancerCategory)
      ? profileData.freelancerCategory
      : profileData.freelancerCategory
      ? [profileData.freelancerCategory]
      : []
  );

  const [editBio, setEditBio] = useState(
    profileData.FrelancerDetails?.profile || ""
  );
  const [editingBio, setEditingBio] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");

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

  const removeSkill = (skillName) => {
    const updatedSkills = skills.filter(
      (item) => item.skill_name !== skillName
    );
    setSkills(updatedSkills);
    updateSkillsMutation.mutate(updatedSkills);
  };

  const removeCategory = (categoryName) => {
    const updatedCategories = categories.filter(
      (item) => item.category_name !== categoryName
    );
    setCategories(updatedCategories);
    updateCategoriesMutation.mutate(updatedCategories);
  };

  const addSkill = (skillName) => {
    const foundSkill = allSkills.find((skill) => skill.skill_name == skillName);
    if (!skills.some((skill) => skill.skill_name === skillName)) {
      const updatedSkills = [
        ...skills,
        { skill_name: skillName, skill_id: foundSkill.skill_id },
      ];
      setSkills(updatedSkills);
      setNewSkill("");
      updateSkillsMutation.mutate(updatedSkills);
    }
  };

  const addCategory = (categoryName) => {
    const foundCategory = allCategories.find(
      (category) => category.categoryName
    );
    if (
      !categories.some((category) => category.category_name === categoryName)
    ) {
      const updatedCategories = [
        ...categories,
        { category_name: categoryName, category_id: foundCategory.category_id },
      ];
      setCategories(updatedCategories);
      setNewCategory("");
      updateCategoriesMutation.mutate(updatedCategories);
    }
  };

  const skillSuggestions = allSkills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(newSkill.toLowerCase())
  );

  const categorySuggestions = allCategories.filter((category) =>
    category.category_name.toLowerCase().includes(newCategory.toLowerCase())
  );

  const handleBioSave = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/freelancer/updateProfile`,
        { profile: editBio, user_id: userState.user_id },
        { headers: { "Content-Type": "application/json" } }
      );
      refetch();
      setEditingBio(false);
    } catch (e) {
      console.error("Error updating bio:", e);
    }
  };

  return (
    <div className={styles.profileSkillsContainer}>
      <div className={styles.profileInfoContainer}>
        <div>Bio</div>
        {!editingBio ? (
          <div style={{ marginLeft: "2%", color: "gray" }}>{editBio}</div>
        ) : (
          <input
            type="text"
            className={styles.bioInput}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
        )}
        <i onClick={editingBio ? handleBioSave : () => setEditingBio(true)}>
          {editingBio ? <FaCheck /> : <FaPen />}
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
          {newSkill && skillSuggestions.length > 0 && (
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
          {newCategory && categorySuggestions.length > 0 && (
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
