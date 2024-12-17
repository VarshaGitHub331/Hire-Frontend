import { useLocation } from "react-router-dom";
import styles from "./MyGig.module.css";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";

export default function MyGig() {
  const location = useLocation();
  const [gig, setGig] = useState(location.state?.gig);
  const url = process.env.REACT_APP_SERVER_URL;
  const [editing, setEditing] = useState(false);
  const [gigTitle, setGigTitle] = useState(gig.title);
  const [budget, setBudget] = useState(gig.budget);
  const [category, setCategory] = useState(gig.category_name);
  const [skillNames, setSkillNames] = useState(gig.skills_names?.split(","));
  const [features, setFeatures] = useState(gig.features);
  const [skillDetails, setSkillDetails] = useState([]); // Add this to use React state
  const { userState } = useAuthContext();
  const user_id = userState.user_id;
  const handleSave = async () => {
    alert("calledddddd");
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
    let updatedSkillDetails = [...skillDetails]; // Create a copy of the current skillDetails array

    let flag = 1;

    // Check if the skill is already in skillDetails
    for (let i = 0; i < updatedSkillDetails.length; i++) {
      if (
        updatedSkillDetails[i].updatedFrom ===
        gig.skills_names.split(",")[index]
      ) {
        flag = 0; // If skill already exists, update the value
        updatedSkillDetails[i].updatedTo = newValue;
        break;
      }
    }

    // If the skill does not exist, add a new entry
    if (flag === 1) {
      updatedSkillDetails.push({
        status: "updated",
        updatedFrom: gig.skills_names.split(",")[index],
        updatedTo: newValue,
      });
    }

    // Update the skillDetails state
    setSkillDetails(updatedSkillDetails);

    // Also update the skillNames state to reflect the change in UI
    setSkillNames((prevSkills) =>
      prevSkills.map((skill, i) => (i === index ? newValue : skill))
    );
  };

  const handleFeatureChange = (index, newValue) => {
    setFeatures((features) =>
      features.map((feature, i) => (i == index ? newValue : feature))
    );
  };
  return (
    <div className={styles.MyGig}>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          HIRE &gt; MY GIGS &gt;&gt; {gig.category_name}
        </div>
      </div>
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
              onChange={(e) => setCategory(e.target.value)}
            />
          ) : (
            <div className={styles.catTag}>{category}</div>
          )}
        </div>

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
              onClick={() => {
                {
                  editing == true && handleSave();
                }
                setEditing((prev) => !prev);
              }}
            >
              {editing ? "Save" : "Edit"}
            </div>
            <div className={styles.deleteTag}>Delete</div>
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
    </div>
  );
}
