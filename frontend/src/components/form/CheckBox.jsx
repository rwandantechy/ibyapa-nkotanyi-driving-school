/* eslint-disable react/prop-types */
const CheckBox = ({ checkBoxLabel, checked, handleChange }) => {
  return (
    <>
      <input
        type="checkbox"
        value={checked}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label
        htmlFor="default-checkbox"
        className="ms-2 text-sm font-medium text-gray-900"
      >
        {checkBoxLabel}
      </label>
    </>
  );
};

export default CheckBox;
