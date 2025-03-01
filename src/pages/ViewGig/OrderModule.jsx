import Modal from "react-modal";
import styles from "./OrderModule.module.css";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaLastfmSquare } from "react-icons/fa";

export default function OrderModel({ openOrder, setOpenOrder, gig }) {
  const navigate = useNavigate();
  const { userState } = useAuthContext();
  const { user_id, token } = userState;
  const [selectedPackage, setSelectedPackage] = useState("Basic");
  const [payable, setPayable] = useState(gig?.budget || 0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ordering, setOrdering] = useState(false);
  function handlePackageChange(e) {
    e.stopPropagation();
    const { value } = e.target;
    setSelectedPackage(value);
  }

  useEffect(() => {
    if (selectedPackage === "Basic") setPayable(gig.budget);
    else if (selectedPackage === "Standard") setPayable(gig.standard_budget);
    else if (selectedPackage === "Advanced") setPayable(gig.advanced_budget);
  }, [selectedPackage]);

  async function createOrder(e) {
    e.stopPropagation();

    try {
      setOrdering(true);
      setSubmitting(true);
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/order/createOrderForGig`,
        {
          user_id,
          freelancer_id: gig.freelancer_id,
          gig_id: gig.gig_id,
          payable,
          notes,
          package: selectedPackage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrdering(false);
      console.log("Order created successfully:", result.data);
      toast.success("Your order has been placed!");
      setSubmitting(false);
      navigate("/orders");
    } catch (e) {
      setOrdering(false);
      toast.error("Error placing order");
      console.error("Error creating order:", e.response?.data || e.message);
    }
  }

  return (
    <Modal
      isOpen={openOrder}
      onRequestClose={() => setOpenOrder(false)}
      contentLabel="Confirm Order"
      className={styles.orderBox}
    >
      <div className={styles.orderHeader}>ORDER GIG</div>

      <div className={styles.mainFeatures}>
        {gig.duration && (
          <div className={styles.feature}>
            <i className="fas fa-clock"></i> <div>{gig.duration}</div>
          </div>
        )}
        {gig.revisions && (
          <div className={styles.feature}>
            <i className="fas fa-sync"></i>
            <div>{gig.revisions}</div>
          </div>
        )}
      </div>

      <div className={styles.package}>
        <div>
          <label>
            <input
              type="checkbox"
              name="package"
              value="Basic"
              checked={selectedPackage === "Basic"}
              onChange={(e) => handlePackageChange(e)}
            />
            Basic
          </label>
        </div>
        {JSON.parse(gig.standard_features).length > 0 && (
          <div>
            <label>
              <input
                type="checkbox"
                name="package"
                value="Standard"
                checked={selectedPackage === "Standard"}
                onChange={(e) => {
                  e.stopPropagation();
                  handlePackageChange(e);
                }}
              />
              Standard
            </label>
          </div>
        )}
        {JSON.parse(gig.advanced_features).length > 0 && (
          <div>
            <label>
              <input
                type="checkbox"
                name="package"
                value="Advanced"
                checked={selectedPackage === "Advanced"}
                onChange={(e) => {
                  e.stopPropagation();
                  handlePackageChange(e);
                }}
              />
              Advanced
            </label>
          </div>
        )}
      </div>

      <textarea
        value={notes}
        placeholder="Add notes"
        className={styles.notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>

      <div className={styles.payable}>
        &#8377;{payable}
        <button
          className={styles.orderContinue}
          onClick={(e) => createOrder(e)}
        >
          {ordering == false ? "Continue" : "Ordering"}
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenOrder(false);
        }}
        disabled={submitting}
        className={styles.closeButton}
      >
        &times;
      </button>
    </Modal>
  );
}
