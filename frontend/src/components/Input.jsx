/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const Input = ({
  labelText,
  inputType,
  TextInputType,
  focusFn,
  error,
  ...props
}) => {
  const [choosedType, setChoosedType] = useState(inputType);

  const handleViewPassword = () => {
    setChoosedType((prev) => (prev === "password" ? "text" : "password"));
  };
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-lg">{labelText}</label>
      <div className="relative">
        <input
          type={choosedType ? choosedType : "text"}
          className="rounded-md bg-primary-50 w-full"
          onFocus={focusFn}
          {...props}
        />
        {TextInputType === "password" && (
          <div
            className="absolute right-2 top-3"
            onClick={() => handleViewPassword()}
          >
            {choosedType === "password" && (
              <FiEye size={20} className="text-gray-500 cursor-pointer" />
            )}
            {choosedType === "text" && (
              <FiEyeOff size={20} className="text-gray-500 cursor-pointer" />
            )}
          </div>
        )}
      </div>

      {error && <span className="py-1 px-3 text-sm text-red-700">{error}</span>}
    </div>
  );
};

export default Input;
