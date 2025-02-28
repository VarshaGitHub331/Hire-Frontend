import styles from "./MyProfile.module.css";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  getUserProfile,
  editEmailProfile,
  updateFreelancerProfile,
} from "../../apis/User";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera, FaPen, FaCheck } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const { userState } = useAuthContext();
  const { user_id, role, token } = userState;
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [editEmail, setEditEmail] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editResume, setEditResume] = useState(null);
  const [editCost, setEditCost] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user_id],
    queryFn: () => getUserProfile({ user_id, role }),
    enabled: !!user_id,
  });

  useEffect(() => {
    if (profileData) {
      setEditEmail(profileData?.UserDetails?.email || "");
      setEditLinkedin(profileData?.FrelancerDetails?.linkedin || "");
      setResumePreview(profileData?.FrelancerDetails?.resume || "");
      setEditCost(profileData?.FrelancerDetails?.cost || "");
      setProfilePreview(
        profileData?.UserDetails?.profilePic ||
          "https://via.placeholder.com/100"
      );
    }
  }, [profileData]);

  const updateEmailMutation = useMutation({
    mutationFn: () => editEmailProfile({ user_id, value: editEmail, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      setEditingField(null);
    },
  });

  const updateFreelancerMutation = useMutation({
    mutationFn: ({ key, value }) =>
      updateFreelancerProfile({ user_id, key, value, token }),
    onSuccess: () => {
      refetch();
      setEditingField(null);
    },
  });

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditResume(file);
      setResumePreview(URL.createObjectURL(file));
    }
  };
  const handleSaveResumeUpload = async () => {
    if (!editResume) return;
    const formData = new FormData();
    formData.append("resume", editResume);
    formData.append("user_id", user_id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/freelancer/uploadResume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        refetch(); // Refresh profile data
        setEditingField(null);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage((profileImage) => file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append("picture", profileImage);
    formData.append("user_id", user_id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/uploadPicture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        refetch();
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    handleUploadProfileImage();
  }, [profileImage]);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching profile data.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.profileImageContainer}>
          <img className={styles.profileImg} src={profilePreview} />
          <label htmlFor="profile-upload" className={styles.cameraIcon}>
            <FaCamera />
          </label>
          <input
            id="profile-upload"
            type="file"
            onChange={(e) => handleProfileChange(e)}
            className={styles.hiddenInput}
          />
        </div>
        <h3 className={styles.name}>
          {profileData?.UserDetails?.first_name}{" "}
          {profileData?.UserDetails?.last_name}
        </h3>
        <ul className={styles.details}>
          <li>
            <strong>Mail:</strong>
            {editingField === "email" ? (
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            ) : (
              editEmail
            )}
            <i
              onClick={() =>
                editingField === "email"
                  ? updateEmailMutation.mutate()
                  : setEditingField("email")
              }
            >
              {editingField === "email" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
          <li>
            <strong>LinkedIn:</strong>
            {editingField === "linkedin" ? (
              <input
                type="text"
                value={editLinkedin}
                onChange={(e) => setEditLinkedin(e.target.value)}
              />
            ) : (
              editLinkedin
            )}
            <i
              onClick={() =>
                editingField === "linkedin"
                  ? updateFreelancerMutation.mutate({
                      key: "linkedin",
                      value: editLinkedin,
                    })
                  : setEditingField("linkedin")
              }
            >
              {editingField === "linkedin" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
          <li>
            <strong>Resume:</strong>
            {editingField === "resume" ? (
              <>
                <input type="file" onChange={handleResumeChange} />
                {editResume && (
                  <a
                    href={resumePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview Resume
                  </a>
                )}
              </>
            ) : (
              <a href={resumePreview} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            )}
            <i
              onClick={() =>
                editingField === "resume"
                  ? handleSaveResumeUpload()
                  : setEditingField("resume")
              }
            >
              {editingField === "resume" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
          <li>
            <strong>Budget:</strong>
            {editingField === "cost" ? (
              <input
                type="text"
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
              />
            ) : (
              editCost
            )}
            <i
              onClick={() =>
                editingField === "cost"
                  ? updateFreelancerMutation.mutate({
                      key: "cost",
                      value: editCost,
                    })
                  : setEditingField("cost")
              }
            >
              {editingField === "cost" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
        </ul>
      </div>
      <div className={styles.mainContent}>
        <nav className={styles.tabs}>
          <a onClick={(e) => navigate("/myFreelancerProfile")}>Overview</a>
          <a onClick={(e) => navigate("ratings")}>Ratings</a>
          <a onClick={(e) => navigate("orders")}>Orders</a>
          <a onClick={(e) => navigate("about")}>About</a>
        </nav>

        {profileData && <Outlet context={{ profileData, refetch }} />}
      </div>
    </div>
  );
};

export default ProfilePage;
