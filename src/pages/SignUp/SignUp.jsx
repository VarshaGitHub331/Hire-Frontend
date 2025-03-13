import styles from "./SignUp.module.css";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Import jwt-decode to decode the JWT token
import { useSearchParams, useNavigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import ProfileModal from "./ProfileModal";
import FileModal from "./FileModal";
import toast from "react-hot-toast";
import CategoryModal from "./SelectCategories";
import SkillModal from "./SelectSkills";
import BudgetLinkedinModal from "./BudgetLinkedin";
import {
  openCategoryModal,
  openFileModal,
  increaseStep,
} from "../../redux/modalSlice";
import { openProfileModal } from "../../redux/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../../App.js";
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const server = process.env.REACT_APP_SERVER_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const { UserLogin, UserLogout, userState } = useAuthContext();
  const step = useSelector((store) => store.modal.step);
  const { user_id, token } = userState;
  const [budgetLinkedin, setBudgetLinkedin] = useState(false);
  const navigate = useNavigate();
  const resumeUrl = useSelector((store) => store.signUpDetails.resumeUrl);
  const profile = useSelector((store) => store.signUpDetails.profile);
  const [signingUp, setSigningUp] = useState(false);
  const [profilingAI, setProfilingAI] = useState(false);
  function toggleBudgetLinkedin() {
    setBudgetLinkedin(!budgetLinkedin);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    });
    console.error(e);
    const role = searchParams.get("role");
    try {
      setSigningUp(true);
      const res = await axios.post(
        `${server}/user/createAccount`,
        { email, first_name: firstName, last_name: lastName, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSigningUp(false);
      console.log("The result is");
      console.log(res);
      const token = res.data;
      localStorage.setItem("authToken", token);
      const decoded_data = jwtDecode(token);
      const currentUser = {
        user_name: decoded_data.user_name,
        user_id: decoded_data.user_id,
        role: decoded_data.role,
        token: token,
      };
      UserLogin(currentUser);
      console.log(userState);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      localStorage.setItem("name", currentUser.user_name);
      localStorage.setItem("role", currentUser.role);
      localStorage.setItem("user_id", currentUser.user_id);
      localStorage.setItem("token", currentUser.token);
      socket.emit("register", currentUser.user_id);
      if (role == "client") navigate("/clientIntro");
      dispatch(increaseStep());
    } catch (e) {
      toast.error("Some issue signing up");
      setSigningUp(false);
      console.error(e);
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    // Decode the JWT token to extract user information
    // Handle the user information after successful login
  };

  const handleGoogleError = (error) => {
    console.error("Login Failed:", error);
  };

  const handleProfileClick = async (e) => {
    try {
      const res = await axios.post(
        `${server}/freelancer/updateProfile`,
        {
          resume_url: !resumeUrl ? "" : resumeUrl,
          profile: !profile ? "" : profile,
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("You details have been saved", {
        duration: 3000,
      });
      dispatch(increaseStep());
    } catch (e) {
      console.error(e);
    }
  };
  const profileWithAI = async (e) => {
    try {
      setProfilingAI(true);
      const finishProfiling = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/freelancer/profileUserWithAI`,
        {
          user_id: userState.user_id,
        },
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${userState.token}`,
          },
        }
      );
      console.log(finishProfiling);
      navigate("/myFreelancerProfile");
      setProfilingAI(false);
    } catch (e) {
      console.error(e);
      setProfilingAI(false);
    }
  };
  const dispatch = useDispatch();
  return (
    <>
      {step === 1 && (
        <div className={styles.SignUp}>
          <h4>Join Hire.</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className={styles.button}
              disabled={signingUp}
            >
              {!signingUp ? "Join Hire." : "Signing Up"}
            </button>
          </form>
          <div className={styles.or}>or</div>{" "}
          {/* Optional: To separate the buttons visually */}
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleError}
            clientId={process.env.REACT_APP_CLIENT_ID}
            scope="profile email" // Add the desired scopes here
          />
        </div>
      )}
      {step === 2 && userState.role === "freelancer" && (
        <div className={styles.about}>
          <div className={styles.intro}>
            How would you like to tell us about yourself?
          </div>
          <div className={styles.desc}>
            We need to get a sense of your education, experience and skills.
            It’s quickest to import your information — you can edit it before
            your profile goes live.
          </div>
          <div className={styles.resume}>
            <div
              className={styles.chooseGreen}
              onClick={(e) => {
                dispatch(openFileModal());
              }}
            >
              Upload Your Resume
            </div>
            <div
              className={styles.chooseGreen}
              onClick={(e) => {
                dispatch(openProfileModal());
              }}
            >
              Fill Out Manually (15 min)
            </div>
          </div>

          <button className={styles.back}>Back</button>
          {(resumeUrl || profile) && step === 2 && (
            <button
              className={styles.continue}
              onClick={(e) => {
                handleProfileClick(e);
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}
      {step === 3 && userState.role === "freelancer" && (
        <div className={styles.about}>
          <div className={styles.intro}>
            How would you like to profile yourself?
          </div>

          <div className={styles.resume}>
            <div
              className={styles.chooseGreen}
              onClick={(e) => {
                dispatch(openCategoryModal());
                navigate("/signUp/selectCategory");
              }}
            >
              Profile Your Manually(10 mins)
            </div>
            <div
              className={styles.chooseGreen}
              onClick={(e) => {
                profileWithAI(e);
              }}
            >
              {!profilingAI ? "Use AI" : "Profiling You.."}
            </div>
          </div>

          <button
            onClick={(e) => {
              navigate("/");
            }}
            className={styles.skip}
          >
            Skip
          </button>
        </div>
      )}
      <FileModal />
      <ProfileModal />
      <Outlet />
    </>
  );
}
