
/* eslint-disable react/prop-types */
import LabelText from "./LabelText";

const TextInput = ({
  labelText,
  type,
  placeholder,
  handleChange,
  ...props
}) => {
  const inputClassName =
    "block w-full text-sm text-gray-900 rounded-lg border border-gray-300 shadow-sm " +
    (type === "file"
      ? "mt-3"
      : "p-3 bg-gray-50 focus:ring-primary-500 focus:border-primary-500");
  return (
    <>
      {labelText && <LabelText text={labelText} />}
      <input
        type={type === "file" ? "file" : "text"}
        className={inputClassName}
        onChange={(e) => (handleChange ? handleChange(e) : e.target.value)}
        placeholder={placeholder ? placeholder : "Type here..."}
        {...props}
      />
    </>
  );
};

export default TextInput;
