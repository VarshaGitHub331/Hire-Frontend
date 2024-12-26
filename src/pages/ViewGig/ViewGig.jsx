import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ViewGig.module.css";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCategories } from "../../apis/Categories";
import { getSkills } from "../../apis/Skills";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Standard from "./Standard";
import Advanced from "./Advanced";
export default function ViewGig() {
  const location = useLocation();
  const [gig, setGig] = useState(location.state?.gig);
  const url = process.env.REACT_APP_SERVER_URL;
  const { userState } = useAuthContext();
  const user_id = userState.user_id;
  const role = userState.user_id;
  const navigate = useNavigate();
  const handleChat = () => {
    navigate("/chat", {
      state: { buyerId: user_id, sellerId: gig.freelancer_id },
    });
  };
  return (
    <>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          <Link to="/">HIRE</Link> &gt; <Link to="/viewAllGigs">All Gigs</Link>{" "}
          &gt;&gt; {gig.category_name}
        </div>
      </div>
      <div className={styles.ViewGig}>
        <div className={styles.gigCard}>
          <div className={styles.gigImage}>
            <img src={gig.picture[0]} alt="gigImage" />
          </div>
          <div className={styles.creator}>
            <div>{gig.freelancer_name}</div>
            <div>⭐ {gig.freelancer_rating}</div>
          </div>
          <div className={styles.gigTitle}>{gig.title}</div>

          <div className={styles.gigCategories}>
            Category:
            <div className={styles.catTag}>{gig.category_name}</div>
          </div>

          <div className={styles.gigCategories}>
            Skills:
            {gig.skills_names.split(",").map((skill, index) => (
              <div key={index} className={styles.catTag}>
                {skill}
              </div>
            ))}
          </div>
          {role == "client" && (
            <div className={styles.bottom}>
              <div
                className={styles.settings}
                style={{ display: "flex", gap: "1rem" }}
              >
                <div className={styles.editTag} onClick={(e) => {}}>
                  Order
                </div>
                <div
                  className={styles.deleteTag}
                  onClick={(e) => {
                    handleChat();
                  }}
                >
                  Chat
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <div>
            <div className={styles.features}>
              <div className={styles.featureTitle}>Description</div>
              <div className={styles.description}>{gig.description}</div>
              <div className={styles.featureTitle}>Features</div>
              <div className={styles.featureList}>
                {gig.features.map((feature) => (
                  <div>
                    <span
                      style={{
                        color: "green",
                        fontSize: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      ✔
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
              <div className={styles.featureTitle}>
                Budget :&nbsp;&#8377; {gig.budget}
              </div>
            </div>
            {gig.standard_features != null ||
              (gig.standard_features != undefined && <Standard gig={gig} />)}
            {gig.advanced_features != null ||
              (gig.standard_features != undefined && <Advanced gig={gig} />)}
          </div>
        </div>
      </div>
    </>
  );
}
