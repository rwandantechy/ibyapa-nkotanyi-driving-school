import { useState, useEffect } from "react";
import { useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { Spinner} from "flowbite-react";
import Navbar from "../components/Navbar";
import ExamResult from "../components/ExamResult";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestions } from "../redux/api-calls/questions";
import { clearPaymentError } from "../redux/reducers/questionsReducer";
import { useTranslation } from "react-i18next";

const ExamsPage = () => {
  const { t } = useTranslation();
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);
  const dispatch = useDispatch();
  const {
    questions: myQuestions,
    loading,
    error,
  } = useSelector((state) => state.questions);

  const [repeatQuestions, setRepeatQuestions] = useState(false);

  const fetchQuestions = useCallback(() => {
    const userLang = decoded?.lang || "rw";
    getAllQuestions(token, dispatch, userLang)
      .then(() => setQuestionsFetched(true))
      .catch((error) => console.error("Error fetching questions:", error));
  }, [token, dispatch, decoded]);

  localStorage.setItem("questions", JSON.stringify(myQuestions.data));
  const questions = repeatQuestions
    ? JSON.parse(localStorage.getItem("questions"))
    : myQuestions.data;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(questions?.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [startExam, setStartExam] = useState(false);
  const [questionsFetched, setQuestionsFetched] = useState(false);

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleOptionSelect = (optionIndex) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  };

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");

    if (storedQuestions) {
      setRepeatQuestions(false);
      setQuestionsFetched(true);
    } else {
      fetchQuestions();
    }
  }, [fetchQuestions]);

  const handleSubmit = useCallback(() => {3
    if (!submitted) {
      setSubmitted(true);
    }
  }, [submitted]);
  const numbers = Array.from(
    { length: questions?.length },
    (_, index) => index + 1
  );

  const onReattempt = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setCurrentQuestion(0);
    setTimeLeft(20 * 60);
    setQuestionsFetched(false);
    fetchQuestions();
  };

  const handleRepeatQuestions = () => {
    setRepeatQuestions(true);
    setUserAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setCurrentQuestion(0);
    setTimeLeft(20 * 60);
    setQuestionsFetched(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    if (startExam && questionsFetched) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Clear the timer when time runs out
      if (timeLeft === 0) {
        clearTimeout(timer);
        if (!submitted) {
          handleSubmit();
        }
      }

      return () => clearTimeout(timer);
    }
  }, [timeLeft, startExam, questionsFetched, submitted, handleSubmit]);
  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestionsFetched(true);
      setRepeatQuestions(false);
    } else {
      fetchQuestions();
    }
  }, [fetchQuestions]);

  useEffect(() => {
    dispatch(clearPaymentError());
  }, [dispatch]);

  if (!token && decoded?.role !== "user") {
    return <Navigate to="/signin" />;
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center mt-16 space-x-8">
          <span className="text-xl font-semibold">
            {t("ExamsPage.Loading")}
          </span>

          <Spinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full">
            {/* Modern Card Design */}
            <div className="bg-white rounded-2xl shadow-xl border border-yellow-200 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 px-6 py-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="bg-yellow-500/20 rounded-full p-2">
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-yellow-800 font-bold text-lg">{t("ExamsPage.NoSubscription")}</h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 py-8 text-center">
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {error.response.data
                    ? t("ExamsPage.PaymentError")
                    : error.message}
                </p>
                
                <Link
                  to="/payment"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  {t("ExamsPage.PaymentErrorMessage")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col space-y-4">
      <Navbar />
      {submitted ? (
        <ExamResult
          userAnswers={userAnswers}
          questions={questions}
          onReattempt={onReattempt}
          onRepeat={handleRepeatQuestions}
        />
      ) : startExam ? (
        <section className="bg-white container mx-auto p-4">
          <div className="flex flex-col max-w-screen-xl mx-auto gap-4">
            <div className="flex flex-wrap gap-2">
              {numbers.map((number, index) => (
                <div
                  key={index}
                  className={`border px-2 py-1 rounded-md w-10 h-10 flex items-center justify-center cursor-pointer ${
                    index === currentQuestion
                      ? "bg-primary-900 text-white"
                      : userAnswers[index] != null
                      ? "bg-primary-400 text-gray-700"
                      : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {number}
                </div>
              ))}
              <div
                className={`p-4 text-xl text-center rounded-lg shadow-lg ${
                  timeLeft < 60
                    ? "text-red-600 bg-red-100"
                    : "text-primary-900 bg-gray-50"
                } transition-all duration-300 ease-in-out`}
              >
                <span className="block font-semibold mb-2 uppercase tracking-wider text-gray-500">
                  {t("ExamsPage.RemainingTime")}
                </span>
                <span
                  className={`font-extrabold text-4xl ${
                    timeLeft < 60 ? "text-red-700" : "text-primary-800"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <h3 className="text-xl font-bold mb-4">
                {t("ExamsPage.Question")} {currentQuestion + 1}:{" "}
              </h3>
              <p className="mb-4 font-semibold">
                {questions[currentQuestion].question.description
                  ? questions[currentQuestion].question.description
                  : questions[currentQuestion].question}
              </p>
              {questions[currentQuestion].question.imageURLs && (
                <div className="flex flex-col gap-4 justify-center items-center md:flex-row md:justify-start">
                  {questions[currentQuestion].question.imageURLs?.map(
                    (imageURL, index) => (
                      <img
                        key={index}
                        src={imageURL}
                        alt="question"
                        className="w-full max-w-[260px] aspect-[4/3] md:max-w-[300px] p-4 rounded-lg object-contain shadow-sm "

                      />
                    )
                  )}
                </div>
              )}
              <div className="mb-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer mb-2 p-2 rounded`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option.optionImageURL ? (
                      <div className="flex items-center gap-4">
                        <span
                          className={`mr-2 uppercase font-bold ${
                            userAnswers[currentQuestion] === index
                              ? "bg-primary-800 text-white p-3 px-4 rounded-md mx-2"
                              : "bg-gray-200 text-gray-500 p-3 px-4 rounded-md mx-2"
                          }`}
                        >
                          {String.fromCharCode(97 + index)}
                        </span>
                        <img
                          className="w-20 h-20 object-contain rounded-md"
                          src={option.optionImageURL}
                          alt="option-image"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-row gap-4">
                        <span
                          className={`mr-2 uppercase font-bold ${
                            userAnswers[currentQuestion] === index
                              ? "bg-primary-800 text-white p-3 px-4 rounded-md mx-2"
                              : "bg-gray-200 text-gray-500 p-3 px-4 rounded-md mx-2"
                          }`}
                        >
                          {String.fromCharCode(97 + index)}
                        </span>
                        <span className="my-2">
                          {option.optionText
                            ? option.optionText
                            : option.option}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-primary-800 text-white px-4 py-2 rounded mr-2"
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                >
                  {t("ExamsPage.Previous")}
                </button>
                {currentQuestion < questions.length - 1 && (
                  <button
                    className="bg-primary-800 text-white px-4 py-2 rounded mr-2"
                    onClick={handleNext}
                  >
                    {t("ExamsPage.Next")}
                  </button>
                )}
                {currentQuestion === questions.length - 1 && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    {t("ExamsPage.Submit")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-primary-100 mx-auto p-6 flex flex-col space-y-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-center text-primary-900">
            {t("ExamsPage.StartExam")}
          </h2>
          <button
            className="bg-primary-700 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 w-3/4 sm:w-2/3 mx-auto"
            onClick={() => {
              if (!repeatQuestions && !myQuestions.data) {
                fetchQuestions();
              }
              setStartExam(true);
            }}
          >
            {t("ExamsPage.StartExamButton")}
          </button>
        </div>
      )}
    </section>
  );
};

export default ExamsPage;
