import styles from "./AddSecond.module.css";
import { useState } from "react";
import axios from "axios";
export default function Advanced({ values, setFieldValue }) {
  console.log(values.standardFeatures);
  const [features, setFeatures] = useState(values.advancedFeatures);
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
        setFieldValue("advancedFeatures", [
          ...values.advancedFeatures,
          featureInput.trim(),
        ]);
      } else {
        console.error(e);
      }
    }
  };
  const removeFeature = (index) => {
    setFeatures((features) => features.filter((_, i) => i !== index));
    setFieldValue(
      "advancedFeatures",
      values.advancedFeatures?.filter((_, i) => i != index)
    );
  };
  const useAI = async () => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/gigs/aiFeatures`,
        {
          level: "advanced",
          basic_features: values.features,
          standard_features: values.standardFeatures,
          title: values.title,
        }
      );
      setFeatures((features) => result.data.features);
      setFieldValue("advancedFeatures", result.data.features);
      console.log(result.data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className={styles.features}>
      <div
        style={{
          marginLeft: "1rem",
          width: "100%",
          fontWeight: "500",
          display: "flex",
        }}
      >
        Add Features For Your Package :
        <button
          type="button"
          className={styles.useAI}
          onClick={(e) => {
            useAI();
          }}
        >
          Use AI
        </button>
      </div>
      <ul>
        {features?.map((feature, index) => (
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
      {features?.length < 3 && (
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
