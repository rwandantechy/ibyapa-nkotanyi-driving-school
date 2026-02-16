/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import TextInput from "./form/TextInput";
import SelectInput from "./form/SelectInput";  // Import the SelectInput component
import { updatePdf } from "../redux/api-calls/pdfs";

const EditPdf = ({ pdfInfo, setEditedPdf }) => {
  const [pdfTitle, setPdfTitle] = useState(pdfInfo.title);
  const [pdfLanguage, setPdfLanguage] = useState(pdfInfo.language || "en"); // Initialize with existing language or default to 'en'
  const dispatch = useDispatch();
  const token = Cookies.get("jwt");

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "rw", label: "Kinyarwanda" },
  ];

  const handleEditPdf = (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const file = e.target[1].files[0];
    const language = e.target[2].value;  // Get the selected language

    const data = {
      title,
      file: file === undefined ? "" : file,
      language,  // Include the language in the data
    };

    updatePdf(pdfInfo._id, data, token, dispatch).then((res) => {
      if (res) {
        e.target.reset();
        setPdfTitle("");
        setPdfLanguage("en");  // Reset the language to default
        setEditedPdf(true);
        toast.success("PDF Updated Successfully", {
          style: { padding: "15px" },
        });
      }
    });
  };

  return (
    <form className="flex flex-col space-y-3" onSubmit={handleEditPdf}>
      <TextInput
        labelText="PDF Title"
        name="title"
        value={pdfTitle}
        required
        handleChange={(e) => setPdfTitle(e.target.value)}
      />
      <TextInput labelText="File" name="file" type="file" />

      {/* Language Select Field */}
      <SelectInput
        labelText="Language"
        name="language"
        options={languageOptions}
        value={pdfLanguage}  // Controlled value for language select
        handleChange={(e) => setPdfLanguage(e.target.value)}  // Update language state on change
      />

      <button
        type="submit"
        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none"
      >
        Edit PDF
        {/* {loadingEdit && <Spinner className="color-white ml-2" size="sm" />} */}
      </button>
    </form>
  );
};

export default EditPdf;
