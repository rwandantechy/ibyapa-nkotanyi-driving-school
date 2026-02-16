const AccountContent = () => {
  return (
    <div
      className="flex-1 bg-white overflow-y-aut h-full scrollbar-hide p-4 "
    >
      <h1
        className="
    text-2xl p-4 font-semibold text-gray-800
    "
      >
        AccountContent
      </h1>
      <div className="p-4 bg-red-500">
        <div
          className="flex items-center justify-between
      "
        >
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              I found out that this page is not necessary to you as an admin.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountContent;
