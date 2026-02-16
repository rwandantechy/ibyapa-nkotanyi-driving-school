import { MdPayments } from "react-icons/md";
import { FaMoneyBillWave, FaLockOpen, FaHourglassHalf, FaCalendarDay, FaBolt, FaClock, FaChartLine, FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const PaymentAnalyticsCard = ({ analytics, lastUpdated }) => {
  if (!analytics) return null;
  return (
  <div className="w-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mt-10 font-sans" style={{ fontFamily: 'Inter, Poppins, Nunito, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MdPayments size={32} className="mr-3 text-white/90" />
          <h2 className="text-2xl font-bold text-white">Payment Analytics</h2>
        </div>
        {lastUpdated && (
          <div className="text-xs text-white/70">Last Updated: {lastUpdated}</div>
        )}
      </div>

      {/* Top Section: Key KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaMoneyBillWave className="mr-1 text-green-300" />Total Paid</span>
          <span className="text-3xl font-bold text-white">{analytics.total.sum.toLocaleString()} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.total.count} transactions</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaHourglassHalf className="mr-1 text-orange-300" />Unpaid</span>
          <span className="text-3xl font-bold text-white">{analytics.unpaid?.sum?.toLocaleString() || 0} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.unpaid?.count || 0} unpaid</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaBolt className="mr-1 text-indigo-200" />Average Payment</span>
          <span className="text-3xl font-bold text-white">{analytics.average.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base font-medium text-white/70">RWF</span></span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaChartLine className="mr-1 text-blue-200" />Avg Daily Payment</span>
          <span className="text-3xl font-bold text-white">{analytics.averageDailyPayment?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0} <span className="text-base font-medium text-white/70">RWF</span></span>
        </div>
      </div>

      {/* Middle Section: Payment Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaLockOpen className="mr-1 text-green-200" />Active</span>
          <span className="text-2xl font-bold text-white">{analytics.active.sum.toLocaleString()} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.active.count} active</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaHourglassHalf className="mr-1 text-gray-200" />Expired</span>
          <span className="text-2xl font-bold text-white">{analytics.expired.sum.toLocaleString()} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.expired.count} expired</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaCalendarDay className="mr-1 text-blue-200" />This Year</span>
          <span className="text-2xl font-bold text-white">{analytics.year.sum.toLocaleString()} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.year.count} this year</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="flex items-center text-sm text-white/80 mb-1"><FaCalendarDay className="mr-1 text-indigo-200" />Today</span>
          <span className="text-2xl font-bold text-white">{analytics.today.sum.toLocaleString()} <span className="text-base font-medium text-white/70">RWF</span></span>
          <span className="text-xs text-white/60">{analytics.today.count} today</span>
        </div>
      </div>

      {/* Bottom Section: Performance Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center text-sm text-white/80">
          <FaClock className="mr-1 text-indigo-200" />
          <span>Hourly Income Avg:</span>
          <span className="ml-2 text-lg font-bold text-white">{analytics.hourlyIncome?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0} <span className="text-base font-medium text-white/70">RWF</span></span>
        </div>
        {/* Optional: Daily Trend (placeholder) */}
        {/* <div className="flex items-center text-sm text-green-200 ml-6">
          <FaChartLine className="mr-1" />
          <span>Daily Trend: +3.2% </span>
          <span className="ml-1">📈</span>
        </div> */}
      </div>

      {/* Footer Note */}
      <div className="mt-4 flex items-center text-xs text-white/70 italic">
        <FaInfoCircle className="mr-1" />
        <span>Only paid transactions with at least one attempted exam are included. Active = not expired. Expired = expired by date or maxed exams.</span>
      </div>
    </div>
  );
};


PaymentAnalyticsCard.propTypes = {
  analytics: PropTypes.shape({
    total: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    active: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    expired: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    today: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    month: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    year: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
    hourlyIncome: PropTypes.number,
    average: PropTypes.number,
    averageDailyPayment: PropTypes.number,
    unpaid: PropTypes.shape({
      sum: PropTypes.number,
      count: PropTypes.number,
    }),
  }),
  lastUpdated: PropTypes.string,
};

export default PaymentAnalyticsCard;
