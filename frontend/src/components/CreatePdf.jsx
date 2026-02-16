/* eslint-disable react/prop-types */
import { Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./form/TextInput";
import SelectInput from "./form/SelectInput"; 
import { createPdf } from "../redux/api-calls/pdfs";

const CreatePdf = ({ setUpdatedData }) => {
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const { loadingCreate } = useSelector((state) => state.pdfs);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "rw", label: "Kinyarwanda" },
  ];

  const handleCreatePDF = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
   
    createPdf(data, token, dispatch).then((createdPdf) => {
      if (createdPdf) {
        e.target.reset();
        setUpdatedData(true);
        toast.success("PDF Created Successfully", {
          style: {
            padding: "20px",
          },
        });
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleCreatePDF}>
      <TextInput labelText="PDF Title" name="title" />
      <TextInput labelText="File" type="file" name="file" accept=".pdf" />

      {/* Language Select Field */}
      <SelectInput 
        labelText="Language for PDF" 
        name="language" 
        options={languageOptions}  
      />

      <button
        type="submit"
        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none"
      >
        Create PDF
        {loadingCreate && <Spinner className="color-white ml-2" size="sm" />}
      </button>
    </form>
  );
};

export default CreatePdf;
