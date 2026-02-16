import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { passwordRegex, fullNameRegex, phoneNumberRegex } from "../utils/regex";
import { userSignup } from "../redux/api-calls/user";
import { useDispatch, useSelector } from "react-redux";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import AuthenticationContainer from "../components/AuthenticationContainer";
import Input from "../components/Input";
import { useTranslation } from 'react-i18next'; 
import Cookies from 'js-cookie';
const SignUpPage = () => {
  const { t } = useTranslation(); 
const [passwordError, setPasswordError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const { signupError, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
// get lang from cookie
const lang=Cookies.get("lang") ||"rw"


  const user = {
    name: e.target[0].value,
    phone: e.target[1].value,
    password: e.target[2].value,
    language: lang
  };

  console.log("the user is ", user)
  // Validate phone number
  if (!phoneNumberRegex.test(user.phone)) {
    setPhoneError(t('SignUpPage.PhoneError'));
    return;
  }

  // Validate name
  if (!fullNameRegex.test(user.name)) {
    setNameError(t('SignUpPage.NameError'));
    return;
  }

  // Validate password
  if (!passwordRegex.test(user.password)) {
    setPasswordError(t('SignUpPage.PasswordError'));
    return;
  }

  // Clear errors before attempting signup
  if (!passwordError && !nameError) {
    try {
      const response = await userSignup(user, dispatch);
      if (response.data) {
        e.target.reset();
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signup error:", error);
      signupError(t('SignUpPage.GenericError')); 
    }
  }
};

  return (
    <AuthenticationContainer heroImg="signup.svg">
      <div className="w-4/5">
        <form
          className="flex flex-col space-y-3 py-2 w-full md:w-4/5 h-4/5 gap-2"
          onSubmit={handleSubmit}
        >
          {signupError && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">
                {signupError.response.data
                  ? signupError.response.data.message
                  : signupError.message}
              </span>
            </Alert>
          )}

          <Input
            focusFn={() => setNameError(null)}
            labelText={t('SignUpPage.NameLabel')}
            required
            placeholder={t('SignUpPage.NamePlaceholder')}
            error={nameError}
          />
          <Input
            focusFn={() => setPhoneError(null)}
            labelText={t('SignUpPage.PhoneLabel')}
            required
            placeholder={t('SignUpPage.PhonePlaceholder')}
            error={phoneError}
          />
          <Input
            focusFn={() => setPasswordError(null)}
            inputType="password"
            labelText={t('SignUpPage.PasswordLabel')}
            TextInputType="password"
            required
            placeholder={t('SignUpPage.PasswordPlaceholder')}
            error={passwordError}
          />

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium w-[170px] px-5 rounded-lg text-sm  py-2 text-center my-3 flex space-x-2 items-center"
            >
              <span>{t('SignUpPage.SubmitButton')}</span>
              {loading && <Spinner className="color-white" size="sm" />}
            </button>

            <div className="text-md mt-5">
              {t('SignUpPage.HasAccount')}
              <Link
                to="/signin"
                className="pl-2 cursor-pointer text-primary-700 hover:text-primary-600"
              >
                {t('SignUpPage.SignInLink')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthenticationContainer>
  );
};

export default SignUpPage;