import React, { Suspense } from "react";
//import MarqueeAnnouncement from "./components/MarqueeAnnouncement";
import { Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import DashboardPage from "./pages/DashboardPage";
import SignUpPage from "./pages/SignUpPage";
import SignIn from "./pages/SignIn";
import ProfilePage from "./pages/ProfilePage";
import ExamsPage from "./pages/ExamsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserDashaboard from "./pages/UserDashaboard";
// import UserHistoryPage from "./pages/UserHistoryPage";
import PaymentPage from "./pages/PaymentPage";
import NotFound from "./pages/NotFound";
import ViewPdf from "./pages/ViewPdf";
import MaintainancePage from "./pages/MaintainancePage";
import Reset from "./pages/Reset";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));

function App() {
  return (
    <>
      {/* MarqueeAnnouncement temporarily disabled for testing */}
      {/* <MarqueeAnnouncement /> */}
      <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={
              <div className="w-screen h-screen flex items-center justify-center text-xl">
                NKOTANYI DRIVING SCHOOL ....
              </div>
            }
          >
            <HomePage />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Suspense
            fallback={
              <div className="w-screen h-screen flex items-center justify-center text-xl">
                Loading...
              </div>
            }
          >
            <DashboardPage />
          </Suspense>
        }
      />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/pdf" element={<ViewPdf />} />
      {/* <Route path="/history" element={<UserHistoryPage />} /> */}
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/user-dashboard" element={<UserDashaboard />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/maintenance" element={<MaintainancePage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/reset" element={<Reset/>} />
      </Routes>
    </>
  );
}

export default App;
