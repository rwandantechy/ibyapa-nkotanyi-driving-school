/* eslint-disable react/prop-types */
import { BiSolidVideos } from "react-icons/bi";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaFilePdf, FaUsers } from "react-icons/fa";
import { MdPayments } from "react-icons/md";


import DashboardCard from "../DashboardCard";
import PaymentAnalyticsCard from "../PaymentAnalyticsCard";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const DashboardContent = ({
  payments,
  users,
  userStats,
  pdfs,
  videos,
  questions,
  analytics,
}) => {
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);
  const adminName = decoded?.name || "Admin";
  return (
    <>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-center text-primary-700">
          <span>
            WELCOME {adminName} 
          </span>
        </h1>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 mt-6">
  {/* Users Card, spans two rows on large screens */}
  {users && (
    <div className="lg:row-span-2 min-h-[440px] flex">
      <DashboardCard
        Icon={FaUsers}
        dataLength={users.length}
        TopLabel="Users"
        lowLabel="Users"
        userStats={userStats}
      />
    </div>
  )}

  {/* PDFs */}
  {pdfs && (
    <div>
      <DashboardCard
        Icon={FaFilePdf}
        dataLength={pdfs}
        TopLabel="PDFs"
        lowLabel="Pdfs"
      />
    </div>
  )}

  {/* Videos */}
  {videos && (
    <div>
      <DashboardCard
        Icon={BiSolidVideos}
        dataLength={videos}
        TopLabel="Videos"
        lowLabel="Videos"
      />
    </div>
  )}

  {/* Payments */}
  {payments && (
    <div>
      <DashboardCard
        Icon={MdPayments}
        dataLength={payments}
        TopLabel="Payments"
        lowLabel="RWF"
      />
    </div>
  )}

  {/* Questions */}
  {questions && (
    <div>
      <DashboardCard
        Icon={BsFillQuestionSquareFill}
        dataLength={questions}
        TopLabel="Questions"
        lowLabel="Questions"
      />
    </div>
  )}
</div>

{/* Single Payment Analytics Card below the grid */}
{analytics && <PaymentAnalyticsCard analytics={analytics} />}

    </>
  );
};

export default DashboardContent;
