import React from "react";
import { Formik, Form, Field, ErrorMessage, label } from "formik";
import { useFormikContext } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import ProgressBar from "../../components/progress/Progress";
import Basic from "./Basic";
import Standard from "./Standard";
import Advanced from "./Advanced";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddSecond.module.css";
import {
  changeGigBudget,
  changeAdvancedBudget,
  changeStandardBudget,
  changeStandardFeatures,
  changeAdvancedFeatures,
  changeGigFeatures,
  increaseGigStep,
  decreaseGigStep,
  changeGigDuration,
  changeGigRevisions,
} from "../../redux/gigSlice";

export default function Budget() {
  const [gigPackage, setGigPackage] = useState("basic");
  const store = useSelector((store) => store.gig);
  console.log(store);
  const gigStoreBudget = useSelector((store) => store.gig.budget);
  const gigStoreStandardBudget = useSelector(
    (store) => store.gig.standardBudget
  );
  const gigStoreAdvancedudget = useSelector(
    (store) => store.gig.advancedBudget
  );
  const gigStoreFeatures = useSelector((store) => store.gig.features);
  const gigStoreStandardFeatures = useSelector(
    (store) => store.gig.standardFeatures
  );

  const gigStoreAdvancedFeatures = useSelector(
    (store) => store.gig.advancedFeatures
  );

  const gigDuration = useSelector((store) => store.gig.duration);
  const gigRevision = useSelector((store) => store.gig.revisions);
  const dispatch = useDispatch();

  const onSubmit = (values, actions) => {
    dispatch(changeGigBudget(values.price));
    dispatch(changeGigFeatures(values.features));
    dispatch(changeGigRevisions(values.revisions));
    dispatch(changeGigDuration(values.duration));
    dispatch(
      changeStandardFeatures(
        values.standardFeatures ? values.standardFeatures : []
      )
    );
    dispatch(
      changeAdvancedFeatures(
        values.advancedFeatures ? values.advancedFeatures : []
      )
    );
    dispatch(changeStandardBudget(values.standardPrice));
    dispatch(changeAdvancedBudget(values.advancedPrice));
    dispatch(increaseGigStep());
  };
  return (
    <>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          price: gigStoreBudget,
          features: gigStoreFeatures,
          standardPrice: gigStoreStandardBudget,
          advancedPrice: gigStoreAdvancedudget,
          standardFeatures: gigStoreStandardFeatures,
          advancedFeatures: gigStoreAdvancedFeatures,
          duration: gigDuration,
          revisions: gigRevision,
          gigPackage: gigPackage,
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className={styles.budgetBox}>
              <Field as="select" name="gigPackage" className={styles.package}>
                <option value="basic">Basic Package</option>
                <option value="standard">Standard Package</option>
                <option value="advanced">Advanced Package</option>
              </Field>
              <div className={styles.price}>
                <span>&#8377;</span>
                {values.gigPackage == "basic" && (
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className={styles.priceAmount}
                  />
                )}
                {values.gigPackage == "standard" && (
                  <Field
                    type="number"
                    id="standardPrice"
                    name="standardPrice"
                    className={styles.priceAmount}
                  />
                )}
                {values.gigPackage == "advanced" && (
                  <Field
                    type="number"
                    id="advancedPrice"
                    name="advancedPrice"
                    className={styles.priceAmount}
                  />
                )}
              </div>
              <div className={styles.mainFeatures}>
                <div style={{ display: "flex" }}>
                  <i class="fas fa-clock "></i>
                  <Field
                    type="text"
                    placeholder="Completion Time"
                    name="duration"
                    className={styles.mainInput}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <i class="fas fa-sync"></i>
                  <Field
                    type="text"
                    name="revisions"
                    placeholder="No. Of Revisions"
                    className={styles.mainInput}
                  />
                </div>
              </div>
              <>
                {values.gigPackage == "basic" && (
                  <Basic values={values} setFieldValue={setFieldValue} />
                )}
                {values.gigPackage == "standard" && (
                  <Standard values={values} setFieldValue={setFieldValue} />
                )}
                {values.gigPackage == "advanced" && (
                  <Advanced values={values} setFieldValue={setFieldValue} />
                )}
              </>
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={styles.prevButton}
                  onClick={(e) => {
                    dispatch(decreaseGigStep());
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.next}
                  disabled={values.price === 0 || values.features.length <= 0}
                >
                  Next
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
