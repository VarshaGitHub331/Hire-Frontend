import styles from "./MyGig.module.css";
import { useState } from "react";
export default function AdvancedFeatures({ gig, setGig }) {
  const [features, setFeatures] = useState(JSON.parse(gig.advanced_features));
  const [editing, setEditing] = useState(false);

  function handleFeatureChange(index, value) {
    setFeatures((features) => features.map((f, i) => (i == index ? value : f)));
  }
  const handleSave = async () => {
    console.log(skillDetails);
    try {
      const result = await axios.put(
        `${url}/gigs/editGig`,
        {
          gig_id: gig.gig_id,
          advanced_features: JSON.stringify(features),
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
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.packFeatures}>
      <div className={styles.featureTitle}>Advanced</div>

      <div className={styles.featureList}>
        {editing == false
          ? JSON.parse(gig.advanced_features).map((feature) => (
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
      <div className={styles.featureTitle}>
        Budget :&nbsp;&#8377; {gig.advanced_budget}
        <div
          className={styles.editTag}
          style={{ marginLeft: "50%" }}
          onClick={() => {
            {
              editing == true && handleSave();
            }
            setEditing((prev) => !prev);
          }}
        >
          {editing ? "Save" : "Edit"}
        </div>
      </div>
    </div>
  );
}
