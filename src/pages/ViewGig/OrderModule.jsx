import Modal from "react-modal";
import styles from "./OrderModule.module.css";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
export default function OrderModel({ openOrder, setOpenOrder, gig }) {
  const { userState } = useAuthContext();
  const { user_id, token } = userState;
  const [selectedPackage, setSelectedPackage] = useState("");
  const [payable, setPayable] = useState(gig.budget);
  function handlePackageChange(e) {
    setSelectedPackage((selectedPackage) => e.target.value);
  }
  async function createOrder() {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/order/createOrderForGig`,
        {
          user_id,
          freelancer_id: gig.freelancer_id,
          gig_id: gig.gig_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Order created successfully:", result.data);
    } catch (e) {
      console.error("Error creating order:", e.response?.data || e.message);
    }
  }

  useEffect(() => {
    if (selectedPackage == "Basic") setPayable((payable) => gig.budget);
    else if (selectedPackage == "Standard")
      setPayable((payable) => gig.standard_budget);
    else if (selectedPackage == "Advanced")
      setPayable((payable) => gig.advanced_budget);
  }, [selectedPackage]);
  return (
    <Modal
      isOpen={openOrder}
      onRequestClose={(e) => {
        setOpenOrder(false);
      }}
      contentLabel="Confirm Order"
      className={styles.orderBox}
    >
      <h3>Place Your Order</h3>
      <div className={styles.freelancerProfile}>
        Freelancer:
        <div style={{ cursor: "pointer" }}>{gig.freelancer_name}</div>
        <div>⭐ {gig.freelancer_rating}5</div>
      </div>
      <div className={styles.package}>
        <div style={{ fontWeight: "500", fontStyle: "italic" }}>
          Package Type
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="package"
              value="Basic"
              checked={selectedPackage === "Basic"}
              onChange={handlePackageChange}
            />
            Basic
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Standard"
              name="package"
              checked={selectedPackage === "Standard"}
              onChange={handlePackageChange}
            />
            Standard
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Advanced"
              name="package"
              checked={selectedPackage === "Advanced"}
              onChange={handlePackageChange}
            />
            Advanced
          </label>
        </div>
      </div>
      <div className={styles.parameters}></div>
      <div className={styles.mainFeatures}>
        <div style={{ display: "flex" }}>
          <i class="fas fa-clock "></i>
          <div>{gig.duration}</div>
        </div>
        <div style={{ display: "flex" }}>
          <i class="fas fa-sync"></i>
          <div>{gig.revisions}</div>
        </div>
      </div>
      <div className={styles.payable}>Payable : &#8377;{payable}</div>
      <button
        onClick={(e) => {
          setOpenOrder(false);
        }}
        className={styles.closeButton}
      >
        &times;
      </button>

      <button
        className={styles.orderContinue}
        onClick={(e) => {
          createOrder();
        }}
      >
        Continue
      </button>
    </Modal>
  );
}
