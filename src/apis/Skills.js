import axios from "axios";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

async function getSkills(categories, token) {
  console.log(categories);
  try {
    const result = await axios.get(
      `${BASE_URL}/data/fetchSkills`,

      {
        params: {
          categories,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result);
    return result.data;
  } catch (e) {}
}
async function getAllSkills(token) {
  try {
    const result = await axios.get(
      `${BASE_URL}/data/fetchAllSkills`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("All skills are ", result);
    return result.data.skills;
  } catch (e) {}
}
async function getRecommendedCategories(extractText, token) {
  try {
    const result = await axios.post(
      `${BASE_URL}/freelancer/recommendCategories`,
      {
        extractText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(result.data.categories); // For debugging purposes

    return result.data.categories;
  } catch (error) {
    console.error("Error fetching recommended categories:", error); // Log the error for debugging
    return []; // Return an empty array as a fallback
  }
}
async function getPopularCategories() {
  try {
    const result = await axios.get(`${BASE_URL}/data/fetchPopularCategories`);
    console.log(result.data);
    return result.data;
  } catch (e) {
    console.error("Error fetching popular categories");
    return [];
  }
}
export {
  getSkills,
  getRecommendedCategories,
  getAllSkills,
  getPopularCategories,
};
