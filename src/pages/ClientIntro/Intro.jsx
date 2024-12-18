import styles from "./Intro.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage, label } from "formik";
import axios from "axios";
import { useFormikContext } from "formik";
import { useAuthContext } from "../../contexts/AuthContext";
import * as yup from "yup";
export default function ClientIntro() {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(true);
  return (
    <>
      <div className={styles.about}>
        <div className={styles.intro}>
          How would you like to get started with Hire?
        </div>
        <div className={styles.desc}>
          You can get started by viewing available gigs or creating a job
          posting.
        </div>
        <div className={styles.options}>
          <div
            className={styles.viewGigs}
            onClick={(e) => {
              dispatch(openFileModal());
            }}
          >
            View Existing Gigs
          </div>
          <div
            className={styles.createPosting}
            onClick={(e) => {
              dispatch(openProfileModal());
            }}
          >
            Create A Job Posting
          </div>
        </div>
      </div>
      <DetailModal detailModal={detailModal} setDetailModal={setDetailModal} />
    </>
  );
}
function DetailModal({ detailModal, setDetailModal }) {
  const { user_id, token } = useAuthContext().userState;

  const initialValues = {
    companyName: "",
    companyPhone: "",
  };

  const validationSchema = yup.object({
    companyName: yup.string().required("Company Name is required"),
    companyPhone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
      .required("Phone number is required"),
  });

  const onSubmit = async (values, actions) => {
    try {
      const updatedProfile = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/client/updateProfile`,
        {
          user_id,
          contact_number: values.companyPhone,
          company_name: values.companyName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully:", updatedProfile.data);
      setDetailModal(false); // Close modal on successful submission
      actions.resetForm(); // Reset form fields
    } catch (error) {
      console.error("Error updating profile:", error);
      actions.setSubmitting(false); // Reset submission state on error
    }
  };

  return (
    <Modal
      isOpen={detailModal}
      onRequestClose={() => setDetailModal(false)}
      contentLabel="Detail Modal"
      className={styles.box}
    >
      <div className={styles.title}>Hi Varsha, are you an organization?</div>
      <button
        onClick={() => setDetailModal(false)}
        className={styles.closeButton}
      >
        &times;
      </button>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.detailContainer}>
              <label
                htmlFor="companyName"
                style={{ color: "gray", fontSize: "0.8rem" }}
              >
                Company Name
              </label>
              <Field
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Enter company name"
                className={styles.companyInput}
              />
              <ErrorMessage
                name="companyName"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            </div>
            <div className={styles.detailContainer}>
              <label
                htmlFor="companyPhone"
                style={{ color: "gray", fontSize: "0.8rem" }}
              >
                Company Number
              </label>
              <Field
                type="text"
                id="companyPhone"
                name="companyPhone"
                placeholder="Enter phone number"
                className={styles.companyInput}
              />
              <ErrorMessage
                name="companyPhone"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            </div>
            <div className={styles.submitButtons}>
              <button
                type="button"
                onClick={() => setDetailModal(false)}
                className={styles.skip}
              >
                Skip
              </button>
              <button
                className={styles.continue}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Continue"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
