import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MyGig.module.css";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { getSkills } from "../../apis/Skills";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import StandardFeatures from "./StandardFeatures";
import AdvancedFeatures from "./AdvancedFeatures";
import toast from "react-hot-toast";
export default function MyGig() {
  const location = useLocation();
  const [gig, setGig] = useState(location.state?.gig);
  const url = process.env.REACT_APP_SERVER_URL;
  const [editing, setEditing] = useState(false);
  const [gigTitle, setGigTitle] = useState(gig.title);
  const [budget, setBudget] = useState(gig.budget);
  const [category, setCategory] = useState(gig.category_name);
  const [selectedCategory, setSelectedCategory] = useState(gig.category_name);
  const [skillNames, setSkillNames] = useState(gig.skills_names?.split(","));
  const [features, setFeatures] = useState(gig.features);
  const [skillDetails, setSkillDetails] = useState([]); // Add this to use React state
  const { userState } = useAuthContext();
  const [showSuggestedCategories, setShowSuggestedCategories] = useState(false);
  const [showSuggestedSkills, setShowSuggestedSkills] = useState(false);
  const [fromIndex, setFromIndex] = useState(0);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const user_id = userState.user_id;
  const navigate = useNavigate();
  const { data: fetchedCategories, isLoadingCat } = useQuery({
    queryKey: ["fetchedCategories"],
    queryFn: () => getCategories(),
  });
  const { data: fetchedSkills, isLoading } = useQuery({
    queryKey: ["fetchedSkills", selectedCategory],
    queryFn: () => getSkills([selectedCategory]),
    enabled: !!selectedCategory && selectedCategory.length > 0,
  });
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);

  const handleSave = async () => {
    console.log(skillDetails);
    try {
      const result = await axios.put(
        `${url}/gigs/editGig`,
        {
          gigTitle,
          budget,
          category,
          gig_id: gig.gig_id,
          skillDetails,
          features,
          user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userState.token}`,
          },
        }
      );
      console.log(result);
      setGig(result.data[0]);
      setSkillDetails((skills) => []);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSkillChange = (index, newValue) => {
    console.log(fetchedSkills);
    console.log(newValue);
    setFromIndex((fromIndex) => index); // Also update the skillNames state to reflect the change in UI
    setSkillNames((prevSkills) =>
      prevSkills.map((skill, i) => (i === index ? newValue : skill))
    );
    setSuggestedSkills(
      fetchedSkills?.filter(
        (fetchedSkill) =>
          newValue.length > 3 &&
          fetchedSkill.skill_name.toLowerCase().includes(newValue.toLowerCase())
      )
    );
    setShowSuggestedSkills(true);
  };

  const handleFeatureChange = (index, newValue) => {
    setFeatures((features) =>
      features.map((feature, i) => (i == index ? newValue : feature))
    );
  };

  const handleSkillSelect = (skillName) => {
    let flag = 1;
    for (let i = 0; i < skillDetails.length; i++) {
      if (i == fromIndex) {
        flag = 0;
        skillDetails[i].updatedTo = skillName;
        break;
      }
    }
    if (flag == 1) {
      skillDetails.push({
        status: "updated",
        updatedFrom: gig.skills_names.split(",")[fromIndex],
        updatedTo: skillName,
      });
    }
    setSkillNames((skillNames) =>
      skillNames.map((skn, index) => {
        if (index == fromIndex) return skillName;
        else return skn;
      })
    );
  };
  const handleDelete = async () => {
    try {
      const deleted = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/gigs/deleteGig`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { gig_id: gig.gig_id }, // Include `data` in the same object as `headers`
        }
      );
      console.log(deleted);
      toast.success("Your Gig Has Been Deleted!");
      navigate("/myGigs");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.MyGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          <Link to="/">HIRE</Link> &gt; <Link to="/myGigs">MY GIGS</Link>{" "}
          &gt;&gt; {gig.category_name}
        </div>
      </div>
      <div
        className={styles.gigContainer}
        onClick={(e) => {
          if (!editing) setShowDescriptionPopup(true);
        }}
      >
        <div className={styles.gigCard}>
          <div className={styles.gigImage}>
            <img src={gig.picture[0]} alt="gigImage" />
          </div>
          {editing ? (
            <input
              type="text"
              className={styles.gigTitle}
              value={gigTitle}
              onChange={(e) => setGigTitle(e.target.value)}
            />
          ) : (
            <div className={styles.gigTitle}>{gig.title}</div>
          )}
          <div className={styles.gigCategories}>
            Category:
            {editing ? (
              <input
                type="text"
                style={{ width: category ? `${category.length + 1}ch` : `2ch` }}
                value={category}
                className={styles.catTag}
                onChange={(e) => {
                  setShowSuggestedCategories(true);
                  setCategory(e.target.value);
                }}
              />
            ) : (
              <div className={styles.catTag}>{category}</div>
            )}
          </div>
          {showSuggestedCategories && (
            <div className={styles.suggestedCategories}>
              {fetchedCategories.map((cat) => {
                if (
                  category &&
                  category.length > 3 &&
                  cat.category_name
                    .toLowerCase()
                    .includes(category.toLowerCase())
                )
                  return (
                    <div
                      className={styles.catTag}
                      style={{
                        backgroundColor: "#2dd889",
                        height: "0.5rem",
                        margin: "0.2rem",
                        fontSize: "0.6rem",
                        width: "auto",
                      }}
                      onClick={(e) => {
                        setCategory((category) => cat.category_name);
                        setShowSuggestedCategories((show) => !show);
                        setSelectedCategory(
                          (selectedCategory) => cat.category_name
                        );
                      }}
                    >
                      {cat.category_name}
                    </div>
                  );
              })}
            </div>
          )}
          <div className={styles.gigCategories}>
            Skills:
            {editing
              ? skillNames.map((skill, index) => (
                  <input
                    key={index}
                    type="text"
                    value={skill}
                    className={styles.catTag}
                    style={{ width: skill ? `${skill.length + 1}ch` : `2ch` }}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                ))
              : gig.skills_names.split(",").map((skill, index) => (
                  <div key={index} className={styles.catTag}>
                    {skill}
                  </div>
                ))}
          </div>
          {showSuggestedSkills && (
            <div className={styles.suggestedCategories}>
              {suggestedSkills?.map((sk) => (
                <div
                  className={styles.catTag}
                  style={{
                    backgroundColor: "#2dd889",
                    height: "0.5rem",
                    margin: "0.2rem",
                    fontSize: "0.6rem",
                    width: "auto",
                  }}
                  onClick={(e) => {
                    handleSkillSelect(sk.skill_name);
                    setShowSuggestedSkills(
                      (suggestedSkills) => !suggestedSkills
                    );
                  }}
                >
                  {sk.skill_name}
                </div>
              ))}
            </div>
          )}
          <div className={styles.features}>
            {editing == false
              ? gig.features.map((feature) => (
                  <div>
                    <span
                      style={{
                        color: "green",
                        fontSize: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      ✔
                    </span>
                    {feature}
                  </div>
                ))
              : features.map((feature, index) => (
                  <div>
                    <span
                      style={{
                        color: "green",
                        fontSize: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      ✔
                    </span>
                    <input
                      style={{ all: "unset", width: `${feature.length + 1}ch` }}
                      value={feature}
                      onChange={(e) => {
                        handleFeatureChange(index, e.target.value);
                      }}
                    />
                  </div>
                ))}
          </div>
          <div className={styles.bottom}>
            <div
              className={styles.settings}
              style={{ display: "flex", gap: "1rem" }}
            >
              <div
                className={styles.editTag}
                onClick={(e) => {
                  e.stopPropagation();
                  {
                    editing == true && handleSave();
                  }
                  setEditing((prev) => !prev);
                }}
              >
                {editing ? "Save" : "Edit"}
              </div>
              <div
                className={styles.deleteTag}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete
              </div>
            </div>

            {editing ? (
              <div className={styles.budget}>
                &#8377;{" "}
                <input
                  style={{
                    all: "unset",

                    width: `${String(budget).length + 1}ch`, // Convert number to string to calculate its length
                  }}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            ) : (
              <div className={styles.budget}>&#8377; {budget}</div>
            )}
          </div>
        </div>
        <div>
          {gig.standard_budget != 0 && (
            <StandardFeatures gig={gig} setGig={setGig} />
          )}
          {gig.advanced_budget != 0 && (
            <AdvancedFeatures gig={gig} setGig={setGig} />
          )}
        </div>
        {showDescriptionPopup == true && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <p>{gig.description}</p>
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDescriptionPopup(false);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
