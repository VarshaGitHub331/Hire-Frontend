import styles from "./MainDashboard.module.css";
import moment from "moment";
import { useOutletContext } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
export default function MainDashboard() {
  const { profileData } = useOutletContext();
  const { userState } = useAuthContext();
  console.log(profileData);
  return (
    <>
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

      <div className={styles.highlight}>
        <p>One important thing...</p>
        <h3>Arlene is waiting for the draft contract</h3>
        <button className={styles.createBtn}>Create contract</button>
      </div>

      <div className={styles.status}>
        <p>
          <strong>Created:</strong>{" "}
          {profileData
            ? moment(profileData.UserDetails.created_at).format("MMMM D, YYYY")
            : "N/A"}
        </p>
        <p>
          <strong>Last updated:</strong>{" "}
          {moment(profileData?.UserDetails.updated_at).format("MMMM D, YYYY")}
        </p>
      </div>
    </>
  );
}
