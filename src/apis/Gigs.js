import axios from "axios";
const SERVER = process.env.REACT_APP_SERVER_URL;

async function fetchGigs(user_id, pageParam, token) {
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result);
    return {
      gigs: result.data, // Array of gigs
    };
  } catch (e) {
    console.error(e);
  }
}
async function fetchAllGigs(pageParam, projectDetails, token) {
  try {
    const result = await axios.post(
      `${SERVER}/gigs/tailoredGigs`,
      {
        clientText: projectDetails, // Payload sent to the server
      },
      {
        params: {
          page: pageParam, // Page number for pagination
          limit: 6, // Number of results per page
        },
        headers: {
          "Content-Type": "application/json", // Ensure JSON payload
        },
      }
    );

    // Log the result for debugging
    console.log("Fetch Gigs Result:", result);

    // Return structured data
    return {
      gigs: result.data.results || [], // Default to an empty array
      extracted_categories: result.data.extracted_categories || [], // Handle potential undefined
      extracted_budget: result.data.extracted_budget || null, // Default to an empty object
    };
  } catch (error) {
    console.error("Error fetching gigs:", error); // Log detailed error info
    throw new Error("Unable to fetch gigs. Please try again later."); // Throw an error for query handling
  }
}
async function generateAIDescription({
  title,
  features,
  standardFeatures,
  advancedFeatures,
  token,
}) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/gigs/generateAIDescription`,
    {
      title,
      features,
      standardFeatures,
      advancedFeatures,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data.description;
}
async function getTopRatedGigs() {
  const result = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/gigs/fetchTopRatedGigs`
  );
  return result.data;
}
export { fetchGigs, fetchAllGigs, generateAIDescription, getTopRatedGigs };
