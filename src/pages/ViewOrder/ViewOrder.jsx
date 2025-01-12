import styles from "./ViewOrder.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, getTasks, createTask, completeTask } from "../../apis/Order";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
export default function ViewOrder() {
  const { userState } = useAuthContext();
  const { role } = userState;
  const { id } = useParams();
  const [addTask, setAddTask] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const queryClient = useQueryClient();
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getOrder({ order_id: id }),
    queryKey: ["order"],
  });
  const { data: tasks, isLoadingTasks } = useQuery({
    queryFn: () => getTasks({ order_id: id }),
    queryKey: ["tasks"],
  });

  // Use the addTask mutation correctly
  const { mutate: addNewTask } = useMutation({
    mutationFn: ({ order_id, description }) =>
      createTask({ order_id, description }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks after adding a new one
    },
    onError: () => {
      alert("Error adding task. Please try again.");
    },
  });

  const { mutate: removeTask } = useMutation({
    mutationFn: ({ id }) => completeTask({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks after adding a new one
    },
    onError: () => {
      alert("Error removing task. Please try again.");
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !order) {
    return <div>Error loading order. Please try again later.</div>;
  }

  return (
    <div className={styles.viewGig}>
      <div className={styles.orderHeader}>
        <div className={styles.direction}>
          HIRE &gt; ORDERS &gt;&gt; #{order.order_id}
        </div>
        <div className={styles.orderTime}>
          {moment(order.createdAt).format("YYYY-MM-DD, h:mm:ss a")}
        </div>
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.orderContent}>
          {/* Order Item */}
          <div className={styles.orderItem}>
            <div className={styles.heading}>Order Item</div>
            <div className={styles.status}>{order.status}</div>
            <div className={styles.gigItem}>
              <div className={styles.gigTitle}>
                <img src={order.picture} alt="Order Logo" />
                {order.title && JSON.parse(order.title)}
              </div>
              <div className={styles.payable}>&#8377; {order.payable}</div>
            </div>
            <div className={styles.orderFooter}>
              <div>Manage Your Orders</div>
              <div>
                <button>Fulfill</button>
                <button> Orders</button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderFeatures}>
            <div className={styles.heading}>Order Summary</div>
            <span className={styles.payment}>
              Payment: {order.status == "completed" ? "completed" : "pending"}
            </span>
            <div className={styles.description}>
              {role == "freelancer"
                ? "The customer has opted for a"
                : "You opted for a"}{" "}
              {order.package} package.
            </div>
            <div className={styles.features}>
              {(order.features || []).map((feature, index) => (
                <div key={index} className={styles.feature}>
                  {feature} <div className={styles.packageType}>(Basic)</div>
                </div>
              ))}
              {(order.packageFeatures || []).map((feature, index) => (
                <div key={index} className={styles.feature}>
                  {feature}{" "}
                  <div className={styles.packageType}>
                    ({order.packageType})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className={styles.orderTimeline}>
            <div className={styles.heading}>Timeline</div>
            <div className={styles.description}>
              View Personalized Timeline For Your Order
              <button>Use AI</button>
              <button onClick={(e) => setAddTask(true)}>Add Task</button>
            </div>
            <div className={styles.features}>
              {isLoadingTasks && <div>Loading Features</div>}
              {tasks?.map((task, index) => (
                <div className={styles.feature} key={index}>
                  {task.task_description}
                  <div className={styles.operations}>
                    <span
                      className={
                        task.task_status == "Pending"
                          ? styles.pending
                          : styles.completed
                      }
                    >
                      {task.task_status}
                    </span>
                    {task.task_status != "Completed" && (
                      <span
                        className={styles.complete}
                        onClick={(e) => removeTask({ id: task.id })}
                      >
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {addTask && (
                <input
                  value={taskDescription}
                  placeholder="Add a task"
                  className={styles.taskInput}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewTask({
                        order_id: id,
                        description: taskDescription,
                      }); // Call the mutation with order_id and description
                      setAddTask(false);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Freelancer Details */}
        {role == "client" && (
          <div className={styles.freelancerDetails}>
            <div className={styles.notes}>
              <div className={styles.heading}>Notes</div>
              <div className={styles.note}>{order.notes}</div>
            </div>
            <div className={styles.freelancer}>
              <div className={styles.heading}>Freelancer</div>
              <div className={styles.freelancerInfo}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ fontSize: "20px", color: "gray" }}
                />
                <span>{order.freelancer_name}</span>
              </div>
              <div className={styles.freelancerInfo}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ fontSize: "20px", color: "gray" }}
                />
                <span>{order.freelancer_email}</span>
              </div>
            </div>
          </div>
        )}
        {role == "freelancer" && (
          <div className={styles.freelancerDetails}>
            <div className={styles.notes}>
              <div className={styles.heading}>Notes</div>
              <div className={styles.note}>{order.notes}</div>
            </div>
            <div className={styles.freelancer}>
              <div className={styles.heading}>Client</div>
              <div className={styles.freelancerInfo}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ fontSize: "20px", color: "gray" }}
                />
                <span>{order.client_name}</span>
              </div>
              <div className={styles.freelancerInfo}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ fontSize: "20px", color: "gray" }}
                />
                <span>{order.client_email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
