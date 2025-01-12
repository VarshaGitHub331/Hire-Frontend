import styles from "./ViewOrder.module.css";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../../apis/Order";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
export default function ViewOrder() {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getOrder({ order_id: id }),
    queryKey: ["order"],
  });

  useEffect(() => {
    if (order) console.log(order);
  }, [order]);

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
                <img src="/logo192.png" alt="Order Logo" />
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
              Payment: {order.status === "pending" ? "pending" : "completed"}
            </span>
            <div className={styles.description}>
              The customer has opted for a {order.package} package.
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
          <div className={styles.orderFeatures}>
            <div className={styles.heading}>Timeline</div>
            <div className={styles.description}>
              View Personalized Timeline For Your Order
              <button>Use AI</button>
            </div>
            <div className={styles.features}>
              <div>Feature 1</div>
              <div>Feature 2</div>
              <div>Feature 3</div>
              <div>Feature 4</div>
            </div>
          </div>
        </div>

        {/* Freelancer Details */}
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
      </div>
    </div>
  );
}
