/* eslint-disable react/prop-types */
import LabelText from "./LabelText";

const SelectInput = ({ labelText, name, options, value, handleChange }) => {
  return (
    <>
      {labelText && <LabelText text={labelText} />}
      <select
        required
        name={name}  
        value={value} 
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectInput;
