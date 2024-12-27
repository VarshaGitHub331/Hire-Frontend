import styles from "./ViewGig.module.css";
export default function Standard({ gig }) {
  return (
    <div className={styles.features}>
      <div className={styles.featureTitle}>Standard Package</div>
      <div className={styles.featureTitle}>Features</div>
      <div className={styles.featureList}>
        {JSON.parse(gig.standard_features).map((feature) => (
          <div>
            <span
              style={{
                color: "green",
                fontSize: "1rem",
                marginRight: "1rem",
              }}
            >
              ✔
            </span>
            {feature}
          </div>
        ))}
      </div>
      <div className={styles.featureTitle}>
        Budget :&nbsp;&#8377; {gig.standard_budget}
      </div>
    </div>
  );
}
