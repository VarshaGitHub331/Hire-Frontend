import styles from "./featured.module.css";
import { useQuery } from "@tanstack/react-query";
import { getPopularCategories } from "../../apis/Skills.js";
import { useNavigate } from "react-router-dom";
export default function Featured() {
  const navigate = useNavigate();
  const { data: popularCategories, isLoading } = useQuery({
    queryFn: () => getPopularCategories(),
    queryKey: ["popularCategories"],
  });
  return (
    <div className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.right}>
          <img
            src="/assets/man.png"
            alt="person"
            width="350px"
            height="370px"
          />
        </div>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Find the perfect Freelancer Services for your business
          </h1>
          <div className={styles.search}>
            <div className={styles.searchInput}>
              <img
                src="/assets/sicon.png"
                alt="question"
                width="30px"
                height="30px"
              />
              <input type="text" placeholder="Find Your Services" />
            </div>
            <button>Search</button>
          </div>
          <div className={styles.popular}>
            {popularCategories?.map((popularCategory) => (
              <button
                onClick={(e) => {
                  navigate(
                    `/viewAllGigs?category=${popularCategory?.Category?.category_name}`
                  );
                }}
              >
                {popularCategory?.Category?.category_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
