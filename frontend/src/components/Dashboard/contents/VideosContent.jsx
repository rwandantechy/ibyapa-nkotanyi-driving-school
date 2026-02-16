/* eslint-disable react/prop-types */
import { useState } from "react";
import { Alert, Modal, Badge, Button } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { HiInformationCircle, HiOutlineExclamationCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideosAdmin, deleteVideo } from "../../../redux/api-calls/videos";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../Pagination";
import TableComponent from "../TableComponent";
import { convertDate } from "../../../utils/convertDate";
import CreateVideo from "../../CreateVideo";
import ModalContainer from "../../ModalContainer";
import EditVideo from "../../EditVideo";

const VideosContent = ({ videos }) => {
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.videos);

  const [allVideos, setAllVideos] = useState(videos);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [onOpenEditModal, setOnOpenEditModal] = useState(false);
  const [createdVideo, setCreatedVideo] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [videoEdited, setVideoEdited] = useState(false);

  const filteredVideos = allVideos?.filter(
    (video) =>
      video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { nextPage, prevPage, currentItems, currentPage, totalPages } = usePagination(filteredVideos, 10);

  const columns = [
    { label: "Title" },
    { label: "Video" },
    { label: "Date " },
  
    { label: "Language" },
    { label: "Created By" },
    { label: "Actions" },
  ];

  const fetchVideos = () => {
    getAllVideosAdmin(token, dispatch).then((res) => {
      setAllVideos(res.data);
    });
  };

  const handleDeleteVideo = (id) => {
    deleteVideo(id, token).then((res) => {
      if (res.status === 200) {
        setOpenDeleteModal(false);
        fetchVideos();
        toast.success("Video deleted successfully", {
          style: { padding: "15px" },
        });
      }
    });
  };

  if (error) {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">Info alert!</span> The error occurred: {error.message}.
      </Alert>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Search by title, name ..."
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="text-white bg-primary-900 hover:bg-primary-800 outline-none focus:ring-blue-300 font-medium px-5 rounded-lg text-sm  py-2 text-center"
          onClick={() => setOpenModal(true)}
        >
          Add Video
        </button>
      </div>
      <TableComponent columns={columns}>
        {currentItems?.map((video) => (
          <tr key={video._id}>
            <td className="px-6 py-4 whitespace-nowrap">{video.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-primary-800">
              <a href={video.video} target="_blank" rel="noopener noreferrer">
                {video.title.slice(0, 20)}***
              </a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {convertDate(video.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {video.language==="rw" ? "Kinyarwanda" : video.language==="en" ? "English" : "French"}

            </td>
            <td className="px-6 py-4 whitespace-nowrap">{video.user?.name}</td>
            <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
              <Badge
                color="indigo"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(video);
                  setOnOpenEditModal(true);
                }}
              >
                Edit
              </Badge>

              <Badge
                color="failure"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(video._id);
                  setOpenDeleteModal(true);
                }}
              >
                Delete
              </Badge>
            </td>
          </tr>
        ))}
      </TableComponent>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
      />

      {/* CREATE VIDEO */}
      <Modal
        show={openModal}
        size="4xl"
        onClose={() => {
          setOpenModal(false);
          if (createdVideo) {
            fetchVideos();
            setCreatedVideo(false);
          }
        }}
      >
        <Modal.Header>Create New Video</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 p-2">
            <CreateVideo setCreatedVideo={setCreatedVideo} />
          </div>
        </Modal.Body>
      </Modal>

      {/* DELETE VIDEO */}
      <ModalContainer
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <div className="text-center mt-2">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this video?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                handleDeleteVideo(clickedItem);
                setOpenDeleteModal(false);
              }}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </ModalContainer>

      {/* EDIT VIDEO */}
      <ModalContainer
        modalTitle="Edit Video"
        modalSize="3xl"
        show={onOpenEditModal}
        onClose={() => {
          setOnOpenEditModal(false);
          if (videoEdited) {
            fetchVideos();
            setVideoEdited(false);
          }
        }}
      >
        <EditVideo videoInfo={clickedItem} setVideoEdited={setVideoEdited} />
      </ModalContainer>

      <Toaster />
    </div>
  );
};

export default VideosContent;
