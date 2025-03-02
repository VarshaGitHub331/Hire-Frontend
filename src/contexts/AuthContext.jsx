import { useContext, createContext, useReducer } from "react";
import { createRoutesFromChildren } from "react-router-dom";
import { persistor } from "../redux/store";

const UserContext = createContext(null);

const initialUser = {
  name: localStorage.getItem("name") || null,
  role: localStorage.getItem("role") || null,
  user_id: localStorage.getItem("user_id") || null,
  token: localStorage.getItem("authToken") || null,
  profilePic: localStorage.getItem("profilePic") || null,
};

function userReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        name: payload.user_name,
        role: payload.role,
        token: payload.token,
        user_id: payload.user_id,
        profilePic: payload.profilePic,
      };
    case "LOGOUT":
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      localStorage.removeItem("profilePic");
      return {
        ...state,
        name: null,
        role: null,
        token: null,
        user_id: null,
        profilePic: null,
      };
    case "updatePic":
      localStorage.setItem("profilePic", payload);
      return { ...state, profilePic: payload };
    default:
      console.log("Unknown User Action");
  }
}
function AuthProvider({ children }) {
  const [userState, dispatch] = useReducer(userReducer, initialUser);
  function UserLogin(user) {
    dispatch({ type: "LOGIN", payload: user });
    localStorage.setItem("name", user.user_name);
    localStorage.setItem("role", user.role);
    localStorage.setItem("user_id", user.user_id);
    localStorage.setItem("authToken", user.token);
    localStorage.setItem("profilePic", user.profilePic);
  }
  function UserLogout() {
    dispatch({ type: "LOGOUT" });

    persistor.purge().then(() => {
      console.log("purged");
    });
  }
  function UpdatePic(profilePic) {
    dispatch({ type: "updatePic", payload: profilePic });
  }
  return (
    <UserContext.Provider
      value={{ UserLogin, UserLogout, userState, UpdatePic }}
    >
      {children}
    </UserContext.Provider>
  );
}
function useAuthContext() {
  const { UserLogin, UserLogout, userState, UpdatePic } =
    useContext(UserContext);
  return { UserLogin, UserLogout, userState, UpdatePic };
}
export { AuthProvider, useAuthContext };
