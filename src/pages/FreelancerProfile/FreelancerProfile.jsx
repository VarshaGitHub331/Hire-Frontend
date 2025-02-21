import styles from "./FreelancerProfile.module.css";
import GigsSection from "./GigsSection";
import Reviews from "./Reviews";
import { useLocation } from "react-router-dom";
import { fetchFreelancerProfile } from "../../apis/User";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
function FreelancerProfile() {
  const location = useLocation();
  const { userState } = useAuthContext();
  const user_id = location?.state?.user_id;
  const {
    data: freelancerProfileSection,
    isLoading: isLoadingFreelancerProfile,
  } = useQuery({
    queryFn: () => fetchFreelancerProfile({ user_id }), // Use location state user_id
    queryKey: ["freelancerProfileSection", user_id], // Include user_id in queryKey
    enabled: !!user_id, // Only run query if user_id is present
  });

  return (
    <>
      {isLoadingFreelancerProfile && <div>Loading...</div>}
      {freelancerProfileSection && (
        <div className={styles.FreelancerProfileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage}></div>
            <div className={styles.profileInfo}>
              <h5 className={styles.profileName}>
                {freelancerProfileSection?.User?.first_name}{" "}
                {freelancerProfileSection?.User?.last_name}
              </h5>
              <div className={styles.ratingContainer}>
                <span className={styles.topRated}>Top Rated</span>
                <span>★ {freelancerProfileSection.Freelancer_Rating}</span>
              </div>
            </div>
          </div>
          <div className={styles.about}>
            <h5>About me</h5>
            <p>{freelancerProfileSection?.profile}</p>
          </div>
          <div className={styles.skills}>
            <h5>Skills</h5>
            <div className={styles.skillsList}>
              {freelancerProfileSection?.User?.Freelancer_Skills?.map(
                (freelancerSkill) => (
                  <span key={freelancerSkill?.id} className={styles.skillTag}>
                    {freelancerSkill?.Skill?.skill_name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <GigsSection user_id={user_id} />
      <Reviews />
    </>
  );
}

export default FreelancerProfile;
