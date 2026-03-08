import React from "react";

interface AuthBoxProps {
    children: React.ReactNode;
}

export const AuthBox = ({ children }: AuthBoxProps) => {
    return (
        <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
            {children}
        </div>
    );
};