import axios from "axios";
const SERVER = process.env.REACT_APP_SERVER_URL;

async function fetchGigs(user_id, pageParam) {
  try {
    const result = await axios.get(
      `${SERVER}/gigs/getGigs`, // Use the correct URL path
      {
        params: {
          user_id: user_id,
          page: pageParam, // Add page as a query parameter
          limit: 3, // Set limit directly
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result);
    return {
      gigs: result.data, // Array of gigs
    };
  } catch (e) {
    alert(e); // Handle error
  }
}
async function fetchAllGigs(pageParam) {
  try {
    const result = await axios.get(
      `${SERVER}/gigs/allGigs`, // Use the correct URL path
      {
        params: {
          page: pageParam, // Add page as a query parameter
          limit: 3, // Set limit directly
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result);
    return {
      gigs: result.data, // Array of gigs
    };
  } catch (e) {
    alert(e); // Handle error
  }
}
export { fetchGigs, fetchAllGigs };
