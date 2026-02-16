/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import Cookies from "js-cookie";
import TextInput from "./form/TextInput";
import { createVideo } from "../redux/api-calls/videos";
import { useState } from "react";
import toast from "react-hot-toast"; // Importing toast from react-hot-toast

const CreateVideo = ({ setCreatedVideo }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("jwt");
  const { loadingCreate } = useSelector((state) => state.videos);
  const [selectedLanguage, setSelectedLanguage] = useState("rw"); 

  const handleCreateVideo = (e) => {
    e.preventDefault();
    const newVideo = {
      title: e.target[0].value,
      video: e.target[1].value,
      language: selectedLanguage, 
    };

    createVideo(token, newVideo, dispatch).then((createdVideo) => {
      if (createdVideo) {
        e.target.reset();
        setCreatedVideo(true);
        toast.success("Video created successfully!"); // Show success toast
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleCreateVideo}>
      <TextInput labelText="Video Title" name="title" />
      <TextInput
        labelText="Video URL"
        name="url"
        placeholder="Video url with embed text"
      />
      {/* Language selection dropdown */}
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Select Language
        </label>
        <select
          id="language"
          name="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="rw">Kinyarwanda</option>
        </select>
      </div>
      <button
        type="submit"
        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none"
      >
        Create Video
        {loadingCreate && <Spinner className="color-white ml-2" size="sm" />}
      </button>
    </form>
  );
};

export default CreateVideo;
