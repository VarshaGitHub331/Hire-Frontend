import axios from "axios";
async function getUserProfile({ user_id, role }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/user/fetchProfile`,
      {
        params: {
          user_id,
          role,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function updateUserProfile() {
  console.log("updateind profile");
}
async function editEmailProfile({ value, user_id }) {
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/user/updateUserProfile`,
    {
      email: value,
      user_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
async function updateFreelancerProfile({ user_id, key, value }) {
  console.log(key, value);
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/freelancer/updateProfile`,
    {
      [key]: value,
      user_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
async function updateClientProfile({ user_id, key, value, token }) {
  console.log(key, value);
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/client/updateProfile`,
    {
      [key]: value,
      user_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
async function fetchFreelancerProfile({ user_id }) {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/freelancer/fetchFreelancerProfile`,
    {
      params: {
        user_id,
      },
    }
  );
  console.log(response.data);
  return response.data.UserProfile;
}
export {
  getUserProfile,
  updateUserProfile,
  editEmailProfile,
  updateFreelancerProfile,
  updateClientProfile,
  fetchFreelancerProfile,
};
