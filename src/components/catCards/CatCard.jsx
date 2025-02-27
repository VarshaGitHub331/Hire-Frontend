import styles from "./CatCard.module.css";
import { useNavigate } from "react-router-dom";
export default function CatCard({ item }) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.catcard}
      onClick={(e) => {
        navigate(`/viewAllGigs?category=${item.category_name}`);
      }}
    >
      <img src={item?.gigImage} alt="" className={styles.Image}></img>

      <span className={styles.title}>{item?.category_name}</span>
    </div>
  );
}
