/* eslint-disable react/prop-types */
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Badge, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../Pagination";
import TableComponent from "../TableComponent";
import ModalContainer from "../../ModalContainer";
import { deleteUser } from "../../../redux/api-calls/user";
import { getAllUsers } from "../../../redux/api-calls/user";
import CheckBox from "../../form/CheckBox";
import { assignOrRevokePermissions } from "../../../redux/api-calls/user";

const UsersContent = ({ users }) => {
  const token = Cookies.get("jwt");
  const [allUsers] = useState(users);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [onPermissionsModal, setPermissionsModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [permissions, setPermissions] = useState([
    {
      permission_name: "create-video",
      permission_value: false,
      permission_expiry: "",
    },
    {
      permission_name: "upload-pdf",
      permission_value: false,
      permission_expiry: "",
    },
    {
      permission_name: "add-question",
      permission_value: false,
      permission_expiry: "",
    },
  ]);

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const filteredUsers = allUsers?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { nextPage, prevPage, currentItems, currentPage, totalPages } =
    usePagination(filteredUsers, 10);

  const handleDeleteUser = (id) => {
    deleteUser(id, token).then((res) => {
      if (res.status === 200) {
        getAllUsers(token, dispatch);
        toast.success("User deleted successfully", {
          style: { padding: "15px" },
        });
      }
    });
  };

  const handleView = (user) => setSelectedUser(user);

  const handleCheckboxChange = (index) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        permission_value: !updatedPermissions[index].permission_value,
      };
      return updatedPermissions;
    });
  };

  const handleExpiryChange = (index, value) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index].permission_expiry = value;
    setPermissions(updatedPermissions);
  };

  const handleGrantAndRevokePermissions = (e) => {
    e.preventDefault();
    // Handle submitting the permissions data
    assignOrRevokePermissions(
      clickedItem._id,
      { permissions: permissions },
      token
    ).then((res) => {
      if (res.status === 200) {
        toast.success("Permissions updated successfully", {
          style: { padding: "15px" },
        });
        setPermissionsModal(false);
      } else {
        toast.error("Error updating permissions", {
          style: { padding: "15px" },
        });
      }
    });
  };

  const userColumns = [
    { label: "Name" },
    { label: "Phone" },
    { label: "Default language" },
    { label: "Free Test Attempted" },
    { label: "Permissions" },
    { label: "Actions" },
    { label: "Joining Date" },
  ];

  return (
    <div className="overflow-x-auto">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableComponent columns={userColumns}>
        {currentItems?.map((user) => (
          <tr key={user._id}>
            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {user.phone ? user.phone : "None"}{" "}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {user.language
                ? user.language === "rw"
                  ? "Kinyarwanda"
                  : user.language === "en"
                  ? "English"
                  : "French"
                : "None"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {user.hasAttemptedTrial ? "Yes" : "No"}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              {user.permissions.length > 0
                ? user.permissions.map((permission, index) => (
                    <span key={index} className="block">
                      - {permission.permission_name}
                    </span>
                  ))
                : "None"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
              <Badge
                color="info"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => handleView(user)}
              >
                View
              </Badge>

              <Badge
                color="failure"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(user);
                  setOpenDeleteModal(true);
                }}
              >
                Delete
              </Badge>
              <Badge
                color="indigo"
                className="py-1 px-3 mr-2 cursor-pointer"
                onClick={() => {
                  setClickedItem(user);
                  setPermissionsModal(true);
                }}
              >
                Permissions
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(user.createdAt).toLocaleDateString()}
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

      {/* Modal for user details */}
      {selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Phone: {selectedUser.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for assigning permissions */}
      <ModalContainer
        show={onPermissionsModal}
        onClose={() => setPermissionsModal(false)}
        modalTitle="Assign/Revoke user Permissions"
        modalSize="3xl"
      >
        <form onSubmit={handleGrantAndRevokePermissions}>
          <div className="flex flex-col space-y-2">
            {permissions.map((permission, index) => (
              <div key={index} className="flex space-x-8 items-center">
                <CheckBox
                  checkBoxLabel={permission.permission_name}
                  checked={permission.permission_value}
                  handleChange={() => handleCheckboxChange(index)}
                />
                <input
                  type="datetime-local"
                  value={permission.permission_expiry}
                  onChange={(e) => handleExpiryChange(index, e.target.value)}
                  className="rounded-md py-0.5"
                />
              </div>
            ))}
            <button
              type="submit"
              className="text-white py-1 px-8 rounded-md bg-primary-900 self-end my-4 mx-4"
            >
              Save
            </button>
          </div>
        </form>
      </ModalContainer>

      {/* Delete User */}
      <ModalContainer
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <div className="text-center mt-2">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this USER?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                handleDeleteUser(clickedItem._id);
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

export default UsersContent;
