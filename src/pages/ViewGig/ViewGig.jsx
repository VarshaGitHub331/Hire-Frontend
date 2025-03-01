import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ViewGig.module.css";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Standard from "./Standard";
import OrderModel from "./OrderModule";
import Advanced from "./Advanced";
import { FaStar } from "react-icons/fa";
export default function ViewGig() {
  const location = useLocation();
  const [gig, setGig] = useState(location.state?.gig);
  const url = process.env.REACT_APP_SERVER_URL;
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const { userState } = useAuthContext();
  const user_id = userState.user_id;
  const role = userState.role;
  const navigate = useNavigate();
  const handleChat = () => {
    navigate("/chat", {
      state: { buyerId: user_id, sellerId: gig.freelancer_id },
    });
  };
  const [openOrder, setOpenOrder] = useState(false);
  const StarRating = ({ rating }) => (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          color={index < rating ? "#eecc0f" : "#e0e0e0"}
          size={10}
        />
      ))}
    </div>
  );
  return (
    <>
      <div className={styles.titlePart}>
        <div className={styles.direction}>
          <Link to="/">HIRE</Link> &gt; <Link to="/viewAllGigs">All Gigs</Link>{" "}
          &gt;&gt; {gig.category_name}
        </div>
      </div>
      <div className={styles.viewGigContainer}>
        <div
          className={styles.ViewGig}
          onClick={(e) => {
            setShowDescriptionPopup(true);
          }}
        >
          <div className={styles.gigCard}>
            <div className={styles.gigImage}>
              <img src={gig.picture[0]} alt="gigImage" />
            </div>
            <div className={styles.creator}>
              <div>{gig.freelancer_name}</div>
              <StarRating rating={parseInt(gig.freelancer_rating)} />
            </div>
            <div className={styles.gigCategories}>
              Category:
              <div className={styles.catTag}>{gig.category_name}</div>
            </div>

            <div className={styles.gigCategories}>
              Skills:
              {gig.skills_names?.split(",").map((skill, index) => (
                <div key={index} className={styles.catTag}>
                  {skill}
                </div>
              ))}
            </div>
            {role == "client" && (
              <div className={styles.bottom}>
                <div className={styles.featureTitle}>&#8377; {gig.budget}</div>
                <div
                  className={styles.settings}
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <div
                    className={styles.editTag}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenOrder(true);
                    }}
                  >
                    Order
                  </div>
                  <div
                    className={styles.editTag}
                    onClick={(e) => {
                      e.stopPropagation();
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
                <div className={styles.featureTitle}>Basic Features</div>
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
              </div>
              {gig?.standard_budget != 0 && <Standard gig={gig} />}
              {gig?.advanced_budget != 0 && <Advanced gig={gig} />}
            </div>
          </div>
        </div>
        <OrderModel
          openOrder={openOrder}
          setOpenOrder={setOpenOrder}
          gig={gig}
        />
        {showDescriptionPopup == true && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <p>{gig.description}</p>
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDescriptionPopup(false);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
