import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./CreateProposal.module.css";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { useAuthContext } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { submitBid, getAIProposal } from "../../apis/Bid";
import { FaMagic } from "react-icons/fa";

const BidProposal = () => {
  const [bidAmount, setBidAmount] = useState(5000);
  const [timeline, setTimeline] = useState(1);
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // Track AI generation state
  const { userState, token } = useAuthContext();
  const location = useLocation();
  const job = location?.state?.job || {
    title: "Sample Job",
    min_budget: 5000,
    max_budget: 10000,
    job_type: "Full-time",
  };

  const mutation = useMutation({
    mutationFn: (bidContent) => {
      submitBid(bidContent);
    },
    onSuccess: () => {
      console.log("Proposal submitted");
    },
    onError: () => {
      console.log("Error in submitting");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bidAmount || !timeline || !proposal.trim()) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate({
      proposal,
      bidAmount,
      timeline,
      user_id: userState.user_id,
      job,
      token,
    });
    setError(""); // Clear error on valid input
  };

  const generateAIProposal = async () => {
    setIsGenerating(true); // Set state to true while AI is generating
    try {
      const AIProposal = await getAIProposal({
        user_id: userState.user_id,
        job,
        token,
      });
      setProposal(AIProposal.proposal);
    } catch (error) {
      console.error("Error generating AI proposal:", error);
      setError("Failed to generate AI proposal. Please try again.");
    }
    setIsGenerating(false); // Reset state after generation
  };

  return (
    <>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          <Link to="/">HIRE</Link> &gt;&gt; {"CREATE PROPOSAL"}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h5 className={styles.title}>{job.title}</h5>
          <p className={styles.budget}>
            Budget: ₹{job.min_budget} - ₹{job.max_budget}
          </p>
          <p className={styles.jobType}>Job Type: {job.job_type}</p>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <div className={styles.heading}>
                <label>Proposal</label>
              </div>
              <ReactQuill
                value={proposal}
                onChange={setProposal}
                className={styles.textEditor}
                placeholder="Write your proposal here..."
                spellCheck={false} // Disables spellcheck
              />
            </div>
            <div>
              <div className={styles.heading}>
                <label>Bid Amount (₹):</label>
                <span className={styles.amount}>₹{bidAmount}</span>
              </div>
              <input
                type="range"
                min={job.min_budget}
                max={job.max_budget}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className={styles.slider}
              />
            </div>
            <div>
              <div className={styles.heading}>
                <label>Estimated Completion Time (Days):</label>
                <span className={styles.timeline}>{timeline} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={styles.slider}
              />
            </div>

            <div className={styles.footButton}>
              <button
                type="button"
                className={styles.submitButton}
                onClick={generateAIProposal}
                disabled={isGenerating} // Disable button while generating
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <FaMagic className={styles.icon} /> Use AI
                  </>
                )}
              </button>
              <button type="submit" className={styles.submitButton}>
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BidProposal;
