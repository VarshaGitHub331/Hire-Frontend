import modalReducer from "./modalSlice";
import signUpReducer from "./signUpDataSlice";
import gigReducer from "./gigSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  modal: modalReducer,
  signUpDetails: signUpReducer,
  gig: gigReducer,
});

export default rootReducer;
