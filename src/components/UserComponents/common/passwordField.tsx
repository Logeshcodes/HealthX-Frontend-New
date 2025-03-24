import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  name: string;
  placeholder: string;
  value?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  placeholder,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTimeout(() => {
      setShowPassword(false);
    }, 1000);
  };

  const eyeIcon = showPassword ? <Eye /> : <EyeOff />;

  return (
    <>
      <div>
        <label htmlFor={name} className="block text-black text-xs sm:text-sm font-semibold">
          {placeholder.toUpperCase()}
        </label>
      </div>

      <div className="flex items-center relative mt-1 sm:mt-2">
        <Field
          className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg font-medium border-2 text-black placeholder-gray-600 border-transparent text-xs sm:text-sm focus:outline-none focus:border-2 focus:outline bg-gray-100"
          placeholder={placeholder}
          id={name}
          type={showPassword ? "text" : "password"}
          value={value}
        />
        <div
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-900 cursor-pointer"
          onClick={togglePassword}>
          {eyeIcon}
        </div>
      </div>

      <ErrorMessage className="text-red-500 text-xs sm:text-sm mt-1" name={name} component="span" />
    </>
  );
};

export default PasswordField;