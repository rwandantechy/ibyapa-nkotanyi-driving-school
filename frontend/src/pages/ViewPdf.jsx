/* eslint-disable react/prop-types */
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import WaterMark from "../components/WaterMark";

const ViewPdf = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf"
  );

  const token = Cookies.get("jwt");
  const handleCopy = () => {
    alert("Copying content is disabled.");
    return false; // Prevent default behavior
  };

  useEffect(() => {
    if (location.state.pdfUrl) {
      setPdfUrl(location.state.pdfUrl);
    }
  }, [location.state]);

  if (!token) return <Navigate to="/signin" />;

  const renderPage = (props) => <WaterMark props={props} />;

  return (
    <div className="container max-w-screen-xl mx-auto">
      {/* Update the workerUrl to match your installed version of pdfjs-dist */}
     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">


        <div
          onCopy={handleCopy}
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            className="cursor-pointer flex justify-end px-4 py-2"
            onClick={() => navigate(-1)}
          >
            <IoClose className="text-xl md:text-4xl bg-primary-800 text-white rounded-md fixed z-50" />
          </div>

          <Viewer fileUrl={pdfUrl} renderPage={renderPage} />
        </div>
      </Worker>
    </div>
  );
};

export default ViewPdf;
