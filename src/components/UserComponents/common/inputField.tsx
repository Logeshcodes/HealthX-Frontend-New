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
          <label htmlFor={name} className="block text-gray-800 text-xs sm:text-sm font-semibold mb-1">
            {label.toUpperCase()}
          </label>
          <div className="flex flex-col">
            <Field 
              className={`w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg ${type == "number" ? "no-arrows" : ""} font-medium border-2 border-transparent text-black text-xs sm:text-sm focus:outline-none focus:border-2 focus:outline bg-gray-100`}
              type={type}
              placeholder={placeholder}
              value={value}
              id={name}
            />
          </div>
          <ErrorMessage className="text-xs sm:text-sm font-semibold text-red-500 mt-1 ml-2 sm:ml-3" name={name} component="span" />
    </>
  );
};
export default InputField;