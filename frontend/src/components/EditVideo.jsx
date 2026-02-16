/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import TextInput from "./form/TextInput";
import { useState } from "react";
import { editVideo } from "../redux/api-calls/videos";

const EditVideo = ({ videoInfo, setVideoEdited }) => {
  const token = Cookies.get("jwt");

  const [title, setTitle] = useState(videoInfo.title);
  const [videoUrl, setVideoUrl] = useState(videoInfo.video);
  const [selectedLanguage, setSelectedLanguage] = useState(videoInfo.language || "rw");

  const handleEditVideo = (e) => {
    e.preventDefault();
    const data = {
      title,
      video: videoUrl,
      language: selectedLanguage,
    };

    editVideo(token, data, videoInfo._id).then((res) => {
      if (res.status === 200) {
        setTitle("");
        setVideoUrl("");
        setSelectedLanguage("rw");
        setVideoEdited(true);
        toast.success("Video edited successfully!", {
          style: { padding: "15px" },
        });
      } else {
        toast.error("Failed to edit video. Please try again.", {
          style: { padding: "15px" },
        });
      }
    }).catch((error) => {
      toast.error("An error occurred: " + error.message, {
        style: { padding: "15px" },
      });
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleEditVideo}>
      <TextInput
        labelText="Video Title"
        name="title"
        value={title}
        handleChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        labelText="Video URL"
        name="url"
        placeholder="Video url with embed text"
        value={videoUrl}
        handleChange={(e) => setVideoUrl(e.target.value)}
      />
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
        Edit Video
      </button>
    </form>
  );
};

export default EditVideo;
