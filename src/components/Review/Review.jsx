import styles from "./Review.module.css";
import Modal from "react-modal";
import { useState } from "react";
import { addReview } from "../../apis/Order.js";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";

function FeedbackModal({ openReview, setOpenReview, order }) {
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [comment, setComment] = useState("");
  const { userState } = useAuthContext();

  const feelings = [
    { id: 1, emoji: "😢", label: "Very Bad" },
    { id: 2, emoji: "😟", label: "Bad" },
    { id: 3, emoji: "😐", label: "Medium" },
    { id: 4, emoji: "🙂", label: "Good" },
    { id: 5, emoji: "😁", label: "Very Good" },
  ];

  const { mutate: postReview } = useMutation({
    mutationFn: ({
      reviewer_id,
      reviewee_id,
      order_id,
      rating,
      comment,
      role,
    }) =>
      addReview({
        reviewer_id,
        reviewee_id,
        order_id,
        rating,
        comment,
        role,
        token: userState.token,
      }),
    onSuccess: () => {
      toast.success("Review created Successfully");
      setOpenReview(false); // Close modal after successful submission
    },
    onError: () => {
      toast.error("Some issue in creating your review");
    },
  });

  const handleSubmit = () => {
    if (!selectedFeeling) {
      return;
    }
    postReview({
      reviewer_id: userState.user_id,
      reviewee_id: userState.role == "client" ? order.acceptor : order.creator,
      order_id: order.order_id,
      rating: selectedFeeling, // Use selectedFeeling directly
      comment,
      role: userState.role,
    });
  };

  return (
    <Modal
      className={styles.box}
      isOpen={openReview}
      onRequestClose={() => setOpenReview(false)}
      ariaHideApp={false}
    >
      <button
        className={styles.closeButton}
        onClick={() => setOpenReview(false)}
      >
        &times;
      </button>
      <h3>How are you feeling?</h3>
      <p className={styles.description}>
        Your input is valuable in helping us better understand your needs and
        tailor our service accordingly.
      </p>
      <div className={styles.feelingsContainer}>
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            className={`${styles.feelingButton} ${
              selectedFeeling === feeling.id ? styles.selected : ""
            }`}
            onClick={() => setSelectedFeeling(feeling.id)}
          >
            <span className={styles.emoji}>{feeling.emoji}</span>
            {selectedFeeling === feeling.id && (
              <span className={styles.tooltip}>{feeling.label}</span>
            )}
          </button>
        ))}
      </div>
      <textarea
        className={styles.commentBox}
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit Now
      </button>
    </Modal>
  );
}

export default FeedbackModal;
