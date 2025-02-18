import React from "react";
import styles from "./ProposalPopUp.module.css";
import DOMPurify from "dompurify";
import { X } from "lucide-react"; // Importing a close (X) icon
import { acceptProposal, rejectProposal } from "../../apis/Applicants";
import { useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
const ApplicantModal = ({ applicant, onClose }) => {
  const sanitizedHTML = DOMPurify.sanitize(applicant.Bids[0].bid_details);
  const queryClient = new QueryClient();
  // Accept Proposal Mutation
  const { mutate: acceptMutation } = useMutation({
    mutationFn: () =>
      acceptProposal(applicant.Bids[0].bidId, applicant.applicant_id),
    onSuccess: () => {
      console.log("Accepted Proposal");
      queryClient.invalidateQueries(["applicants"]);
      onClose();
    },
    onError: () => {
      console.log("Failed to accept proposal");
    },
  });

  // Reject Proposal Mutation
  const { mutate: rejectMutation } = useMutation({
    mutationFn: () =>
      rejectProposal(applicant.Bids[0].bidId, applicant.applicant_id),
    onSuccess: () => {
      console.log("Rejected Proposal");
      queryClient.invalidateQueries(["applicants"]);
      onClose();
    },
    onError: () => {
      console.log("Failed to reject proposal");
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        {applicant.Bids[0].bid_status == "pending" && (
          <div className={styles.footerContainers}>
            <button onClick={() => rejectMutation()}>REJECT</button>
            <button onClick={() => acceptMutation()}>ACCEPT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantModal;
