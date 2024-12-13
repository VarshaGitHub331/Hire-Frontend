import React from "react";
import { Formik, Form, Field, ErrorMessage, label } from "formik";
import { useFormikContext } from "formik";
import * as yup from "yup";
import styles from "./AddFirst.module.css";
import { useState, useEffect } from "react";
import ProgressBar from "../../components/progress/Progress";
import { getRecommendedCategories, getSkills } from "../../apis/Skills";
import { useQuery } from "@tanstack/react-query";
import Modal from "react-modal";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseGigStep,
  changeGigTitle,
  changeGigCategories,
  changeGigSkills,
} from "../../redux/gigSlice";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const validationSchema = yup.object({
  gigTitle: yup
    .string()
    .required("Gig Title is required")
    .min(5, "Gig title must be at least 5 characters")
    .max(50, "Try keeping it shorter!"),

  gigCategory: yup.string().required("Please select a category for the gig"),
  gigSkills: yup
    .array()
    .min(1, "Choose at least one skill")
    .of(yup.string().required("Skill is required")),
});

const onSubmit = (values) => {
  console.log("Form Data:", values);
};

function CreateGig() {
  const gigStoreTitle = useSelector((store) => store.gig.gigTitle);
  const gigStoreCategory = useSelector((store) => store.gig.gigCategory);
  const gigStoreSkills = useSelector((store) => store.gig.gigSkills);
  const [gigTitle, setGigTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [openrecs, setOpenRecs] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chatModal, setChatModal] = useState(false);
  const [gigDesc, setGigDesc] = useState("");
  const [showRecommendCategories, setShowRecommendCategories] = useState([]);
  const [showRecommendSkills, setShowRecommendSkills] = useState([]);
  const dispatch = useDispatch();
  function handleNext(e, values) {
    dispatch(changeGigTitle(values.gigTitle));
    dispatch(changeGigCategories(values.gigCategory));
    dispatch(changeGigSkills(tags));
    dispatch(increaseGigStep());
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newTag = inputValue.trim();

      // Add new tag only if it's not already in the list
      if (
        !tags.includes(newTag) &&
        showRecommendSkills?.find(
          (f) => f.skill_name.toLowerCase() == inputValue.toLowerCase()
        )
      ) {
        setTags([...tags, newTag]);
      }

      setInputValue(""); // Clear input
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const { data: recommendCategories, isLoadingCats } = useQuery({
    queryKey: ["recommendCategories", gigTitle], // The key should be an array
    queryFn: () => getRecommendedCategories(gigTitle), // Fetch function

    enabled: gigTitle.length > 0, // Ensures the query only runs if gigTitle is not empty
  });
  const { data: recommendedSkills, isLoadingSkills } = useQuery({
    queryKey: ["recommendedSkills", selectedCategory],
    queryFn: () => getSkills(selectedCategory),

    enabled: !!selectedCategory,
  });
  useEffect(() => {
    if (recommendCategories?.length > 0)
      setShowRecommendCategories(recommendCategories);
  }, [recommendCategories]);
  useEffect(() => {
    if (recommendedSkills?.length > 0) {
      setShowRecommendSkills(recommendedSkills);
      setTags((tags) => recommendedSkills.map((skill) => skill.skill_name));
    }
  }, [recommendedSkills]);
  async function handleTitleBlur(e) {
    const title = e.target.value;

    setGigTitle(title);
    setOpenRecs(true);
  }
  async function handleProceed({ values, setFieldValue }) {
    try {
      const res = await axios.post(
        `${BASE_URL}/freelancer/getGigInfo`,
        {
          gigDesc,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      setShowRecommendCategories(data.categories);
      setShowRecommendSkills(data.skills);
      setFieldValue("gigTitle", data.title);
      setFieldValue("gigCategory", data.most_similar_category);
    } catch (e) {
      alert(e);
    }
  }
  return (
    <>
      <div className={styles.progressContainer}>
        <ProgressBar step={1} totalSteps={3} />
      </div>
      <Formik
        initialValues={{
          gigTitle: gigStoreTitle,
          gigCategory: gigStoreCategory,
          gigSkills: gigStoreSkills,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <>
            <Form className={styles.box}>
              <div className={styles.inputContainer}>
                <label htmlFor="gigTitle" className={styles.firstLabel}>
                  Choose an optimized and crisp title for your gig
                </label>
                <Field
                  type="text"
                  id="gigTitle"
                  name="gigTitle"
                  placeholder="...Enter in a title for you gig"
                  onBlur={handleTitleBlur}
                  className={styles.normalText}
                />
              </div>
              <ErrorMessage
                name="gigTitle"
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
                <label htmlFor="gigCtaegories" className={styles.firstLabel}>
                  Select from available categories to tag your gig
                </label>
                <Field
                  type="text"
                  id="gigCategory"
                  name="gigCategory"
                  value={values.gigCategory}
                  onClick={(e) => {
                    setOpenRecs((openrecs) => !openrecs);
                  }}
                  onChange={(e) => {
                    setFieldValue("gigCategory", e.target.value);
                    setSelectedCategory((cat) => [e.target.value]);
                  }}
                  placeholder="...Select the category for your gig"
                  className={styles.normalText}
                />
              </div>
              <ErrorMessage
                name="gigCategory"
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
              {showRecommendCategories?.length > 0 && openrecs && (
                <div className={styles.recommendedCategories}>
                  <div className={styles.recommendedHeading}>
                    Recommended Categories
                  </div>
                  <div className={styles.categoryList}>
                    {showRecommendCategories?.map((category) => (
                      <div
                        key={category}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFieldValue("gigCategory", category); // Update Formik value
                          setSelectedCategory([category]); // Update state
                          setOpenRecs(false); // Close the recommendations dropdown
                        }}
                      >
                        &gt;&gt; {category}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.inputContainer}>
                <label htmlFor="gigSkills" className={styles.firstLabel}>
                  Select skills from available categories for your gig
                </label>
                <div className={styles.skillContainer}>
                  <div className={styles.skillTags}>
                    {tags?.map((tag, index) => (
                      <div key={index} className={styles.tag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}>
                          ×
                        </button>
                      </div>
                    ))}
                    <Field
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="..Select Skill"
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  className={styles.firstButton}
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    setChatModal(true);
                  }}
                >
                  Use AI
                </button>
              
                  
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={(e) => {
                      handleNext(e, values);
                    }}
                    className={styles.firstButton}
                  >
                    Next
                  </button>
              
              </div>
            </Form>
            <Modal
              isOpen={chatModal}
              onRequestClose={(e) => {
                setChatModal(false);
              }}
              contentLabel="Upload Resume"
              className={styles.chatBox}
            >
              <h4>Describe What Your Gig Is About</h4>
              <button
                onClick={(e) => {
                  setChatModal(false);
                }}
                className={styles.closeButton}
              >
                &times;
              </button>
              <div className={styles.uploadBox}>
                <textarea
                  value={gigDesc}
                  onChange={(e) => {
                    setGigDesc(e.target.value);
                  }}
                  style={{
                    width: "90%",
                    height: "90%",
                    backgroundColor: "inherit",
                    outline: "none",
                    border: "none",
                    margin: "0.5rem",
                  }}
                ></textarea>
              </div>
              <button
                className={styles.continue}
                onClick={(e) => {
                  handleProceed({ values, setFieldValue });
                  setChatModal(false);
                }}
                disabled={!gigDesc}
              >
                {gigDesc === "" ? "Describe" : "Continue"}
              </button>
            </Modal>
          </>
        )}
      </Formik>
    </>
  );
}

export { CreateGig }; ////chagne this code accordingly
