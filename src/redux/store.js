import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["modal", "gig"],
};
const persistreducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistreducer,
});
const persistor = persistStore(store);

export { store, persistor };
