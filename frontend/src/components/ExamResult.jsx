/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { savePerformance } from "../redux/api-calls/performance";

const ExamResult = ({ userAnswers, questions, onReattempt, onRepeat }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const submittedRef = useRef(false);

//   // Calculate score and percentage
//   const score = userAnswers.reduce((acc, answer, index) => {
//   return answer !== null && questions[index].options[answer].is_correct
//     ? acc + 1
//     : acc;
// }, 0);
const score = userAnswers.reduce((acc, answer, index) => {
  if (answer !== null && questions[index]?.options?.[answer]?.is_correct) {
    return acc + 1;
  }
  return acc;
}, 0);

  const percentage = ((score / questions.length) * 100).toFixed(2);

  // Determine pass/fail status
  const passThreshold = 60;
  const passOrFail =
    percentage >= passThreshold ? t("ExamResult.Pass") : t("ExamResult.Fail");
  const percentageClass =
    percentage >= passThreshold ? "bg-green-500" : "bg-red-500";

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const token = Cookies.get("jwt");
    if (token) {
      const performanceData = {
        examName: `EX-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`,
        marks: percentage,
        dateTaken: new Date().toISOString(),
      };
      savePerformance(token, performanceData, dispatch);
    }
  }, [percentage, dispatch]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="bg-white container mx-auto p-6 rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-900">
          {t("ExamResult.YourScore")}
        </h2>
        <Link
          to="/user-dashboard"
          onClick={() => window.location.reload()}
          className="bg-primary-700 hover:bg-primary-600 text-white font-bold p-2 px-4 rounded-lg text-center"
        >
          {t("ExamResult.GoBack")}
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-lg">
            {t("ExamResult.CorrectQuestions")}{" "}
            <span className="font-semibold text-green-500">
              {score}/{questions.length}
            </span>
          </p>
          <p className="text-lg">
            {t("ExamResult.IncorrectQuestions")}{" "}
            <span className="font-semibold text-red-500">
              {questions.length - score}/{questions.length}
            </span>
          </p>
          <p className="text-lg">
            {t("ExamResult.Conclusion")}:{" "}
            <span className="font-semibold">{passOrFail}</span>
          </p>
        </div>
        <div
          className={`${percentageClass} text-white font-bold text-lg py-2 px-4 rounded-lg`}
        >
          {percentage}%
        </div>
      </div>

      <section>
        <h1 className="text-xl font-bold mb-4 text-primary-900">
          {t("ExamResult.YourAnswers")}
        </h1>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="text-lg">
              <strong>
                {t("ExamResult.Question")} {index + 1}:
              </strong>{" "}
              {question.question.description || question.question}
              {userAnswers[index] === null ? (
                <span className="text-red-500 ml-2">&#10007;</span>
              ) : userAnswers[index] ===
                question.options.findIndex((option) => option.is_correct) ? (
                <span className="text-green-500 ml-2">&#10003;</span>
              ) : (
                <span className="text-red-500 ml-2">&#10007;</span>
              )}
            </p>

            {question.question.imageURLs &&
              renderQuestionImage(question.question.imageURLs)}

            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={
                  option.is_correct
                    ? "text-green-500 font-semibold"
                    : userAnswers[index] === optionIndex
                    ? "text-red-500 line-through font-bold"
                    : "text-gray-700 font-bold"
                }
              >
                <div className="flex gap-4 mt-4">
                  {String.fromCharCode(65 + optionIndex)}:
                  {option.optionImageURL && (
                    <img
                      className="object-contain h-[70px] w-[70px]"
                      src={option.optionImageURL}
                      alt={`option-${optionIndex}`}
                    />
                  )}
                </div>
                {option.optionText || option.option}
                {option.is_correct && userAnswers[index] === optionIndex && (
                  <span className="text-green-500 ml-2">&#10003;</span>
                )}
                {!option.is_correct && userAnswers[index] === optionIndex && (
                  <span className="text-red-500 ml-2">&#10007;</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      <div className="flex space-x-4 items-center mt-4">
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded"
          onClick={onReattempt}
        >
          {t("ExamResult.RetakeTest")}
        </button>

        <button
          className="bg-primary-600 text-white px-4 py-2 rounded"
          onClick={onRepeat}
        >
          {t("ExamResult.RepeatQuestions")}
        </button>
      </div>
    </div>
  );
};

const renderQuestionImage = (imageURLs) => (
  <div className="flex space-x-5 mb-5">
    {imageURLs.map((imageURL, imageIndex) => (
      <img
        key={imageIndex}
        src={imageURL}
        alt={`question-image-${imageIndex}`}
        className="h-[150px] w-[140px] rounded-md object-contain"
      />
    ))}
  </div>
);

export default ExamResult;
