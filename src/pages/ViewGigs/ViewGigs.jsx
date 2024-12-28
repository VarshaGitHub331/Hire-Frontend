import styles from "./ViewGigs.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

export default function ClientIntro() {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(true);
  const [project, setProject] = useState("");
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
              navigate("/viewAllGigs", { state: project });
            }}
          >
            View All Gigs
          </div>
          <div
            className={styles.createPosting}
            onClick={(e) => setDetailModal(true)}
          >
            Use An Assistant
          </div>
        </div>
      </div>
      <ProjectModal
        detailModal={detailModal}
        setDetailModal={setDetailModal}
        project={project}
        setProject={setProject}
      />
    </>
  );
}
function ProjectModal({ detailModal, setDetailModal, project, setProject }) {
  async function fetchTailoredGigs() {
    try {
    } catch (e) {
      console.log(e);
    }
  }
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={detailModal}
      onRequestClose={(e) => {
        setDetailModal(false);
      }}
      contentLabel="Upload Project Details"
      className={styles.box}
    >
      <h3>Brief Us About Your Project Requirements</h3>
      <button
        onClick={(e) => {
          setDetailModal(false);
          setProject("");
        }}
        className={styles.closeButton}
      >
        &times;
      </button>
      <div className={styles.uploadBox}>
        <textarea
          value={project}
          style={{
            width: "90%",
            height: "90%",
            backgroundColor: "inherit",
            outline: "none",
            border: "none",
            margin: "0.5rem",
          }}
          onChange={(e) => {
            setProject((project) => e.target.value);
          }}
        ></textarea>
      </div>

      <button
        className={styles.projectContinue}
        disabled={!project}
        onClick={(e) => {
          navigate("/viewAllGigs", { state: project });
        }}
      >
        Continue
      </button>
    </Modal>
  );
}
