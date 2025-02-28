import styles from "./AddSecond.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
export default function Standard({ values, setFieldValue }) {
  const gigTitle = useSelector((store) => store.gig.gigTitle);
  console.log(values);
  const [features, setFeatures] = useState(values.standardFeatures);
  const [featureInput, setFeatureInput] = useState("");
  const { userState } = useAuthContext();
  const useAI = async () => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/gigs/aiFeatures`,
        {
          level: "standard",
          basic_features: values.features,
          title: values.title,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userState.token}`,
          },
        }
      );
      console.log(result.data.features);

      setFeatures((features) => result.data.features);
      setFieldValue("standardFeatures", result.data.features);
    } catch (e) {
      console.error(e);
    }
  };
  const handleKeyPress = (event, values, setFieldValue) => {
    if (event.key === "Enter" && featureInput.trim()) {
      event.preventDefault();

      if (features.length < 3) {
        // Add the new feature to the state
        const newFeatures = [...features, featureInput.trim()];
        setFeatures(newFeatures);
        setFeatureInput("");

        // Update the Formik field 'features' based on the new length
        setFieldValue("standardFeatures", [
          ...values.standardFeatures,
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
      "standardFeatures",
      values.standardFeatures?.filter((_, i) => i != index)
    );
  };

  return (
    <div className={styles.features}>
      <div className={styles.featureHeader}>
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
