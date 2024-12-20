import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  company_name: "",
  company_no: "",
  completed: false,
};
const companySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.company_name = action.payload;
    },
    changeNo: (state, action) => {
      state.company_no = action.payload;
    },
    setCompleted: (state, action) => {
      state.completed = true;
    },
    resetCompany: (state, action) => {
      return initialState;
    },
  },
});
export const { changeName, changeNo, setCompleted, resetCompany } =
  companySlice.actions;

const companyReducer = companySlice.reducer;
export default companyReducer;
