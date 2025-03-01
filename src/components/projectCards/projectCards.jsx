import styles from "./projectCards.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function ProjectCard({ item }) {
  const navigate = useNavigate();
  console.log(item);
  console.log("Hi");
  return (
    <div
      style={{ marginTop: "2vh", cursor: "pointer" }}
      onClick={(e) => {
        navigate(`/viewAllGigs?category=${item.category_name}`);
      }}
    >
      <div className={styles.catcard}>
        <div className={styles.Project}>
          <img
            src={item?.gigImage || "/path/to/default_image.jpg"} // Fallback image if item.img is undefined
            alt=""
            className={styles.Image}
          />
        </div>
        <div className={styles.foot}>
          <img
            src={item?.profile_pic || "/path/to/default_profile_image.jpg"} // Fallback profile image
            alt="profile"
            className={styles.profile}
          />

          <div className={styles.details}>
            <div className={styles.cat}>
              {item?.category_name || "Category"}
            </div>
            <div className={styles.username}>
              {item?.freelancer_name || "Username"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
