import React, { useState } from "react";
import styles from "./Progress.module.css";
import { useSelector, useDispatch } from "react-redux";
import ReactLoading from "react-loading";
import { setGigStep } from "../../redux/gigSlice";
function HorizontalProgressBar() {
  const totalSteps = 3;
  const dispatch = useDispatch();
  const gigState = useSelector((store) => store.gig);
  const [currentStep, setCurrentStep] = useState(gigState.step);
  console.log(gigState.step);
  const handleStepClick = (step) => {
    dispatch(setGigStep(step));
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
      <div className={styles.steps}>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`${styles.step} ${
              currentStep >= step ? styles.active : ""
            }`}
            onClick={() => handleStepClick(step)}
          >
            <div className={styles.circle}>{step}</div>
            <span className={styles.label}>Step {step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorizontalProgressBar;
