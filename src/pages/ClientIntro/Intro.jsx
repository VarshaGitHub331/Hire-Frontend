import styles from "./Intro.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage, label } from "formik";
import axios from "axios";
import { useFormikContext } from "formik";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { changeName, changeNo, setCompleted } from "../../redux/companySlice";
import * as yup from "yup";
export default function ClientIntro() {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(true);
  const { completed } = useSelector((store) => store.company);
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
              navigate("/viewGigs");
            }}
          >
            View Existing Gigs
          </div>
          <div className={styles.createPosting}>Create A Job Posting</div>
        </div>
      </div>

      {!completed && (
        <DetailModal
          detailModal={detailModal}
          setDetailModal={setDetailModal}
        />
      )}
    </>
  );
}
function DetailModal({ detailModal, setDetailModal }) {
  const dispatch = useDispatch();
  const { user_id, token } = useAuthContext().userState;
  const { company_name, company_no } = useSelector((store) => store.company);
  const initialValues = {
    companyName: company_name || "",
    companyPhone: company_no || "",
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
      const updatedProfile = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/client/updateProfile`,
        {
          user_id,
          contact_number: company_no,
          company_name: company_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully:", updatedProfile.data);
      dispatch(setCompleted());
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
        {({ isSubmitting, setFieldValue }) => (
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
                onChange={(e) => {
                  setFieldValue("companyName", e.target.value);
                  dispatch(changeName(e.target.value));
                }}
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
                onChange={(e) => {
                  setFieldValue("companyPhone", e.target.value);
                  dispatch(changeNo(e.target.value));
                }}
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
