/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import AccountContent from "./contents/AccountContent";
import AdminToolsContent from "./contents/AdminToolsContent";
import DashboardContent from "./contents/DashboardContent";
import { url } from "../../constants/url";
import { useState } from "react";
import PaymentContent from "./contents/PaymentContent";
import PdfsContent from "./contents/PdfsContent";
import QuestionsContent from "./contents/QuestionsContent";
import ResetPasswordContent from "./contents/ResetPasswordContent";

import UsersContent from "./contents/UsersContent";
import VideosContent from "./contents/VideosContent";
import { getAllUsers, getUserRegistrationStats } from "../../redux/api-calls/user";
import { getAllPdfsAdmin } from "../../redux/api-calls/pdfs";
import { getAllVideosAdmin } from "../../redux/api-calls/videos";
import { getAdminQuestions } from "../../redux/api-calls/questions";
import { getAllPayments } from "../../redux/api-calls/payment";


const MainDashboardContent = ({ selectedSidebar }) => {
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const { pdfs } = useSelector((state) => state.pdfs);
  const { videos } = useSelector((state) => state.videos);
  const { payments } = useSelector((state) => state.payment);
  const { allQuestions } = useSelector((state) => state.questions);

  const [analytics, setAnalytics] = useState(null);
  const [userStats, setUserStats] = useState(null);


  const FetchStats = () => {
    getAllUsers(token, dispatch);
    getAllPdfsAdmin(token, dispatch);
    getAllVideosAdmin(token, dispatch);
    getAllPayments(token, dispatch);
    getAdminQuestions(token, dispatch);
    fetchAnalytics();
    fetchUserStats();
  };

  const fetchUserStats = async () => {
    const stats = await getUserRegistrationStats(token);
    setUserStats(stats);
  };

  const fetchAnalytics = async () => {
    try {
  const res = await fetch(`${url}/payment/analytics`, {
        headers: { token: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnalytics(data.data);
    } catch (e) {
      setAnalytics(null);
    }
  };

  const calculateTotal = () => {
  return payments?.data?.reduce((acc, curr) => {
    const amount = parseFloat(curr.amount) || 0; 
    return acc + amount;
  }, 0);
};


  useEffect(() => {
    FetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex space-x-8 items-center justify-center mt-4">
        <div className="text-2xl">Fetching All Summary</div>
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="w-full overflow-x-hidden border-t flex flex-col">
      <main className="w-full flex-grow p-6">
        {selectedSidebar === "dashboard" && (
          <DashboardContent
            payments={calculateTotal()}
            users={users?.data}
            userStats={userStats}
            pdfs={pdfs?.data?.length}
            videos={videos?.data?.length}
            questions={allQuestions?.data?.length}
            analytics={analytics}
          />
        )}
        {selectedSidebar === "users" && <UsersContent users={users?.data} />}
        {selectedSidebar === "payments" && (
          <PaymentContent payments={payments?.data} />
        )}
        {selectedSidebar === "pdfs" && <PdfsContent pdfs={pdfs?.data} />}
        {selectedSidebar === "questions" && (
          <QuestionsContent questions={allQuestions?.data} />
        )}
        {selectedSidebar === "videos" && (
          <VideosContent videos={videos?.data} />
        )}
        {selectedSidebar === "adminTools" && <AdminToolsContent />}
        {selectedSidebar === "account" && <AccountContent />}
        {selectedSidebar === "resetPassword" && <ResetPasswordContent />}

      </main>
    </div>
  );
};

export default MainDashboardContent;
