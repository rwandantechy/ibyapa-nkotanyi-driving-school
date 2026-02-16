import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white ">
      <div className="max-w-screen-xl p-4 py-4 lg:py-12 md:p-8 lg:p-10 container w-full mx-auto">
        <hr className="my-2 border-gray-200 sm:mx-auto lg:my-2" />
        <div className="flex justify-between items-center mx-3 md:mx-0">
          <Link to="/">
            <img
              src="./images/logo.jpg"
              className="mr-3 h-[95px]"
              alt="Logo"
            />
          </Link>
          <ul className="flex justify-center mt-5 space-x-5">
            <li>
              <a
                href="https://www.tiktok.com/@teacher.nkotanyi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <FaTiktok className="w-6 h-6 my-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=100094279728817&mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <FaFacebookF className="w-6 h-6 my-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/teacher_nkotanyi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <FaInstagram className="w-6 h-6 my-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/inkotanyi_y"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <FaXTwitter className="w-6 h-6 my-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@nkotanyiplacide7440"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <FaYoutube className="w-6 h-6 my-auto" />
              </a>
            </li>
          </ul>
        </div>
        <div className="text-center py-4">
  <span className="block text-sm text-gray-500">
    © 2024 Nkotanyi Driving School. All rights reserved.
  </span>
  <span className="block text-sm text-gray-500">
    Developed By 
    <a
      href="https://github.com/Rwandantechy"
      className="ml-2 font-bold text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Innocent Niyonzima
    </a>
  </span>
 
</div>
      </div>
    </footer>
  );
};

export default Footer;
