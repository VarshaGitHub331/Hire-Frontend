import axios from "axios";
async function extractSkillsFromPosting(formData, user_id, token) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/client/getSkillsForPosting`, // Use the correct URL path
      {
        ...formData,
        user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result.data);
    const finalSkills = [...new Set(result.data.extracted_skills)];
    return finalSkills;
  } catch (e) {
    console.error(e);
  }
}
async function CreatePosting(formData, user_id, skills, token) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/client/createPosting`, // Use the correct URL path
      {
        ...formData,
        skills,
        user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Done");
  } catch (e) {
    console.error(e);
  }
}
async function fetchPostings(user_id, pageParam, token) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/client/getJobPostings`, // Use the correct URL path
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
      jobResults: result.data.jobResults, // Array of gigs
    };
  } catch (e) {
    console.error(e);
  }
}
async function editPosting(editJob, token) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/client/editPosting`,
      editJob,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Edited Job Response:", result.data);
    return result.data.updatedJob; // Ensure backend returns updated job
  } catch (e) {
    console.log(e);
  }
}
async function closePosting(job_id, postingStatus, token) {
  try {
    const result = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/client/removePosting/${job_id}`,
      {
        status: postingStatus,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return result.data.newJob;
  } catch (e) {
    console.log(e);
  }
}
async function fetchPostingsForFreelancer(user_id, pageParam, token) {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/freelancer/jobsForFreelancer`, // ✅ FIXED
      {
        params: {
          user_id: user_id,
          page: pageParam,
          limit: 3,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", result.data); // Debugging log ✅

    return {
      jobs: result.data, // Ensure result.data is structured correctly
    };
  } catch (e) {
    console.error("Error fetching jobs:", e.response?.data || e.message); // More detailed error logging ✅
    return { jobs: [] }; // Return an empty array to prevent crashes
  }
}

export {
  extractSkillsFromPosting,
  CreatePosting,
  fetchPostings,
  editPosting,
  closePosting,
  fetchPostingsForFreelancer,
};
