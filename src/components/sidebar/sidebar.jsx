import { useState } from "react";
import styles from "./sidebar.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
export default function SideBar({ handleLogout, setOpenSideBar }) {
  const { userState } = useAuthContext();
  console.log(userState);
  return (
    <div className={styles.sideBar}>
      <div className={styles.user}>
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
          <img src="/assets/Logo.webp" alt="" className={styles.Img} />
          <i
            className="fa fa-window-close"
            style={{
              fontSize: "2.5vw",
              position: "absolute",
              right: "0.2%",
              marginTop: "2vh",
            }}
            onClick={(e) => setOpenSideBar(false)}
          ></i>
        </div>
        <div style={{ marginLeft: "0.5rem" }}>{userState?.name}</div>
      </div>
      <div className={styles.options}>
        {userState.role == "freelancer" && (
          <>
            <Link to="/myGigs">
              <div>Your Gigs</div>
            </Link>
            <Link to="/add">
              <div>Add A Gig</div>
            </Link>
            <Link>
              <div>Popular Skills</div>
            </Link>
          </>
        )}
        <Link to="/orders">
          <div>Orders</div>
        </Link>
        <Link to="/chat">
          <div>Messages</div>
        </Link>
        <Link to="/viewAllGigs">
          <div>All Gigs</div>
        </Link>
        <div onClick={handleLogout} style={{ cursor: "pointer" }}>
          Logout
        </div>
      </div>
    </div>
  );
}
