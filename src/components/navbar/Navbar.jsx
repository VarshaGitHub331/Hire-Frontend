import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { getCategories } from "../../apis/Categories";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { decreaseStep } from "../../redux/modalSlice";
import { resetGig } from "../../redux/gigSlice";
import { resetSignUp } from "../../redux/signUpDataSlice";
import { resetCompany } from "../../redux/companySlice";
import SideBar from "../sidebar/sidebar.jsx";
import styles from "./Navbar.module.css";

function Navbar() {
  const { data: categories, isLoading } = useQuery({
    queryFn: () => getCategories(),
    queryKey: ["categories"],
  });

  const [active, setActive] = useState(false);
  const [openOp, setOpenOp] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const dropdownRef = useRef(null);
  const joinRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2); // Number of categories to display at a time
  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };
  const { UserLogout, userState } = useAuthContext();
  useEffect(() => {
    const mediaQuerySmall = window.matchMedia("(max-width: 768px)");
    const mediaQueryMedium = window.matchMedia("(max-width: 1024px)");

    const updateItemsPerPage = () => {
      if (mediaQuerySmall.matches) {
        setItemsPerPage(1); // Mobile
      } else if (mediaQueryMedium.matches) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(3); // Desktop
      }
    };

    updateItemsPerPage(); // Set initial value
    mediaQuerySmall.addEventListener("change", updateItemsPerPage);
    mediaQueryMedium.addEventListener("change", updateItemsPerPage);

    return () => {
      mediaQuerySmall.removeEventListener("change", updateItemsPerPage);
      mediaQueryMedium.removeEventListener("change", updateItemsPerPage);
    };
  }, []);

  function handleLogout() {
    UserLogout();
    dispatch(decreaseStep());
    dispatch(resetGig());
    dispatch(resetSignUp());
    dispatch(resetCompany());
    navigate("/");
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, categories?.length - itemsPerPage)
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpenOp(false);
    });

    return () => {
      document.removeEventListener("click", (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target))
          setOpenOp(false);
      });
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (joinRef.current && !joinRef.current.contains(e.target))
        setOpenJoin(false);
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (joinRef.current && !joinRef.current.contains(e.target))
          setOpenJoin(false);
      });
    };
  }, []);

  const { pathname } = useLocation();

  return (
    <>
      <div
        className={`${styles.navbar} ${
          active || pathname !== "/" ? styles.activeNavbar : ""
        }`}
      >
        <div className={styles.container}>
          <Link to="/">
            <div className={styles.logo}>
              <span
                className={styles.text}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  navigate("/");
                }}
              >
                Hire
              </span>
              <span className={styles.dot}>.</span>
            </div>
          </Link>
          <div className={styles.links}>
            <span className={styles.general}>Hire Business</span>
            <span className={styles.general}>Explore</span>
            <span className={styles.general}>English</span>

            {!userState.name && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            )}

            {!userState.name && (
              <div ref={joinRef}>
                <button
                  className={styles.button}
                  onClick={() => setOpenJoin(true)}
                >
                  Join
                </button>
                {openJoin && (
                  <div className={styles.join}>
                    <Link to="/signUp?role=freelancer">
                      <span onClick={() => setOpenJoin(false)}>Freelancer</span>
                    </Link>
                    <Link to="/signUp?role=client">
                      <span onClick={() => setOpenJoin(false)}>Client</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {!openSideBar && userState?.name && (
              <div
                className={styles.hamburger}
                onClick={(e) => {
                  setOpenSideBar(true);
                }}
              >
                &#9776;
              </div>
            )}
            {userState.name && (
              <div className={styles.user}>
                <img src="/assets/Logo.webp" alt="" className={styles.Img} />
                <span
                  ref={dropdownRef}
                  onClick={() => setOpenOp((prevState) => !prevState)}
                >
                  {userState?.name}
                </span>

                {openOp && (
                  <div className={styles.options}>
                    {userState.role === "freelancer" && (
                      <>
                        <Link to="/myGigs">
                          <div>Your Gigs</div>
                        </Link>
                        <Link to="/add">
                          <div>Add A Gig</div>
                        </Link>
                        <Link to="/freelancerJobs">
                          <div>Jobs For You</div>
                        </Link>
                        <Link to="/myProposals">
                          <div>My Proposals</div>
                        </Link>
                      </>
                    )}
                    {userState.role === "client" && (
                      <>
                        <Link to="/clientJobs">
                          <div>View Postings</div>
                        </Link>
                        <Link to="/viewGigs">
                          <div>View Gigs</div>
                        </Link>
                        <Link to="/createJobPosting">
                          <div>Add Posting</div>
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
                    <Link
                      to={
                        userState.role == "freelancer"
                          ? "/myFreelancerProfile"
                          : "/myClientProfile"
                      }
                    >
                      <div>My Profile</div>
                    </Link>

                    <div onClick={handleLogout} style={{ cursor: "pointer" }}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <hr />
        {active && (
          <div className={styles.menuContainer}>
            {/* Previous Button */}
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>{" "}
              {/* FontAwesome left arrow */}
            </button>

            {/* Display Categories */}
            <div className={styles.menu}>
              {categories
                ?.slice(currentIndex, currentIndex + itemsPerPage)
                .map((category, index) => (
                  <Link className="link menuLink" key={index} to="/">
                    {category.category_name}
                  </Link>
                ))}
            </div>

            {/* Next Button */}
            <button
              className={styles.navButton}
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= categories?.length}
            >
              <i className="fas fa-chevron-right"></i>{" "}
              {/* FontAwesome right arrow */}
            </button>
          </div>
        )}
        {openSideBar && userState?.name && (
          <SideBar
            handleLogout={handleLogout}
            setOpenSideBar={setOpenSideBar}
          />
        )}
      </div>
    </>
  );
}

export default Navbar;
