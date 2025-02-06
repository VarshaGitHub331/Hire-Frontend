import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
// Function to format "YYYY-MM" into "Jan 2025", "Feb 2025", etc.
const formatMonth = (dateString) => {
  const [year, month] = dateString.split("-");
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const fetchRatingsGrowth = async (user_id) => {
  const response = await axios.get(
    `http://localhost:3001/freelancer/getFreelancerRatingsGrowth?user_id=${user_id}`
  );
  return response.data.monthlyRatings.map((item) => ({
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
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="avg_rating"
            stroke="#28a745"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingsChart;
