import { useDispatch, useSelector } from "react-redux";
import { changeGigDesc, decreaseGigStep, resetGig } from "../../redux/gigSlice";
import styles from "./AddThird.module.css";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import ReactLoading from "react-loading";
import { FaMagic } from "react-icons/fa";
import { generateAIDescription } from "../../apis/Gigs";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Validation schema
const validationSchema = yup.object({
  gigDesc: yup
    .string()
    .required("Please Enter A Description")
    .min(20, "The description must be a minimum of 20 characters")
    .max(400, "The description can be a maximum of 400 characters"),
});

export default function Gigdesc() {
  const dispatch = useDispatch();
  const gig = useSelector((store) => store.gig);
  const gigTitle = gig.gigTitle;
  const gigCategories = gig.gigCategories;
  const gigSkills = gig.gigSkills;
  const budget = gig.budget;
  const features = gig.features;
  const gigDescFromStore = gig.gigDesc;
  const gigStoreStandardBudget = gig.standardBudget;
  const gigStoreAdvancedBudget = gig.advancedBudget;
  const gigStoreStandardFeatures = gig.standardFeatures;
  const gigStoreAdvancedFeatures = gig.advancedFeatures;
  const gigDuration = gig.duration;
  const gigRevision = gig.revisions;
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { userState } = useAuthContext();
  const navigate = useNavigate();
  // Handle image selection
  const handleImageChange = (e, setFieldValue) => {
    const files = e.target.files;
    setFieldValue("gigImage", files);
  };

  // AI Description Generation Mutation
  const mutateDescription = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const data = await generateAIDescription({
        title: gigTitle,
        features,
        standardFeatures: gigStoreStandardFeatures,
        advancedFeatures: gigStoreAdvancedFeatures,
      });
      return data;
    },
    onSuccess: (data) => {
      dispatch(changeGigDesc(data));
      setIsGenerating(false);
    },
    onError: (e) => {
      console.error(e);
      setIsGenerating(false);
    },
  });

  // Form submission handler
  async function onSubmit(values, actions) {
    dispatch(changeGigDesc(values.gigDesc));
    const formData = new FormData();
    formData.append("title", gigTitle);
    formData.append("gigCategories", gigCategories);
    formData.append("gigSkills", JSON.stringify(gigSkills));
    formData.append("budget", budget);
    formData.append("features", JSON.stringify(features));
    formData.append(
      "standard_features",
      JSON.stringify(gigStoreStandardFeatures)
    );
    formData.append(
      "advanced_features",
      JSON.stringify(gigStoreAdvancedFeatures)
    );
    formData.append("standard_budget", gigStoreStandardBudget);
    formData.append("advanced_budget", gigStoreAdvancedBudget);
    formData.append("duration", gigDuration);
    formData.append("revisions", gigRevision);
    formData.append("gigDesc", values.gigDesc);
    formData.append("user_id", userState.user_id);

    for (let i = 0; i < values.gigImage.length; i++) {
      formData.append("gigImages", values.gigImage[i]);
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${BASE_URL}/freelancer/makeGig`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userState.token}`,
          },
        }
      );
      console.log(response.data);
      actions.resetForm();
      setSubmitting(false);
      dispatch(resetGig());
      navigate("/myGigs");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        gigDesc: gigDescFromStore || "",
        gigImage: [],
      }}
      validationSchema={validationSchema}
    >
      {({ values, isSubmitting, setFieldValue }) => {
        // Move useEffect here
        useEffect(() => {
          // Update Formik field when AI description changes
          if (gigDescFromStore) {
            setFieldValue("gigDesc", gigDescFromStore);
          }
        }, [gigDescFromStore, setFieldValue]);

        return (
          <Form>
            <div className={styles.descBox}>
              {submitting && (
                <div
                  style={{
                    marginLeft: "25%",
                    position: "fixed",
                    top: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <ReactLoading
                    type="spin"
                    color="green"
                    height={25}
                    width={25}
                  />
                </div>
              )}

              <div className={styles.inputContainer}>
                <label htmlFor="gigDesc" className={styles.thirdLabel}>
                  Gig Description
                  <button
                    type="button"
                    className={styles.submitButton}
                    disabled={isGenerating}
                    onClick={() => mutateDescription.mutate()}
                  >
                    {isGenerating ? (
                      "Generating..."
                    ) : (
                      <>
                        <FaMagic className={styles.icon} /> Use AI
                      </>
                    )}
                  </button>
                </label>

                <Field
                  as="textarea"
                  id="gigDesc"
                  name="gigDesc"
                  placeholder="...Enter In A Concise Description For Your Gig"
                  className={styles.normalText}
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
                <input
                  type="file"
                  id="gigImage"
                  name="gigImage"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  className={styles.imageInput}
                />
              </div>

              <div className={styles.buttonHolder}>
                <button
                  type="button"
                  className={styles.thirdSubmit}
                  onClick={() => dispatch(decreaseGigStep())}
                >
                  Back
                </button>
                <button
                  className={styles.thirdSubmit}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
