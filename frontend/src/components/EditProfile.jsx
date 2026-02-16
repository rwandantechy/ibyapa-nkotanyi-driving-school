/* eslint-disable react/prop-types */
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { updateUser } from "../redux/api-calls/user";
import { useTranslation } from "react-i18next";

const EditProfile = ({ onClose, setProfileEdited, user }) => {
  const { t } = useTranslation(); 
  const token = Cookies.get("jwt");
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const handleEditUser = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      phone: phone,
    };

    updateUser(user._id, data, token).then((res) => {
      if (res.status === 200) {
        toast.success(t("EditProfile.AccountUpdated"), {
          style: { padding: "10px" },
        });
        setProfileEdited(true);
      } else {
        toast.error(t("EditProfile.ErrorUpdating"), { style: { padding: "10px" } });
      }
    });
  };

  return (
    <div className="my-4 max-w-screen-lg mx-auto border px-8 py-6 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto bg-white">
      <form onSubmit={handleEditUser}>
        <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
          <div className="flex-shrink-0 mr-auto sm:py-3">
            <p className="font-medium">{t("EditProfile.AccountInformation")}</p>
            <p className="text-sm text-gray-600">{t("EditProfile.EditAccountInfo")}</p>
          </div>
          <button
            className="hidden mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200"
            onClick={onClose}
          >
            {t("EditProfile.Close")}
          </button>
          <button
            className="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white sm:inline focus:outline-none focus:ring hover:bg-blue-700"
            type="submit"
          >
            {t("EditProfile.Save")}
          </button>
        </div>
        <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="flex-shrink-0 w-32 font-medium">{t("EditProfile.Name")}</p>
          <input
            placeholder={t("EditProfile.NamePlaceholder")}
            className="w-full md:w-96 rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
          <p className="flex-shrink-0 w-32 font-medium">{t("EditProfile.Phone")}</p>
          <input
            placeholder={t("EditProfile.PhonePlaceholder")}
            className="w-full md:w-96 rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex justify-end py-4 sm:hidden">
          <button
            className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200"
            onClick={onClose}
          >
            {t("EditProfile.Cancel")}
          </button>
          <button
            className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700"
            type="submit"
          >
            {t("EditProfile.Save")}
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default EditProfile;
