import styles from "./ClientProfile.module.css";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { getUserProfile, updateClientProfile } from "../../apis/User";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera, FaPen, FaCheck } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const ProfilePage = () => {
  const { userState } = useAuthContext();
  const { user_id, role, token } = userState;
  const navigate = useNavigate();
  const [editEmail, setEditEmail] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editCompanyNo, setEditCompanyNo] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
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
    queryFn: () => getUserProfile({ user_id, role, token }),
    enabled: !!user_id,
  });

  useEffect(() => {
    if (profileData) {
      setEditEmail(profileData?.UserDetails?.email || "");
      setEditCompany(profileData?.clientDetails?.company_name || "");
      setEditCompanyNo(profileData?.clientDetails?.contact_number || "");
      setEditContactEmail(profileData?.clientDetails?.contact_email || "");
      setProfilePreview(
        profileData?.UserDetails?.profilePic ||
          "https://via.placeholder.com/100"
      );
    }
  }, [profileData]);

  const updateEmailMutation = useMutation({
    mutationFn: () =>
      updateClientProfile({ user_id, key: "email", value: editEmail ,token}),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      setEditingField(null);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ key, value }) =>
      updateClientProfile({ user_id, key, value, token }),
    onSuccess: () => {
      refetch();
      setEditingField(null);
    },
  });

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
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
          <img
            className={styles.profileImg}
            src={profilePreview}
            alt="Profile"
          />
          <label htmlFor="profile-upload" className={styles.cameraIcon}>
            <FaCamera />
          </label>
          <input
            id="profile-upload"
            type="file"
            onChange={handleProfileChange}
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
            <strong>Company:</strong>
            {editingField === "company_name" ? (
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
              />
            ) : (
              editCompany
            )}
            <i
              onClick={() =>
                editingField === "company_name"
                  ? updateClientMutation.mutate({
                      key: "company_name",
                      value: editCompany,
                    })
                  : setEditingField("company_name")
              }
            >
              {editingField === "company_name" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
          <li>
            <strong>Phone:</strong>
            {editingField === "contact_number" ? (
              <input
                type="number"
                value={editCompanyNo}
                onChange={(e) => setEditCompanyNo(e.target.value)}
              />
            ) : (
              editCompanyNo
            )}
            <i
              onClick={() =>
                editingField === "contact_number"
                  ? updateClientMutation.mutate({
                      key: "contact_number",
                      value: editCompanyNo,
                    })
                  : setEditingField("contact_number")
              }
            >
              {editingField === "contact_number" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
          <li>
            <strong>Contact Email:</strong>
            {editingField === "contact_email" ? (
              <input
                type="email"
                value={editContactEmail}
                onChange={(e) => setEditContactEmail(e.target.value)}
              />
            ) : (
              editContactEmail
            )}
            <i
              onClick={() =>
                editingField === "contact_email"
                  ? updateClientMutation.mutate({
                      key: "contact_email",
                      value: editContactEmail,
                    })
                  : setEditingField("contact_email")
              }
            >
              {editingField === "contact_email" ? <FaCheck /> : <FaPen />}
            </i>
          </li>
        </ul>
      </div>
      <div className={styles.mainContent}>
        <nav className={styles.tabs}>
          <a onClick={() => navigate("ratings")}>Ratings</a>
          <a onClick={() => navigate("orders")}>Orders</a>
        </nav>

        {profileData && <Outlet context={{ profileData, refetch }} />}
      </div>
    </div>
  );
};

export default ProfilePage;
