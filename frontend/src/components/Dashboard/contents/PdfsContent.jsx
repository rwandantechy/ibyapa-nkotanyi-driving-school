/* eslint-disable react/prop-types */
import { useState } from "react";
import { Badge } from "flowbite-react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { Alert, Button } from "flowbite-react";
import {
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../../Pagination";
import TableComponent from "../TableComponent";
import usePagination from "../../../hooks/usePagination";
import { getAllPdfsAdmin, deletePdf } from "../../../redux/api-calls/pdfs";
import { convertDate } from "../../../utils/convertDate";
import CreatePdf from "../../CreatePdf";
import ModalContainer from "../../ModalContainer";
import EditPdf from "../../EditPdf";

const PdfsContent = ({ pdfs }) => {
  const [allPdfs, setAllPdfs] = useState(pdfs);
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.pdfs);

  const [editedPdf, setEditedPdf] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [updatedData, setUpdatedData] = useState(false);
  const [clcickedItem, setClickedItem] = useState(null);

  const filteredPdfs = allPdfs?.filter(
    (pdf) =>
      pdf.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { nextPage, prevPage, currentItems, currentPage, totalPages } =
    usePagination(filteredPdfs, 10);

  const columns = [
    { label: "Title" },
    { label: "File" },
    { label: "Date Created" },
  
    { label: "Language" },
    { label: "Actions" },
  ];

  const fetchPdfs = () => {
    getAllPdfsAdmin(token, dispatch).then((res) => {
      setAllPdfs(res.data);
    });
  };

  const handleDeletePDF = (id) => {
    deletePdf(id, token, dispatch).then((res) => {
      if (res.status === 200) {
        fetchPdfs();
        toast.success("PDF deleted successfully.", {
          style: {
            padding: "30px",
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
          placeholder="title,name..."
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setOpenModal(true)}
          className="text-white bg-primary-900 hover:bg-primary-800 outline-none focus:ring-blue-300 font-medium px-5 rounded-lg text-sm  py-2 text-center"
        >
          Add PDF
        </button>
      </div>
      <TableComponent columns={columns}>
        {currentItems?.map((pdf) => (
          <tr key={pdf._id}>
            <td className="px-6 py-4 whitespace-nowrap">{pdf.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-primary-800">
              <a href={pdf.file} target="_blank">
                {pdf.title.slice(0, 15)}***
              </a>
            </td>
            <td className="pxpayment-6 py-4 whitespace-nowrap">
              {convertDate(pdf.createdAt)}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap">
              {/* if the language is rw then  Kinyarwanda , if en then English , if fr is French */}
              {pdf.language === "rw" ? "Kinyarwanda" : pdf.language=== "en" ? "English" : "French"}

            </td>
            <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
              <Badge
                color="info"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(pdf);
                  setOpenEditModal(true);
                }}
              >
                Edit
              </Badge>

              <Badge
                color="failure"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(pdf);
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

      {/* Add PDF Modal */}
      <ModalContainer
        modalTitle="Create New PDF"
        modalSize="4xl"
        show={openModal}
        size="4xl"
        onClose={() => {
          setOpenModal(false);
          if (updatedData) {
            fetchPdfs();
            setUpdatedData(false);
          }
        }}
      >
        <div className="space-y-4 p-2">
          <CreatePdf setUpdatedData={setUpdatedData} />
        </div>
      </ModalContainer>

      {/* Edit PDF Modal */}
      <ModalContainer
        modalTitle="Edit PDF"
        modalSize="4xl"
        show={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          if (editedPdf) {
            fetchPdfs();
            setEditedPdf(false);
          }
        }}
      >
        <EditPdf pdfInfo={clcickedItem} setEditedPdf={setEditedPdf} />
      </ModalContainer>

      {/* Delete PDF Modal */}
      <ModalContainer
        modalSize="md"
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this PDF?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                handleDeletePDF(clcickedItem._id);
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

      <Toaster />
    </div>
  );
};

export default PdfsContent;
