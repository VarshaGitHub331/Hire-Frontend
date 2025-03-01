import axios from "axios";
async function getApplicantsForJob(job_id, page, pageSize, token) {
  const applicantResults = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/applicants/getApplicants`,
    {
      params: {
        job_id,
        page,
        pageSize,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(applicantResults.data);
  return applicantResults.data;
}
async function acceptProposal(bid_id, applicant_id, token) {
  try {
    console.log("Accepting proposal with bid ID:", bid_id);

    const response = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/applicants/acceptProposal`,
      { bid_id, applicant_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error accepting proposal:", error);
    throw error; // Re-throw for handling in UI
  }
}
async function rejectProposal(bid_id, applicant_id, token) {
  try {
    console.log("Rejecting proposal with bid ID:", bid_id);

    const response = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/applicants/rejectProposal`,
      { bid_id, applicant_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      } // Empty body
    );

    return response.data; // Return response data for UI updates
  } catch (error) {
    console.error("Error rejecting proposal:", error);
    throw error; // Re-throw for handling in UI
  }
}
async function getMyProposals(user_id, page, pageSize, token) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/applicants/myProposals`,
      {
        params: {
          user_id,
          page,
          pageSize,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
}
export { getApplicantsForJob, acceptProposal, rejectProposal, getMyProposals };
