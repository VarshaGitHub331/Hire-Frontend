import React from "react";
import { Formik, Form, Field, ErrorMessage, label } from "formik";
import { useFormikContext } from "formik";
import * as yup from "yup";
import styles from "./AddSecond.module.css";
import { useState, useEffect } from "react";
import ProgressBar from "../../components/progress/Progress";

import { useSelector, useDispatch } from "react-redux";
import {
  changeGigBudget,
  changeGigFeatures,
  increaseGigStep,
  decreaseGigStep,
} from "../../redux/gigSlice";

export default function Budget() {
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [featureType, setFeautureType] = useState("");
  const gigStoreBudget = useSelector((store) => store.gig.budget);
  const gigStoreFeatures = useSelector((store) => store.gig.features);
  const dispatch = useDispatch();

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
  useEffect(() => {
    if (features.length == 0) {
      setFeautureType("..How long will you take to complete your gig?");
    }
    if (features.length == 1) {
      setFeautureType("..How many revisions can the client request?");
    }
    if (features.length == 2) {
      setFeautureType("..Outline features in your package");
    }
  }, [features]);
  const onSubmit = (values, actions) => {
    dispatch(changeGigBudget(values.price));
    dispatch(changeGigFeatures(values.features));
    dispatch(increaseGigStep());
  };
  return (
    <>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          price: gigStoreBudget,
          features: gigStoreFeatures,
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div style={{ width: "45vw", margin: "auto", marginTop: "1rem" }}>
              <ProgressBar step={2} totalSteps={3} />
            </div>
            <div className={styles.budgetBox}>
              <h3>Basic Package</h3>
              <div className={styles.price}>
                <span>&#8377;</span>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  className={styles.priceAmount}
                />
              </div>
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
                        {index == 0
                          ? "Duration"
                          : index == 1
                          ? "Revisions"
                          : "Outline"}{" "}
                        : {feature}
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
                    placeholder={featureType}
                    className={styles.featureInput}
                  />
                )}
              </div>
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={styles.prevButton}
                  onClick={(e) => {
                    dispatch(decreaseGigStep());
                  }}
                >
                  Prev
                </button>
                <button
                  type="submit"
                  className={styles.next}
                  disabled={values.price === 0 || values.features.length <= 0}
                >
                  Next
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
