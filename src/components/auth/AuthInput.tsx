import React from "react";

interface AuthInputProps {
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthInput = ({ type, placeholder, onChange }: AuthInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full max-w-md p-2 my-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-300 placeholder:font-light"
    />
  );
};