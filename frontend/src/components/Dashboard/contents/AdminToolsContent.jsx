import { useState, useEffect } from "react";
import {  FaExclamationTriangle, FaCog, FaShieldAlt } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { Button, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import { url } from "../../../constants/url";
import DashboardCard from "../DashboardCard";

const AdminToolsContent = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Payment Cleanup Functions
  const moveFailedPayments = async (minutes = 30) => {
    setLoading(true);
    try {
      const token = Cookies.get("jwt");
      const response = await fetch(`${url}/payment-cleanup/move-failed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`
        },
        body: JSON.stringify({ minutes })
      });

      const data = await response.json();
  // ...
      if (response.ok) {
        const moved = data.data?.moved ?? 0;
        const deleted = data.data?.deleted ?? 0;
  // ...
        toast.success(`Moved ${moved} failed payments, deleted ${deleted} from main database`);
        loadStats(); 
      } else {
        toast.error(data.message || "Failed to move failed payments");
      }
    } catch (error) {
      toast.error("Error moving failed payments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const moveExamExpiredPayments = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("jwt");
      const response = await fetch(`${url}/payment-cleanup/move-exam-expired`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`
        }
      });

      const data = await response.json();
  // ...
      if (response.ok) {
        const moved = data.data?.moved ?? 0;
        const deleted = data.data?.deleted ?? 0;
  // ...
        toast.success(`Moved ${moved} exam-expired payments, deleted ${deleted} from main database`);
        loadStats(); // Refresh stats
      } else {
        toast.error(data.message || "Failed to move exam-expired payments");
      }
    } catch (error) {
      toast.error("Error moving exam-expired payments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runCompleteCleanup = async (minutes = 30) => {
    setLoading(true);
    try {
      const token = Cookies.get("jwt");
      const response = await fetch(`${url}/payment-cleanup/run-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`
        },
        body: JSON.stringify({ minutes })
      });

      const data = await response.json();
  // ...
      if (response.ok) {
  // ...
        const moved = data.data?.total?.moved ?? 0;
        const deleted = data.data?.total?.deleted ?? 0;
  // ...
        toast.success(` Complete cleanup: ${moved} payments moved, ${deleted} deleted`);
        loadStats(); 
      } else {
        toast.error(data.message || "Failed to run complete cleanup");
      }
    } catch (error) {
      toast.error("Error running complete cleanup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = Cookies.get("jwt");
      const response = await fetch(`${url}/payment-cleanup/stats`, {
        headers: {
          "token": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadStats();

    // Poll stats every 30 seconds so frontend reflects backend changes made by cleanup jobs
    const interval = setInterval(() => {
      loadStats();
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh helper (optional button can call this)
  const refreshStats = () => loadStats();

  return (
    <div className="flex-1 bg-white overflow-y-auto h-full scrollbar-hide p-4">
      <Toaster />
      
      {/* Header */}
      <h1 className="text-2xl p-4 font-semibold text-gray-800">
        Admin Tools
      </h1>
      <div className="p-4 flex justify-end">
        <button
          onClick={refreshStats}
          className="text-sm bg-white border border-gray-200 rounded px-3 py-1 hover:bg-gray-50"
        >
          Refresh stats
        </button>
      </div>

      {/* Statistics Cards with responsive text */}
      {stats && (
        <div className="w-full flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mt-6">
          <div className="flex-1">
            <DashboardCard
              Icon={FaExclamationTriangle}
              dataLength={stats.unpaid}
              TopLabel="Unsuccessful payments"
              lowLabel="Unpaid"
            />
          </div>
          <div className="flex-1">
            <DashboardCard
              Icon={FaExclamationTriangle}
              dataLength={stats.expired}
              TopLabel="Expired subscriptions"
              lowLabel="Expired"
            />
          </div>
          <div className="flex-1">
            <DashboardCard
              className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-black"
              Icon={FaShieldAlt}
              dataLength={new Date(stats.timestamp).toLocaleDateString()}
              TopLabel="Last Updated"
              lowLabel="System"
            />
          </div>
        </div>
      )}

      {/* Payment Cleanup Tools */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Payment Cleanup Tools
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Move Failed Payments */}
          <div className="relative bg-orange-50 border border-orange-200 rounded-xl p-6 shadow transition-shadow hover:shadow-md">
            <FaExclamationTriangle className="absolute right-4 top-4 text-orange-200 text-5xl pointer-events-none select-none opacity-30" />
            <div className="flex items-center space-x-2 mb-3">
              <FaExclamationTriangle className="text-orange-500" />
              <h3 className="font-semibold text-gray-800">Archive Old Failed Payments</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Instantly archive failed payments that are older than 30 minutes.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => moveFailedPayments(30)}
                disabled={loading}
                color="warning"
                className="w-full"
                title="Archive failed payments older than 30 minutes."
              >
                {loading ? "Processing..." : "Archive Failed Payments"}
              </Button>
            </div>
          </div>

          {/* Move Exam-Expired Payments */}
          <div className="relative bg-red-50 border border-red-200 rounded-xl p-6 shadow transition-shadow hover:shadow-md">
            <FaExclamationTriangle className="absolute right-4 top-4 text-red-200 text-5xl pointer-events-none select-none opacity-30" />
            <div className="flex items-center space-x-2 mb-3">
              <FaExclamationTriangle className="text-red-500" />
              <h3 className="font-semibold text-gray-800">Archive Exam-Expired Payments</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Instantly archive payments that have reached their exam limits.
            </p>
            <Button
              onClick={moveExamExpiredPayments}
              disabled={loading}
              color="failure"
              className="w-full"
            >
              {loading ? "Processing..." : "Archive Exam-Expired Payments"}
            </Button>
          </div>

          {/* Complete Cleanup */}
          <div className="relative bg-blue-50 border border-blue-200 rounded-xl p-6 shadow transition-shadow hover:shadow-md">
            <FaCog className="absolute right-4 top-4 text-blue-200 text-5xl pointer-events-none select-none opacity-30" />
            <div className="flex items-center space-x-2 mb-3">
              <FaCog className="text-blue-500" />
              <h3 className="font-semibold text-gray-800">Full Cleanup</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Archive all failed and exam-expired payments in one click.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => runCompleteCleanup(30)}
                disabled={loading}
                color="info"
                className="w-full"
                title="Archive all failed and exam-expired payments."
              >
                {loading ? "Processing..." : "Archive All"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="p-4">
        <Alert color="info" icon={HiInformationCircle}>
          <div className="text-sm">
            <span className="font-medium">Cleanup Timeout:</span>
            <span className="ml-2">30 minutes (configurable)</span>
            <span className="mx-4 font-medium">Backup Collection:</span>
            <span className="ml-2">failedpayments</span>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default AdminToolsContent;
