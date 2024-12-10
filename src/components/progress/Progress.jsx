import React, { useState } from "react";

function ProgressBar({ step, totalSteps }) {
  // Calculate the width percentage based on the current step
  const progress = (step / totalSteps) * 100;

  return (
    <div
      style={{
        width: "100%",
        height: "10px",
        backgroundColor: "#ddd",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#4caf50",
          borderRadius: "5px",
        }}
      />
    </div>
  );
}

export default ProgressBar;
