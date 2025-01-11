import styles from "./ViewOrder.module.css";

export default function ViewOrder() {
  return (
    <div className={styles.viewGig}>
      <div className={styles.orderHeader}>
        <div className={styles.direction}>HIRE &gt; ORDERS &gt;&gt; #123</div>
        <div className={styles.orderTime}>January 8, 2024 at 9.49 PM</div>
      </div>
      <div className={styles.orderDetails}>
        <div className={styles.orderContent}>
          <div className={styles.orderItem}>
            <div className={styles.heading}>Order Item</div>
            <span className={styles.status}>Status</span>
            <div className={styles.gigItem}>
              <div className={styles.gigTitle}>
                <img src="/logo192.png" />
                This is the title
              </div>
              <div className={styles.payable}>&#8377; 1500</div>
            </div>
          </div>
          <div className={styles.orderDetails}>Order Details</div>
        </div>
        <div className={styles.freelancerDetails}></div>
      </div>
    </div>
  );
}
