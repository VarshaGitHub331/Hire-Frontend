import axios from "axios";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

async function getCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/data/getCategories`);
    console.log("All categories are ", res);
    return res.data.categories;
  } catch (e) {
    console.error(e);
  }
}
export { getCategories };
