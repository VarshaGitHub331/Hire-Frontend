import axios from "axios";
async function extractSkillsFromPosting(formData, user_id) {
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
        },
      }
    );
    console.log(result.data);
    const finalSkills = [...new Set(result.data.extracted_skills)];
    return finalSkills;
  } catch (e) {
    alert(e); // Handle error
  }
}
async function CreatePosting(formData, user_id, skills) {
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
        },
      }
    );
    console.log("Done");
  } catch (e) {
    alert(e); // Handle error
  }
}
async function fetchPostings(user_id, pageParam) {
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
        },
      }
    );
    console.log(result);
    return {
      jobResults: result.data.jobResults, // Array of gigs
    };
  } catch (e) {
    alert(e); // Handle error
  }
}
async function editPosting(editJob) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/client/editPosting`,
      editJob,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Edited Job Response:", result.data);
    return result.data.updatedJob; // Ensure backend returns updated job
  } catch (e) {
    console.log(e);
  }
}
async function closePosting(job_id, postingStatus) {
  try {
    const result = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/client/removePosting/${job_id}`,
      {
        status: postingStatus,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data.newJob;
  } catch (e) {
    console.log(e);
  }
}
async function fetchPostingsForFreelancer(user_id) {
  try {
    const result = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/freelancer/jobsForFreelancer}`,
      {
        params: {
          user_id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } catch (e) {
    console.log(e);
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
