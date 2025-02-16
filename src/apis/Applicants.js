import axios from "axios";
async function getApplicantsForJob(job_id, page, pageSize) {
  const applicantResults = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/applicants/getApplicants`,
    {
      params: {
        job_id,
        page,
        pageSize,
      },
    }
  );
  console.log(applicantResults.data);
  return applicantResults.data;
}
async function acceptProposal(bid_id) {
  try {
    console.log("Accepting proposal with bid ID:", bid_id);

    const response = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/applicants/acceptProposal`,
      { bid_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error accepting proposal:", error);
    throw error; // Re-throw for handling in UI
  }
}
async function rejectProposal(bid_id) {
  try {
    console.log("Rejecting proposal with bid ID:", bid_id);

    const response = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/applicants/rejectProposal`,
      { bid_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      } // Empty body
    );

    return response.data; // Return response data for UI updates
  } catch (error) {
    console.error("Error rejecting proposal:", error);
    throw error; // Re-throw for handling in UI
  }
}
export { getApplicantsForJob, acceptProposal, rejectProposal };
