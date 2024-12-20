import modalReducer from "./modalSlice";
import signUpReducer from "./signUpDataSlice";
import gigReducer from "./gigSlice";
import companyReducer from "./companySlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  modal: modalReducer,
  signUpDetails: signUpReducer,
  gig: gigReducer,
  company: companyReducer,
});

export default rootReducer;
