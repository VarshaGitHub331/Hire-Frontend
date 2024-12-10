import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { getCategories } from "../../apis/Categories";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { decreaseStep } from "../../redux/modalSlice";
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Number of categories to display at a time

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  const { UserLogout, userState } = useAuthContext();

  function handleLogout() {
    UserLogout();
    dispatch(decreaseStep());
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
    <div
      className={`${styles.navbar} ${
        active || pathname !== "/" ? styles.activeNavbar : ""
      }`}
    >
      <div className={styles.container}>
        <Link to="/">
          <div className={styles.logo}>
            <span className={styles.text}>Hire</span>
            <span className={styles.dot}>.</span>
          </div>
        </Link>
        <div className={styles.links}>
          <span>Hire Business</span>
          <span>Explore</span>
          <span>English</span>
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
                    <span onClick={() => setOpenJoin(false)}>
                      Join As A Client
                    </span>
                  </Link>
                  <Link to="/signUp?role=client">
                    <span onClick={() => setOpenJoin(false)}>
                      Become A Buyer
                    </span>
                  </Link>
                </div>
              )}
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
                      <Link to="/gigs">
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
                  <Link to="/messages">
                    <div>Messages</div>
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
    </div>
  );
}

export default Navbar;
