/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import usePagination from "../../../hooks/usePagination";
import TableComponent from "../../../components/Dashboard/TableComponent";
import ModalContainer from "../../ModalContainer";
import { approveOrRejectPayment } from "../../../redux/api-calls/payment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Pagination from "../../Pagination";
import { Button } from "flowbite-react";

const PaymentContent = ({ payments = [] }) => {
  const [allPayments, setAllPayments] = useState(
    Array.isArray(payments) ? [...payments] : []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  const token = Cookies.get("jwt");
  const dispatch = useDispatch();

  const filteredPayments = allPayments.filter((payment) => {
    const searchTermMatch =
      (payment.user?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (payment.user?.email?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const typeMatch =
      selectedType === "All" || payment.subscription_type === selectedType;
    return searchTermMatch && typeMatch;
  });

  const { nextPage, prevPage, currentItems, currentPage, totalPages } =
    usePagination(filteredPayments, 10);

  const userColumns = [
    { label: "Client Name" },
    { label: "Amount" },
    { label: "Payment Method" },
    { label: "Subscription Plan" },
    { label: "Subscription End" },
    { label: "Payment Status" },
    { label: "Paid At" },
    { label: "No.Exams Taken" },
    { label: "Approve / Reject" },
  ];

  const subscriptionTypes = [
    "All",
    "one-time",
    "two-exams",
    "five-exams",
    "weekly",
    "two-weekly",
    "monthly",
  ];

  const handleToggleApproval = (payment) => {
    setCurrentPayment(payment);
    setOpenConfirmModal(true);
  };

  const confirmApprovalToggle = async () => {
    if (!currentPayment) return;

    const newStatus = !currentPayment.paymentStatus;
    setOpenConfirmModal(false);

    try {
      await approveOrRejectPayment(
        token,
        currentPayment._id,
        newStatus,
        dispatch
      );

      // Update payment status in the local state
      setAllPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === currentPayment._id
            ? { ...payment, paymentStatus: newStatus }
            : payment
        )
      );

      toast.success(
        newStatus
          ? "Payment approved successfully!"
          : "Payment rejected successfully!"
      );
    } catch (error) {
      toast.error("Failed to update payment status.");
    }
  };

  // Clean, reusable helper to compute status badge for a payment
  const getPaymentStatus = (payment) => {
    const now = new Date();
    const subscriptionEnd = payment.subscriptionEnd
      ? new Date(payment.subscriptionEnd)
      : null;

    const attemptedExams = Number(payment.attemptedExams) || 0;
    const hasAttempts = attemptedExams > 0;

    // Only these subscription types are exam-limited
    const examLimits = {
      "two-exams": 2,
      "five-exams": 5,
    };

    const maxExams =
      typeof payment.subscription_type === "string"
        ? examLimits[payment.subscription_type] ?? null
        : null;

    // Determine payment presence: either explicitly approved OR there's evidence of attempts
    const isPaid = payment.paymentStatus === true || hasAttempts;

    // If explicitly unpaid and there are no attempts, show Unpaid
    if (payment.paymentStatus === false && !hasAttempts) {
      return { status: "Unpaid", color: "bg-yellow-400 text-black" };
    }

    // If there's a subscriptionEnd, decide by date only (time-based plans)
    if (subscriptionEnd) {
      return subscriptionEnd > now
        ? { status: "Active", color: "bg-green-500 text-white" }
        : { status: "Expired", color: "bg-red-500 text-white" };
    }

    // If exam-limited, use attemptedExams vs the limit
    if (maxExams !== null) {
      return attemptedExams < maxExams
        ? { status: "Active", color: "bg-green-500 text-white" }
        : { status: "Expired", color: "bg-red-500 text-white" };
    }

    // Fallback: treat as active for non-expiring, non-exam-limited paid cases
    return isPaid
      ? { status: "Active", color: "bg-green-500 text-white" }
      : { status: "Unpaid", color: "bg-yellow-400 text-black" };
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start gap-4 items-center mb-2">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          {subscriptionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <TableComponent columns={userColumns}>
        {currentItems?.map((payment) => (
          <tr key={payment._id}>
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.user?.name}
            </td>
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.amount}
            </td>
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.paymentMethod}
            </td>
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.subscription_type}
            </td>
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.subscriptionEnd
                ? new Date(payment.subscriptionEnd).toLocaleDateString() +
                  " " +
                  new Date(payment.subscriptionEnd).toLocaleTimeString()
                : "Exam-based"}
            </td>

            <td className="px-3 py-4 text-start whitespace-nowrap">
              {(() => {
                const { status, color } = getPaymentStatus(payment);
                return (
                  <span className={`px-2 py-1 rounded-md ${color}`}>
                    {status}
                  </span>
                );
              })()}
            </td>
            {/* paid at date with hours */}
            <td className="px-3 py-4 text-start whitespace-nowrap">
              {new Date(payment.createdAt).toLocaleDateString() +
                " " +
                new Date(payment.createdAt).toLocaleTimeString()}
            </td>

            <td className="px-3 py-4 text-start whitespace-nowrap">
              {payment.attemptedExams}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              {payment.paymentMethod === "CARD" ? (
                <button
                  onClick={() => handleToggleApproval(payment)}
                  className={`px-3 py-1 rounded-md text-white transition-colors duration-300 ${
                    payment.paymentStatus
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {payment.paymentStatus ? "Reject" : "Approve"}
                </button>
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
      />

      {/* Confirmation Modal */}
      <ModalContainer
        show={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        popup
      >
        <div className="text-center mt-2">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-5 text-base font-normal text-gray-500">
            Are you sure you want to{" "}
            {currentPayment?.paymentStatus ? "reject" : "approve"} this payment?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={confirmApprovalToggle}>
              Yes, I&apos;m sure
            </Button>
            <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </ModalContainer>
      <Toaster />
    </div>
  );
};

export default PaymentContent;
