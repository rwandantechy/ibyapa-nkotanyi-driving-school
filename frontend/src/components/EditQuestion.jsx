
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/firebase";
import CheckBox from "./form/CheckBox";
import TextInput from "./form/TextInput";
import SelectInput from "./form/SelectInput";
import { updateQuestion } from "../redux/api-calls/questions";

const EditQuestion = ({ questionInfo, setEditedQuestion }) => {
  const dispatch = useDispatch();
  const { loadingEdit } = useSelector((state) => state.questions);

  const [isTrial, setIsTrial] = useState(questionInfo?.isTrial ? "Yes" : "No");
  const [language, setLanguage] = useState(questionInfo?.language || "rw");
  const [questionImages, setQuestionImages] = useState([]);
  const [questionText, setQuestionText] = useState(questionInfo?.question?.description || "");
  const [optionTexts, setOptionTexts] = useState({});
  const [imageSelectedOption, setImageSelectedOption] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (questionInfo) {
      const initializedOptionTexts = questionInfo.options.reduce(
        (acc, option, index) => {
          acc[index + 1] = option.optionText || "";
          return acc;
        },
        {}
      );
      setOptionTexts(initializedOptionTexts);
      const correctOptionIndex = questionInfo.options.findIndex(
        (opt) => opt.is_correct
      );
      if (correctOptionIndex !== -1) {
        setSelectedValue(`option-${correctOptionIndex + 1}`);
      }
    }
  }, [questionInfo]);

  const toggleImageSelection = (optionIndex) => {
    setImageSelectedOption((prevOptions) => ({
      ...prevOptions,
      [optionIndex]: !prevOptions[optionIndex],
    }));

    // Clear text or image URL when switching selection
    if (!imageSelectedOption[optionIndex]) {
      // Switching to image, clear text
      setOptionTexts((prevTexts) => ({ ...prevTexts, [optionIndex]: "" }));
    } else {
      // Switching to text, clear image
      setImageSelectedOption((prevImages) => ({ ...prevImages, [optionIndex]: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "questionImages") {
        setQuestionImages(files);
      } else if (name.startsWith("option-")) {
        const optionNum = name.split("-")[1];
        setImageSelectedOption((prevState) => ({
          ...prevState,
          [optionNum]: files[0],
        }));
      }
    } else {
      if (name === "isTrial") setIsTrial(value);
      if (name === "language") setLanguage(value);
      if (name.startsWith("option-")) {
        const optionNum = name.split("-")[1];
        setOptionTexts((prevState) => ({
          ...prevState,
          [optionNum]: value,
        }));
      } else if (name === "questionText") {
        setQuestionText(value);
      }
    }
  };

  const uploadImage = async (file) => {
    try {
      const imagesRef = storageRef(storage, `questions/${uuidv4()}`);
      const snapshot = await uploadBytes(imagesRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Fallback to the existing description if questionText is empty
  const finalQuestionText = questionText.trim() || questionInfo.question.description;

  if (!finalQuestionText) {
    toast.error("Question description cannot be empty.");
    return;
  }

  // Prepare the payload for updating the question
  const payload = { question: {}, options: [] };

  // Handle question image(s)
  const hasImage = questionImages.length > 0;
  const questionImgUrls = hasImage
    ? await Promise.all(Array.from(questionImages).map(uploadImage))
    : questionInfo.question.imageURLs;

  // Set the question details in the payload
  payload.question.description = finalQuestionText;
  payload.question.imageURLs = questionImgUrls;

  // Include other fields if they differ from current values
  if (isTrial !== (questionInfo.isTrial ? "Yes" : "No")) {
    payload.question.isTrial = isTrial.toLowerCase() === "yes";
  }
  if (language !== questionInfo.language) {
    payload.question.language = language;
  }

  // Handle options - allow only text or image per option
  const modifiedOptions = await Promise.all(
    questionInfo.options.map(async (opt, index) => {
      const optionText = optionTexts[index + 1]?.trim();
      const optionFile = imageSelectedOption[index + 1];

      let optionImageURL = opt.optionImageURL; // Default to current image URL if no update
      if (optionFile instanceof File) {
        optionImageURL = await uploadImage(optionFile);
      }

      return {
        optionText: optionFile ? "" : optionText, // Clear text if using image
        optionImageURL: optionText ? null : optionImageURL, // Clear image if using text
        is_correct: selectedValue === `option-${index + 1}`,
      };
    })
  );

  payload.options = modifiedOptions;

  // Submit the update
  if (Object.keys(payload.question).length || payload.options.length) {
    try {
      const token = Cookies.get("jwt");
      const response = await dispatch(
        updateQuestion(questionInfo._id, payload, token)
      );
      if (response) {
        setEditedQuestion(true);
        toast.success("Question updated successfully.");
      }
    } catch (error) {
      toast.error("Failed to update question.");
    }
  } else {
    toast.error("No changes detected.");
  }
};

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Question Text */}
      <div>
        <label
          htmlFor="questionText"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Question Text
        </label>
        <TextInput
          placeholder="Type your question here..."
          name="questionText"
          value={questionText}
          handleChange={handleChange}
        />
      </div>

      {/* Question Image */}
      <div>
        <label
          htmlFor="questionImages"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Question Image
        </label>
        <TextInput
          type="file"
          multiple
          name="questionImages"
          handleChange={handleChange}
        />
      </div>

      {/* Options */}
      {[1, 2, 3, 4].map((num) => (
        <div key={num}>
          <label
            htmlFor={`option-${num}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Option {num}
          </label>
          <CheckBox
            checkBoxLabel={imageSelectedOption[num] ? "Use Text" : "Use Image"}
            checked={!!imageSelectedOption[num]}
            handleChange={() => toggleImageSelection(num)}
          />
          {imageSelectedOption[num] ? (
            <TextInput
              type="file"
              name={`option-${num}`}
              handleChange={handleChange}
            />
          ) : (
            <TextInput
              name={`option-${num}`}
              value={optionTexts[num] || ""}
              handleChange={handleChange}
            />
          )}
        </div>
      ))}

      {/* Answer, Trial, and Language Selections */}
      <SelectInput
        labelText="Choose Right Answer"
        name="selectedValue"
        options={[
          { value: "option-1", label: "Option 1" },
          { value: "option-2", label: "Option 2" },
          { value: "option-3", label: "Option 3" },
          { value: "option-4", label: "Option 4" },
        ]}
        value={selectedValue || ""}
        handleChange={(e) => setSelectedValue(e.target.value)}
      />

      <SelectInput
        labelText="Is this for a Free Test?"
        name="isTrial"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={isTrial || ""}
        handleChange={handleChange}
      />

      <SelectInput
        labelText="Choose Language"
        name="language"
        options={[
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
          { value: "rw", label: "Kinyarwanda" },
        ]}
        value={language || ""}
        handleChange={handleChange}
      />

      <button
        type="submit"
        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none"
      >
        Update Question{" "}
        {loadingEdit && <Spinner className="color-white ml-2" size="sm" />}
      </button>
    </form>
  );
};

export default EditQuestion;
