import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import Orders from "../../components/Charts/Orders";
// Function to format "YYYY-MM" into "Jan 2025", "Feb 2025", etc.
const formatMonth = (dateString) => {
  const [year, month] = dateString.split("-");
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const fetchOrdersGrowth = async (user_id, token) => {
  const response = await axios.get(
    `http://localhost:3001/freelancer/getFreelancerOrdersGrowth?user_id=${user_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.monthlyOrders.map((item) => ({
    ...item,
    month: formatMonth(item.month), // Convert "2025-01" → "Jan 2025"
  }));
};

const OrdersChart = () => {
  const { userState } = useAuthContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["freelancerOrdersGrowth", userState?.user_id],
    queryFn: () => fetchOrdersGrowth(userState?.user_id, userState.token),
    enabled: !!userState?.user_id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading ratings chart...</p>;
  if (error) return <p>Error fetching ratings data: {error.message}</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <Orders data={data} />
    </div>
  );
};

export default OrdersChart;
