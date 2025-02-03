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
    const result = await axios.put(
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
    console.log(result.data);
  } catch (e) {
    console.log(e);
  }
}
async function getOrder({ order_id }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/order/getOrder/${order_id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function getTasks({ order_id }) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/order/getTasks/${order_id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
async function createTask({ order_id, description }) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/order/addTask`,
    {
      order_id,
      description,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
}
async function completeTask({ id }) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/order/completeTask`,
    {
      id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
}
async function editTask({ id, description }) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/order/updateTask`,
    {
      id,
      description,
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
async function addReview({
  reviewer_id,
  reviewee_id,
  order_id,
  rating,
  comment,
  role,
}) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/reviews/createReview`,
    {
      reviewee_id,
      reviewer_id,
      order_id,
      rating,
      comment,
      role,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
}
async function fetchAITimeline({
  features,
  packageFeatures,
  gigTitle,
  order_id,
}) {
  const result = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}/order/generateAITimeline`,
    {
      features,
      packageFeatures,
      gigTitle,
      order_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
}
export {
  getClientOrders,
  ChangeOrderStatus,
  getOrder,
  getTasks,
  createTask,
  completeTask,
  editTask,
  addReview,
  fetchAITimeline,
};
