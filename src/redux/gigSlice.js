import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  gigTitle: "",
  gigCategories: [],
  gigSkills: [],
  budget: 0,
  features: [],
  gigDesc: "",
  gigMedia: [],
};
const gigSlice = createSlice({
  name: "Gigs",
  initialState,
  reducers: {
    increaseGigStep: (state, action) => {
      state.step += 1;
    },
    changeGigTitle: (state, action) => {
      const { payload, type } = action;
      state.gigTitle = payload;
    },
    changeGigCategories: (state, action) => {
      const { payload } = action;
      state.gigCategories = payload;
    },
    changeGigSkills: (state, action) => {
      const { payload } = action;
      state.gigSkills = payload;
    },
    changeGigBudget: (state, action) => {
      const { payload } = action;
      state.budget = payload;
    },
    changeGigFeatures: (state, action) => {
      const { payload } = action;
      state.features = payload;
    },
    changeGigDesc: (state, action) => {
      const { payload } = action;
      state.gigDesc = payload;
    },
  },
});
export const {
  increaseGigStep,
  changeGigBudget,
  changeGigCategories,
  changeGigSkills,
  changeGigFeatures,
  changeGigTitle,
  changeGigDesc,
} = gigSlice.actions;
export default gigSlice.reducer;
