// API function to update freelancer skills
export const updateFreelancerSkills = async ({
  user_id,
  freelancerSkills,
  token,
}) => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/freelancer/updateSkills`,
    {
      method: "POST",
      body: JSON.stringify({ user_id, freelancerSkills }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error updating skills");
  }
  return response.json();
};

// API function to update freelancer categories
export const updateFreelancerCategories = async ({
  user_id,
  freelancerCategories,
  token,
}) => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/freelancer/updateSkills`,
    {
      method: "POST",
      body: JSON.stringify({ user_id, freelancerCategories }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error updating categories");
  }
  return response.json();
};
