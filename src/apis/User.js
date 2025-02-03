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
export { getUserProfile, updateUserProfile };
