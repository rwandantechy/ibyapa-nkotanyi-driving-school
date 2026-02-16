/* eslint-disable react/prop-types */

const TableComponent = ({ columns, children }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-100">
        <tr className="">
          {columns.map((column, index) => (
            <th
              key={index}
              className="pl-3 text-left font-bold py-3  text-xs  text-black uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  );
};

export default TableComponent;
