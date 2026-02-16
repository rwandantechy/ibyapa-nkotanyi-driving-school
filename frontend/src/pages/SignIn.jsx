import { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/api-calls/user";
import { Spinner } from "flowbite-react";
import { passwordRegex, phoneNumberRegex } from "../utils/regex";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import AuthenticationContainer from "../components/AuthenticationContainer";
import Input from "../components/Input";
import { useTranslation } from "react-i18next"; 

const SignIn = () => {
  const { t } = useTranslation(); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signinError } = useSelector((state) => state.user);

  const savedInfo = Cookies.get("info") && JSON.parse(Cookies.get("info"));

  const [phone, setPhone] = useState(savedInfo ? savedInfo.firstInfo : "");
  const [password, setPassword] = useState(
    savedInfo ? savedInfo.secondInfo : ""
  );

  const [phoneError, setPhoneError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get("verified");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      account: e.target[0].value.toLowerCase(),
      password: e.target[1].value,
    };

    if (!phoneNumberRegex.test(newUser.account)) {
      setPhoneError(t("SignIn.PhoneError"));
      return;
    }

    if (!passwordRegex.test(newUser.password)) {
      setPasswordError(t("SignIn.PasswordError"));
      return;
    }

    if (!passwordError && !phoneError) {
      userLogin(newUser, dispatch).then((user) => {
        if (user.data) {
          e.target.reset();
          if (isCheckboxChecked)
            Cookies.set(
              "info",
              JSON.stringify({
                firstInfo: newUser.account,
                secondInfo: newUser.password,
              })
            );

          if (user.data.role === "user" && user.data.permissions.length === 0) {
            navigate("/user-dashboard");
          } else if (
            user.data.role === "user" &&
            user.data.permissions.length > 0
          ) {
            navigate("/dashboard");
          } else if (user.data.role === "admin") {
            navigate("/dashboard");
          }
        }
      });
    }
  };

  return (
    <>
      <AuthenticationContainer heroImg="signin-image.svg">
        <div className="w-4/5">
          <form
            className="flex flex-col space-y-3 py-2 w-full md:w-4/5 h-4/5 gap-2"
            onSubmit={handleSubmit}
          >
            {signinError && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">{t("SignIn.SigninError")}</span>
              </Alert>
            )}

            {isVerified && (
              <Alert color="success" icon={HiInformationCircle}>
                <span className="font-medium">
                  {t("SignIn.VerificationSuccess")}
                </span>
              </Alert>
            )}

            <Input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              focusFn={() => setPhoneError(null)}
              error={phoneError}
              labelText={t("SignIn.PhoneLabel")}
              inputType="text"
              placeholder={t("SignIn.PhonePlaceholder")}
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              focusFn={() => setPasswordError(null)}
              error={passwordError}
              labelText={t("SignIn.PasswordLabel")}
              inputType="password"
              TextInputType="password"
              placeholder={t("SignIn.PasswordPlaceholder")}
            />

            <div className="flex items-center gap-3">
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                {t("SignIn.RememberMe")}
              </label>
              <input
                type="checkbox"
                value={isCheckboxChecked}
                onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 max-w-[120px]  font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 text-nowrap"
            >
              <span>{t("SignIn.SubmitButton")}</span>
              {loading && <Spinner className="color-white" size="sm" />}
            </button>
          </form>
          <div className="flex space-x-2 mt-8 opacity-90">
            <p>{t("SignIn.NewUser")}</p>
            <Link
              to="/signup"
              className="underline text-primary-900 hover:text-primary-700 cursor-pointer"
            >
              {t("SignIn.SignUpLink")}
            </Link>
          </div>
          <div className="flex space-x-2 mt-8 opacity-90">
            <p>{t("SignIn.ForgotPassword")}</p>
            <Link
              to="/reset"
              className="underline text-primary-900 hover:text-primary-700 cursor-pointer"
            >
              {t("SignIn.ResetLink")}
            </Link>
          </div>
        </div>
      </AuthenticationContainer>
    </>
  );
};

export default SignIn;
