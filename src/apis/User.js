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

export {
  getUserProfile,
  updateUserProfile,
  editEmailProfile,
  updateFreelancerProfile,
};
