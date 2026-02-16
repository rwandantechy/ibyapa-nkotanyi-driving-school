/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const AuthenticationContainer = ({ heroImg, children }) => {
  return (
    <div className="flex flex-col md:flex-row max-w-screen max-h-screen">
      <div className="w-full md:w-2/5 bg-primary-50 hidden md:flex items-center justify-center h-screen">
        <img src={`./images/${heroImg}`} alt="" className="w-96 h-96" />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center py-20 ">
        <Link to="/">
          <img
            src="/images/logo.jpg"
            alt="Logo image"
            className="h-[90px] object-contain"
          />
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthenticationContainer;
