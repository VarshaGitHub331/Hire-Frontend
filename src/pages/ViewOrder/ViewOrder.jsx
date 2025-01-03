import styles from "./ViewOrder.module.css";

export default function ViewOrder() {
  return (
    <div className={styles.viewGig}>
      <div className={styles.orderHeader}>
        <div className={styles.direction}>HIRE &gt; ORDERS &gt;&gt; #123</div>
        <div className={styles.orderTime}>January 8, 2024 at 9.49 PM</div>
      </div>
    </div>
  );
}
