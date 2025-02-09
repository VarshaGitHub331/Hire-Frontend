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
export { extractSkillsFromPosting, CreatePosting };
