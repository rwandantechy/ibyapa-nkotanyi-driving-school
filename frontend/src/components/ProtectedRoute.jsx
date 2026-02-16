import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { checkTokenExpiry } from "../utils/checkTokenExpiry";
import { getSingleUser } from "../redux/api-calls/user";

const FullscreenSpinner = () => (
  <div className="w-screen h-screen flex items-center justify-center text-gray-600">
    <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary-600 rounded-full" />
  </div>
);

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt") || null;
  let decoded = null;
  try {
    if (token) decoded = jwtDecode(token);
  } catch (e) {
    decoded = null;
  }

  const initialStatus = !token
    ? "no-token"
    : !decoded || checkTokenExpiry(decoded.exp)
    ? "expired"
    : "checking"; // will verify with backend

  const [status, setStatus] = useState(initialStatus); // no-token | expired | checking | ok | revoked

  useEffect(() => {
    let mounted = true;
    if (status !== "checking") return () => { mounted = false; };
    (async () => {
      try {
        const res = await getSingleUser(decoded.id, token);
        if (!mounted) return;
        if (res && (res.status === 200 || res?.data)) {
          setStatus("ok");
        } else {
          setStatus("revoked");
        }
      } catch (e) {
        if (mounted) setStatus("revoked");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [status, decoded?.id, token]);

  if (status === "no-token" || status === "expired") {
    return <Navigate to="/signin" replace />;
  }
  if (status === "checking") {
    return <FullscreenSpinner />;
  }
  if (status === "revoked") {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectedRoute;
