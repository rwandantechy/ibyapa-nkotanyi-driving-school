/* eslint-disable react/prop-types */
import LabelText from "./LabelText";
const TextArea = ({ rows, placeholder, labelText }) => {
  return (
    <>
      {labelText && <LabelText text={labelText} />}
      <textarea
        rows={rows ? rows : "3"}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        placeholder={placeholder}
        required
      ></textarea>
    </>
  );
};

export default TextArea;
