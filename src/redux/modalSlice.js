import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileModal: false,
  profileModal: false,
  categoryModal: false,
  skillModal: false,
  budgetLinkedin: false,
  step: 1,
};
const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openFileModal: (state) => {
      state.fileModal = true;
    },
    closeFileModal: (state) => {
      state.fileModal = false;
    },
    openProfileModal: (state) => {
      state.profileModal = true;
    },
    closeProfileModal: (state) => {
      state.profileModal = false;
    },
    openCategoryModal: (state) => {
      state.categoryModal = true;
    },
    closeCategoryModal: (state) => {
      state.categoryModal = false;
    },
    openSkillModal: (state) => {
      state.skillModal = true;
    },
    closeSkillModal: (state) => {
      state.skillModal = false;
    },
    openBudgetLinkedin: (state) => {
      state.budgetLinkedin = true;
    },
    closeBudgetLinkedin: (state) => {
      state.budgetLinkedin = false;
    },
    increaseStep: (state) => {
      state.step = state.step + 1;
    },
    decreaseStep: (state) => {
      state.step = 1;
    },
  },
});

export const {
  openFileModal,
  closeFileModal,
  openBudgetLinkedin,
  closeBudgetLinkedin,
  openProfileModal,
  closeProfileModal,
  openSkillModal,
  closeSkillModal,
  openCategoryModal,
  closeCategoryModal,
  increaseStep,
  decreaseStep,
} = modalSlice.actions;

export default modalSlice.reducer;
