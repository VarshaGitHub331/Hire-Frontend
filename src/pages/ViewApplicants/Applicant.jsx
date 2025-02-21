import React from "react";
import styles from "./Applicant.module.css"; // Import CSS module
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const ApplicantModal = ({ applicant, onClose }) => {
  const navigate = useNavigate();
  if (!applicant) return null;
  const { userState } = useAuthContext();
  const user_id = userState.user_id;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <button
          className={styles.chatTag}
          onClick={(e) => {
            navigate("/chat", {
              state: {
                buyerId: user_id,
                sellerId: applicant.Freelancer.user_id,
              },
            });
          }}
        >
          💬 Chat
        </button>
        <button
          className={styles.profileTag}
          onClick={(e) => {
            navigate("/freelancerProfile", {
              state: {
                user_id: applicant.Freelancer.user_id,
              },
            });
          }}
        >
          Profile
        </button>
        {/* Profile Section */}
        <div className={styles.profileContainer}>
          <div className={styles.profilePic}>
            <img
              src={
                applicant.Freelancer.User.profile_image || "/assets/Logo.webp"
              }
              alt="Profile"
            />
          </div>

          <h2>
            {applicant.Freelancer.User.first_name}{" "}
            {applicant.Freelancer.User.last_name}
          </h2>
          <p>{applicant.Freelancer.User.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;
