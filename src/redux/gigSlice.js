import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  gigTitle: "",
  gigCategories: [],
  gigSkills: [],
  budget: 0, // General budget
  standardBudget: 0, // Standard budget
  advancedBudget: 0, // Advanced budget
  standardFeatures: [], // Features for standard
  advancedFeatures: [], // Features for advanced
  duration: "",
  revisions: "",
  features: [],
  gigDesc: "",
  gigMedia: [],
};
console.log(initialState);
const gigSlice = createSlice({
  name: "Gigs",
  initialState,
  reducers: {
    increaseGigStep: (state) => {
      state.step += 1;
    },
    decreaseGigStep: (state) => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    changeGigTitle: (state, action) => {
      state.gigTitle = action.payload;
    },
    changeGigCategories: (state, action) => {
      state.gigCategories = action.payload;
    },
    changeGigSkills: (state, action) => {
      state.gigSkills = action.payload;
    },
    changeGigBudget: (state, action) => {
      state.budget = action.payload;
    },
    changeStandardBudget: (state, action) => {
      state.standardBudget = action.payload;
    },
    changeAdvancedBudget: (state, action) => {
      state.advancedBudget = action.payload;
    },
    changeGigFeatures: (state, action) => {
      state.features = action.payload;
    },
    changeStandardFeatures: (state, action) => {
      state.standardFeatures = action.payload;
    },
    changeAdvancedFeatures: (state, action) => {
      state.advancedFeatures = action.payload;
    },
    changeGigDesc: (state, action) => {
      state.gigDesc = action.payload;
    },
    changeGigDuration: (state, action) => {
      state.duration = action.payload;
    },
    changeGigRevisions: (state, action) => {
      state.revisions = action.payload;
    },
    resetGig: () => {
      return initialState;
    },
  },
});

export const {
  increaseGigStep,
  decreaseGigStep,
  changeGigBudget,
  changeStandardBudget,
  changeAdvancedBudget,
  changeGigCategories,
  changeGigSkills,
  changeGigFeatures,
  changeStandardFeatures,
  changeAdvancedFeatures,
  changeGigTitle,
  changeGigDesc,
  changeGigDuration,
  changeGigRevisions,
  resetGig,
} = gigSlice.actions;

export default gigSlice.reducer;
