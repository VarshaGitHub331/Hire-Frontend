import styles from "./ViewGigs.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ClientIntro() {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(true);
  return (
    <>
      <div className={styles.about}>
        <div className={styles.intro}>How Can We Help You Finding Gigs?</div>
        <div className={styles.desc}>
          You can view all gigs or make use of an assistant.
        </div>
        <div className={styles.options}>
          <div
            className={styles.viewGigs}
            onClick={(e) => {
              navigate("/viewAllGigs");
            }}
          >
            View All Gigs
          </div>
          <div className={styles.createPosting}>Use An Assistant</div>
        </div>
      </div>
    </>
  );
}
