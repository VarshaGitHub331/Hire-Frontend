import axios from "axios";
async function createPosting(formData, user_id) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/client/createPosting`, // Use the correct URL path
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
    console.log(result);
  } catch (e) {
    alert(e); // Handle error
  }
}
export { createPosting };
