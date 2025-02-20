import styles from "./FreelancerProfile.module.css";
import GigsSection from "./GigsSection";
import Reviews from "./Reviews";
function FreelancerProfile() {
  return (
    <>
      <div className={styles.FreelancerProfileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImage}></div>
          <div className={styles.profileInfo}>
            <h5 className={styles.profileName}>Sumit S</h5>
            <span className={styles.topRated}>Top Rated</span>
            <p className={styles.profileDescription}>
              Helping entrepreneurs and businesses achieve stunning user
              experiences
            </p>
          </div>
        </div>
        <div className={styles.about}>
          <h5>About me</h5>
          <p>
            We are a team of experts in building Stunning User experiences...
          </p>
        </div>
        <div className={styles.skills}>
          <h5>Skills</h5>
          <div className={styles.skillsList}>
            <span className={styles.skillTag}>Website developer</span>
            <span className={styles.skillTag}>React expert</span>
            <span className={styles.skillTag}>JavaScript developer</span>
          </div>
        </div>
      </div>
      <GigsSection />
      <Reviews />
    </>
  );
}

export default FreelancerProfile;
