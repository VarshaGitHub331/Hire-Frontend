import styles from "./AddSecond.module.css";
import { useState } from "react";
export default function Basic({ values, setFieldValue }) {
  const [features, setFeatures] = useState(values.features);
  const [featureInput, setFeatureInput] = useState("");

  const handleKeyPress = (event, values, setFieldValue) => {
    if (event.key === "Enter" && featureInput.trim()) {
      event.preventDefault();

      if (features.length < 3) {
        // Add the new feature to the state
        const newFeatures = [...features, featureInput.trim()];
        setFeatures(newFeatures);
        setFeatureInput("");

        // Update the Formik field 'features' based on the new length
        setFieldValue("features", [...values.features, featureInput.trim()]);
      } else {
        alert("You can add up to 3 features only.");
      }
    }
  };
  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  return (
    <div className={styles.features}>
      <div style={{ marginLeft: "1rem", fontWeight: "500" }}>
        Add Features For Your Package :
      </div>
      <ul>
        {features.map((feature, index) => (
          <div
            style={{
              minWidth: "100%",
              width: "auto",
              display: "flex",
              justifyContent: "flex-start",
              gap: "10%",
            }}
          >
            <li key={index} style={{ textAlign: "left" }}>
              {feature}
            </li>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              style={{
                color: "grey",
                background: "smokewhite",
                border: "none",
                width: "1rem",
                height: "1rem",
                fontSize: "0.5rem",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </ul>
      {features.length < 3 && (
        <input
          type="text"
          value={featureInput}
          style={{ marginLeft: "1rem", fontSize: "0.7em" }}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, values, setFieldValue)}
          className={styles.featureInput}
        />
      )}
    </div>
  );
}
