import React from "react";
import { Field, ErrorMessage } from "formik";

interface inputFieldProps {
  type: string;
  placeholder: string;
  value?: string;
  name: string;
  label: string;
 
}

const InputField: React.FC<inputFieldProps > = ({
  type,
  placeholder,
  value,
  name,
  label,
 
}) => {
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={name} className="block text-gray-800 text-xs font-semibold mb-2">

          {label.toUpperCase()}

        </label>

        <Field className={`w-full px-5 py-3 rounded-lg ${  type == "number" ? "no-arrows" : "" } font-medium border-2  "bg-gray-200 text-gray-600" border-transparent text-black  text-sm focus:outline-none focus:border-2 focus:outline bg-gray-100`}

          type={type}
          placeholder={placeholder}
          value={value}
          id={name}

        />
        <ErrorMessage className="text-xs font-semibold text-red-500 ml-3" name={name} component="span" />
        
      </div>
    </>
  );
};
export default InputField;