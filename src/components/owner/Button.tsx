import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button = ({ text, ...props }: AuthButtonProps) => {
    return (
        <button
            {...props}
            className="items-center gap-2 max-w-md py-2 my-4 bg-green-500 text-white font-normal rounded-md  hover:bg-green-600 duration-300 transition"
        > 
            {text}
        </button>
    );
};