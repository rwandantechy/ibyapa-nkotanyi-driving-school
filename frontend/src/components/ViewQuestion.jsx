/* eslint-disable react/prop-types */
const ViewQuestion = ({ questionInfo }) => {
  console.log(questionInfo);
  return (
    <div className="flex flex-col space-y-3">
      <p className="mb-4">
        {questionInfo.question.description
          ? questionInfo.question.description
          : questionInfo.question}
      </p>
      {questionInfo.question.imageURLs && (
        <div className="flex space-x-4 mb-5">
          {questionInfo.question.imageURLs?.map((imageURL, index) => (
            <img
              key={index}
              src={imageURL}
              alt="question"
              className="h-[100px] w-[80px] rounded-md object-cover"
            />
          ))}
        </div>
      )}
      <div className="mb-4">
        {questionInfo.options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer mb-2 ${
              option.optionImageURL ? "" : "bg-gray-200"
            }  p-2 rounded flex items-center space-x-4`}
          >
            <span className="mr-2 uppercase font-bold">
              {String.fromCharCode(97 + index)}
            </span>
            {option.optionImageURL && (
              <img
                className="object-cover h-[80px] w-[80px]"
                src={option.optionImageURL}
              />
            )}
            {option.optionText ? option.optionText : option.option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewQuestion;
