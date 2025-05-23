"use client";

import React, { useEffect, useState } from "react";

export default function Notify({ message, type }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 2, 0));
    }, 100);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`fixed top-24 right-4 z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 overflow-hidden`}
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center shrink-0 w-8 h-8 ${
          type === "success"
            ? "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200"
            : type === "error"
              ? "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200"
              : "text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200"
        } rounded-lg`}
      >
        {getIcon()}
        <span className="sr-only">Icon</span>
      </div>

      <div className="ms-3 text-sm font-normal">{message}</div>
      <div
        className={`absolute bottom-0 left-0 h-[4px] ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
              ? "bg-red-500"
              : "bg-orange-500"
        } transition-all duration-[100ms]`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
