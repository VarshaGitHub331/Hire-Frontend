import { useDispatch, useSelector } from "react-redux";
import { changeGigDesc } from "../../redux/gigSlice";
import styles from "./AddThird.module.css";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";

// Validation schema
const BASE_URL = process.env.REACT_APP_SERVER_URL;
const validationSchema = yup.object({
  gigDesc: yup
    .string()
    .required("Please Enter A Description")
    .min(20, "The description must be a minimum of 20 characters")
    .max(400, "The description can be a maximum of 400 characters"),
});

export default function Gigdesc() {
  const dispatch = useDispatch();
  const gigTitle = useSelector((store) => store.gig.gigTitle);
  const gigCategories = useSelector((store) => store.gig.gigCategories);
  const gigSkills = useSelector((store) => store.gig.gigSkills);
  const budget = useSelector((store) => store.gig.budget);
  const features = useSelector((store) => store.gig.features);
  const gigDescFromStore = useSelector((state) => state.gig.gigDesc);
  const { userState } = useAuthContext(); // Get persisted gig description value from the store

  // Handle image selection
  const handleImageChange = (e, setFieldValue) => {
    const files = e.target.files; // Get the selected files
    setFieldValue("gigImage", files); // Update Formik's field with selected files
  };

  // Form submission handler
  async function onSubmit(values, actions) {
    // Dispatch the gig description to Redux
    dispatch(changeGigDesc(values.gigDesc));

    console.log(values);

    // Construct FormData to send to the backend
    const formData = new FormData();
    formData.append("title", gigTitle);
    formData.append("gigCategories", gigCategories);
    formData.append("gigSkills", gigSkills);
    formData.append("budget", budget);
    formData.append("features", features);
    formData.append("gigDesc", gigDescFromStore);
    formData.append("user_id", userState.user_id);

    // Loop through and append all selected files to formData
    for (let i = 0; i < values.gigImage.length; i++) {
      formData.append("gigImages", values.gigImage[i]);
    }

    try {
      // Send data to backend using axios
      const response = await axios.post(
        `${BASE_URL}/freelancer/makeGig`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful submission
      console.log(response.data); // You can process the response data here

      // Reset form fields after successful submission
      actions.resetForm();
    } catch (error) {
      // Handle errors (e.g., display error message)
      console.log(error);
    }

    // Optionally, perform other actions after form submission (e.g., show a success message)
  }

  // Use useEffect to update Formik initial values when the gigDescFromStore changes

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        gigDesc: gigDescFromStore || "", // Initialize with persisted value from store or default to empty string
        gigImage: [], // Default empty array for gig images
      }}
      validationSchema={validationSchema}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className={styles.descBox}>
            <div className={styles.inputContainer}>
              <label htmlFor="gigDesc" className={styles.thirdLabel}>
                Gig Description
              </label>
              <Field
                as="textarea"
                id="gigDesc"
                name="gigDesc"
                placeholder="...Enter In A Concise Description For Your Gig"
                className={styles.normalText}
                value={values.gigDesc}
              />
            </div>
            <ErrorMessage
              name="gigDesc"
              component="div"
              style={{
                fontSize: "12px",
                color: "red",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                fontStyle: "italic",
              }}
            />
            <div className={styles.inputContainer}>
              <label htmlFor="gigImage" className={styles.thirdLabel}>
                Gig Media
              </label>

              {/* File input (with 'multiple' to allow multiple file selection) */}
              <input
                type="file"
                id="gigImage"
                name="gigImage"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, setFieldValue)} // Handle file input change
                className={styles.imageInput}
              />
            </div>
            <button
              className={styles.thirdButton}
              type="button"
              disabled={isSubmitting}
            >
              Use AI
            </button>
            <button
              className={styles.thirdSubmit}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
