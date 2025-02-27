import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import Ratings from "../../components/Charts/Ratings";
// Function to format "YYYY-MM" into "Jan 2025", "Feb 2025", etc.
const formatMonth = (dateString) => {
  const [year, month] = dateString?.split("-");
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const fetchRatingsGrowth = async (user_id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/freelancer/getFreelancerRatingsGrowth?user_id=${user_id}`
  );
  console.log(response.data);
  return response.data?.monthlyRatings.map((item) => ({
    ...item,
    month: formatMonth(item.month), // Convert "2025-01" → "Jan 2025"
  }));
};

const RatingsChart = () => {
  const { userState } = useAuthContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["freelancerRatingsGrowth", userState?.user_id],
    queryFn: () => fetchRatingsGrowth(userState?.user_id),
    enabled: !!userState?.user_id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading ratings chart...</p>;
  if (error) return <p>Error fetching ratings data: {error.message}</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <Ratings data={data} />
    </div>
  );
};

export default RatingsChart;
