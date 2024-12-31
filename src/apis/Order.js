import axios from "axios";
async function getClientOrders(role, user_id, page, limit) {
  if (role == "client") {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/order/fetchClientOrders`,
      {
        user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  } else if (role == "freelancer") {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/order/fetchFreelancerOrders`,
      {
        user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result.data);
    return result.data;
  }
}
async function ChangeOrderStatus(order_id, status) {
  try {
    await axios.put(
      `${process.env.REACT_APP_SERVER_URL}/order/edit`,
      {
        status,
        order_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
}
export { getClientOrders, ChangeOrderStatus };
