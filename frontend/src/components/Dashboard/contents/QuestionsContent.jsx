/* eslint-disable react/prop-types */
import toast, { Toaster } from "react-hot-toast";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { Alert, Badge, Button } from "flowbite-react";
import Cookies from "js-cookie";
import { useState } from "react";
import {
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import usePagination from "../../../hooks/usePagination";
import { deleteQuestion } from "../../../redux/api-calls/questions";
import { convertDate } from "../../../utils/convertDate";
import { storage } from "../../../utils/firebase";
import CreateQuestion from "../../CreateQuestion";
import ModalContainer from "../../ModalContainer";
import Pagination from "../../Pagination";
import TableComponent from "../TableComponent";
import { getAdminQuestions } from "../../../redux/api-calls/questions";
import ViewQuestion from "../../ViewQuestion";
import EditQuestion from "../../EditQuestion";

const QuestionsContent = ({ questions }) => {
  const [allQuestions, setAllQuestions] = useState(questions);
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.questions);

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [createdQuestion, setCreatedQuestion] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [onViewModal, setOnViewModal] = useState(false);
  const [onEditQuestion, setOnEditQuestion] = useState(false);
  const [questionEdited, setEditedQuestion] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);

  const filteredQuestions = allQuestions?.filter((question) => {
    if (question.question.description) {
      return (
        question.question?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        question.uploadedBy?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    } else {
      return (
        question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.uploadedBy?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  });

  const { nextPage, prevPage, currentItems, currentPage, totalPages } =
    usePagination(filteredQuestions, 10);

  const columns = [
    { label: "Question" },
    { label: "Date" },
    { label: "uploadedBy" },
    { label: "Free Test" },
    { label: "Language" },
    { label: "Actions" },
  ];

  const fetchAllQuestions = () => {
    getAdminQuestions(token, dispatch).then((res) => {
      setAllQuestions(res.data);
    });
  };

  const handleDeleteQuestion = async (id) => {
    const questionToDelete = allQuestions.find(
      (question) => question._id === id
    );

    if (!questionToDelete) {
      console.error("Question not found with ID:", id);
      return;
    }

    if (questionToDelete.question.imageURLs.length > 0) {
      for (const url of questionToDelete.question.imageURLs) {
        const imgRef = storageRef(storage, url);
        try {
          await deleteObject(imgRef, url);
        } catch (error) {
          console.error("Error deleting image", url, error);
        }
      }
    }

    if (questionToDelete.options.length > 0) {
      for (const option of questionToDelete.options) {
        if (option.optionImageURL) {
          const imgRef = storageRef(storage, option.optionImageURL);
          try {
            await deleteObject(imgRef, option.optionImageURL);
          } catch (error) {
            console.error("Error deleting option image", option.optionImageURL);
          }
        }
      }
    }

    deleteQuestion(id, token).then((res) => {
      if (res.status === 200) {
        fetchAllQuestions();
        setOpenDeleteModal(false);
        toast.success("Question deleted successfully.", {
          style: {
            padding: "10px",
          },
        });
      }
    });
  };

  if (error) {
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">Info alert!</span> the error occured :{" "}
        {error.message}.
      </Alert>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="question , user..."
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="text-white bg-primary-900 hover:bg-primary-800 outline-none focus:ring-blue-300 font-medium px-5 rounded-lg text-sm  py-2 text-center"
          onClick={() => setOpenModal(true)}
        >
          Add Question
        </button>
      </div>

      <TableComponent columns={columns}>
        {currentItems?.map((question) => (
          <tr key={question._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              {question.question && typeof question.question === "string"
                ? question.question.length > 45
                  ? question.question.slice(0, 45) + "***"
                  : question.question
                : null}

              {question.question &&
              question.question.description &&
              typeof question.question.description === "string"
                ? question.question.description.length > 45
                  ? question.question.description.slice(0, 45) + "***"
                  : question.question.description
                : null}
            </td>
            <td className="pxpayment-6 py-4 whitespace-nowrap">
              {/*  */}
              {convertDate(question.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {question.uploadedBy?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {question.isTrial ? "Yes" : "No"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {question.language === "rw"
                ? "Kinyarwanda"
                : question.language === "en"
                ? "English"
                : "French"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
              <Badge
                color="info"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setOnViewModal(true);
                  setClickedItem(question);
                }}
              >
                View
              </Badge>

              <Badge
                color="indigo"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(question);
                  setOnEditQuestion(true);
                  console.log("Clicked Item:", question);
                }}
              >
                Edit
              </Badge>

              <Badge
                color="failure"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setOpenDeleteModal(true);
                  setClickedItem(question._id);
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

      {/* Create Question Container */}
      <ModalContainer
        modalSize="4xl"
        modalTitle="Create New Question"
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          if (createdQuestion) {
            fetchAllQuestions();
            setCreatedQuestion(false);
          }
        }}
      >
        <div className="space-y-4 p-2">
          <CreateQuestion setCreatedQuestion={setCreatedQuestion} />
        </div>
      </ModalContainer>

      {/* DELETE QUESTION */}
      <ModalContainer
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <div className="text-center mt-2">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-5 text-base font-normal text-gray-500">
            Are you sure you want to delete this QUESTION?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                handleDeleteQuestion(clickedItem);
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
      {/* VIEW QUESTION */}
      <ModalContainer
        show={onViewModal}
        modalSize="4xl"
        modalTitle="View Question Details"
        onClose={() => setOnViewModal(false)}
      >
        <ViewQuestion questionInfo={clickedItem} />
      </ModalContainer>

      {/* EDIT QUESTION */}
      <ModalContainer
        show={onEditQuestion}
        modalSize="4xl"
        modalTitle="Edit Question"
        onClose={() => {
          setOnEditQuestion(false);
          if (questionEdited) {
            fetchAllQuestions();
            setEditedQuestion(false);
          }
        }}
      >
        <EditQuestion
          questionInfo={clickedItem}
          setEditedQuestion={setEditedQuestion}
        />
      </ModalContainer>
      <Toaster />
    </div>
  );
};

export default QuestionsContent;
