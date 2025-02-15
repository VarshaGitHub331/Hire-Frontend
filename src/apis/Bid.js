import axios from "axios";

const submitBid = async ({ bidAmount, timeline, proposal, user_id, job }) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/applicants/becomeApplicant`,
      {
        bid_amount: bidAmount,
        estimated_time: timeline,
        bid_proposal: proposal, // Fixed typo
        user_id,
        job,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error submitting bid:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to submit bid");
  }
};
const getAIProposal = async ({ user_id, job }) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/applicants/generateAIProposal`,
      {
        user_id,
        job,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error submitting bid:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to submit bid");
  }
};
export { submitBid, getAIProposal };
