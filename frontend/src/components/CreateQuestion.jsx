
/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import CheckBox from "./form/CheckBox";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/firebase";
import TextInput from "./form/TextInput";
import SelectInput from "./form/SelectInput";
import { createQuestion } from "../redux/api-calls/questions";

const CreateQuestion = ({ setCreatedQuestion }) => {
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const { loadingCreate } = useSelector((state) => state.questions);
  const [selectImageQuestionOption, setSelectImageQuestionOption] = useState(false);
  const [questionDescription, setQuestionDescription] = useState("");
  const [imageSelectedOption, setImageSelectedOption] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [isTrial, setIsTrial] = useState("");
  const [language, setLanguage] = useState("");
  const [questionImages, setQuestionImages] = useState([]);
  const [optionTexts, setOptionTexts] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [selectedValue, setSelectedValue] = useState("");

  const selectOptions = [
    { value: "option-1", label: "Option 1" },
    { value: "option-2", label: "Option 2" },
    { value: "option-3", label: "Option 3" },
    { value: "option-4", label: "Option 4" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "rw", label: "Kinyarwanda" },
  ];

  const freeTestOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const toggleImageSelection = (optionIndex) => {
    setImageSelectedOption((prevOptions) => ({
      ...prevOptions,
      [optionIndex]: !prevOptions[optionIndex],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "question") {
        setQuestionImages(files);
      } else if (name.startsWith("option-")) {
        const optionNum = name.split("-")[1];
        setImageSelectedOption((prevState) => ({
          ...prevState,
          [optionNum]: files[0],
        }));
      }
    } else {
      if (name === "isTrial") {
        setIsTrial(value);
      } else if (name === "language") {
        setLanguage(value);
      } else if (name === "questionDescription") {
        setQuestionDescription(value);
      } else if (name.startsWith("option-")) {
        const optionNum = name.split("-")[1];
        setOptionTexts((prevState) => ({ ...prevState, [optionNum]: value }));
      }
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Check if question description or image is provided
  if (!questionDescription.trim() && questionImages.length === 0) {
    toast.error("Please provide a question description or an image.");
    return;
  }

  // Check if the correct answer is selected
  if (!selectedValue) {
    toast.error("Please select the correct answer.");
    return;
  }

  // Check if free test option is selected
  if (!isTrial) {
    toast.error("Please specify if this is for a free test.");
    return;
  }

  // Check if language is selected
  if (!language) {
    toast.error("Please select the language.");
    return;
  }

  // Collect and validate options to ensure each has either text or an image
  const validOptions = [];
  for (let num of [1, 2, 3, 4]) {
    const optionText = optionTexts[num].trim();
    const optionFile = imageSelectedOption[num];

    if (optionText || optionFile) {
      validOptions.push({
        optionText,
        optionFile,
        is_correct: selectedValue === `option-${num}`,
      });
    } else {
      toast.error(`Option ${num} must have either text or an image.`);
      return; // Stop submission if an option is missing both text and image
    }
  }

  // Ensure there are at least two valid options
  if (validOptions.length < 2) {
    toast.error("At least two options (text or image) are required.");
    return;
  }

  // Proceed to upload images and create the question if all validations pass
  const questionImgUrls = questionImages.length > 0 ? await uploadQuestionImages(questionImages) : [];

  const question = {
    description: questionDescription,
    imageURLs: questionImgUrls,
    isTrial: isTrial.toLowerCase() === "yes",
    language,
  };

  const options = await Promise.all(
    validOptions.map(async (opt) => {
      const optionImageURL = opt.optionFile ? await uploadOptionImg(opt.optionFile) : null;
      return {
        optionText: opt.optionText,
        optionImageURL,
        is_correct: opt.is_correct,
      };
    })
  );

  const payload = { question, options };

  try {
    const createdQn = await createQuestion(payload, token, dispatch);
    if (createdQn) {
      e.target.reset();
      setCreatedQuestion(true);
      toast.success("Question created successfully.", {
        style: { padding: "15px" },
      });
    }
  } catch (error) {
    console.error("Error creating question:", error.response ? error.response.data : error.message);
    toast.error("Failed to create question.");
  }
};


  // Function to upload question images
  const uploadQuestionImages = async (files) => {
    let imgUrls = [];

    for (let img of files) {
      try {
        const imagesRef = storageRef(storage, `questions/${uuidv4()}`);
        const snapshot = await uploadBytes(imagesRef, img);
        const url = await getDownloadURL(snapshot.ref);
        imgUrls.push(url);
      } catch (error) {
        toast.error(`Failed to upload image: ${error.message}`);
      }
    }

    return imgUrls;
  };

  // Function to upload option images
  const uploadOptionImg = async (file) => {
    try {
      const imagesRef = storageRef(storage, `questions/${uuidv4()}`);
      const snapshot = await uploadBytes(imagesRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      toast.error(`Failed to upload option image: ${error.message}`);
      return null;
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="questionDescription"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Question
        </label>
        <div className="flex items-center mb-2">
          <CheckBox
            checkBoxLabel="Add Files"
            checked={selectImageQuestionOption}
            handleChange={() => setSelectImageQuestionOption(!selectImageQuestionOption)}
          />
        </div>

        <TextInput
          placeholder="Type your question here..."
          name="questionDescription"
          value={questionDescription}
          handleChange={handleChange}
        />

        {selectImageQuestionOption && (
          <TextInput
            type="file"
            multiple
            name="question"
            handleChange={handleChange}
          />
        )}
      </div>

      {[1, 2, 3, 4].map((num) => (
        <div key={num}>
          <label
            htmlFor={`option-${num}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Option {num}
          </label>
          <CheckBox
            checkBoxLabel="Image"
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
            <TextInput name={`option-${num}`} handleChange={handleChange} />
          )}
        </div>
      ))}

      <SelectInput
        labelText="Choose right Answer"
        name="selectedValue"
        options={selectOptions}
        value={selectedValue || ""}
        handleChange={(e) => setSelectedValue(e.target.value)}
      />

      <SelectInput
        labelText="Is this for a Free Test?"
        name="isTrial"
        options={freeTestOptions}
        value={isTrial || ""}
        handleChange={handleChange}
      />

      <SelectInput
        labelText="Choose Language"
        name="language"
        options={languageOptions}
        value={language || ""}
        handleChange={handleChange}
      />

      <button
        type="submit"
        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none"
      >
        Create Question
        {loadingCreate && <Spinner className="color-white ml-2" size="sm" />}
      </button>
    </form>
  );
};

export default CreateQuestion;
