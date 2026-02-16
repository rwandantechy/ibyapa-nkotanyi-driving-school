import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import questionsReducer from "./reducers/questionsReducer";
import pdfReducer from "./reducers/pdfReducer";
import paymentReducer from "./reducers/paymentReducer";
import videosReducer from "./reducers/videosReducer";
import performanceReducer from "./reducers/performanceReducer";


const store = configureStore({
  reducer: {
    user: userReducer,
    questions: questionsReducer,
    pdfs: pdfReducer,
    payment: paymentReducer,
    videos: videosReducer,
    performance: performanceReducer
    
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;
