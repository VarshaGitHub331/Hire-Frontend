import styles from "./MyProfile.module.css";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile } from "../../apis/User";
import moment from "moment";
const ProfilePage = () => {
  const { userState } = useAuthContext();
  const { user_id, role } = userState;

  // Fetch user profile data using React Query
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", user_id], // Query key should include user_id
    queryFn: () => getUserProfile({ user_id, role }), // Query function that fetches profile data
    enabled: !!user_id, // Ensures query only runs if user_id is available
  });

  // If data is loading or there was an error, show loading or error message
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching profile data.</p>;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <img
          className={styles.profileImg}
          src={profileData?.profileImage || "https://via.placeholder.com/100"}
          alt="Profile"
        />
        <h3 className={styles.name}>
          {profileData?.UserDetails.first_name +
            " " +
            profileData?.UserDetails.last_name || "Arlene McCoy"}
        </h3>
        <ul className={styles.details}>
          <li>
            <strong>Role:</strong> {role}
          </li>
          <li>
            <strong>Work e-mail:</strong>{" "}
            {profileData?.UserDetails.email || "amccoy@virtuslab.com"}
            <i
              class="fas fa-pen"
              style={{ marginLeft: "2%", cursor: "pointer" }}
            ></i>
          </li>
          <li>
            <strong>Linkedin:</strong>{" "}
            {profileData?.FreelancerDetails?.linkedin || "Add..."}
            <i
              class="fas fa-pen"
              style={{ marginLeft: "2%", cursor: "pointer" }}
            ></i>
          </li>
          <li>
            <strong>Resume:</strong>{" "}
            {profileData?.FreelancerDetails?.resume || "Add..."}
            <i
              class="fas fa-pen"
              style={{ marginLeft: "2%", cursor: "pointer" }}
            ></i>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Tabs */}
        <nav className={styles.tabs}>
          <a href="#">Overview</a>
          <a href="#">Activity</a>
        </nav>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <h4>{profileData?.completedOrders}</h4>
            <p>orders completed</p>
          </div>
          <div className={styles.stat}>
            <h4>{profileData?.progressingOrder}</h4>
            <p>orders pending</p>
          </div>
        </div>

        {/* Highlighted Section */}
        <div className={styles.highlight}>
          <p>One important thing...</p>
          <h3>Arlene is waiting for the draft contract</h3>
          <button className={styles.createBtn}>Create contract</button>
        </div>

        {/* Status Section */}
        <div className={styles.status}>
          <p>
            <strong>Created:</strong>
            {profileData
              ? moment(profileData.UserDetails.created_at).format(
                  "MMMM D, YYYY"
                )
              : "N/A"}
          </p>
          <p>
            <strong>Last updated:</strong>{" "}
            {moment(profileData?.UserDetails.updated_at).format("MMMM D, YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
