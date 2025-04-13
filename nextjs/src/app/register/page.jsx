"use client";

import { useState } from "react";
import Link from "next/link";
import Notify from "@/components/Notify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    visible: false,
    message: "",
    type: ""
  });

  const handleNotify = (message, type) => {
    setNotify({ visible: true, message, type });
    setTimeout(() => setNotify({ ...notify, visible: false }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      handleNotify(
        response.ok ? data.message : data.error || "Registrace selhala!",
        response.ok ? "success" : "error"
      );
      if (response.ok) {
      }
    } catch (err) {
      console.error(err);
      handleNotify("Chyba při odesílání požadavku", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {notify.visible && <Notify message={notify.message} type={notify.type} />}
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Registrace
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vytvořte si nový účet.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Uživatelské jméno
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
                  placeholder="Uživatelské jméno"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
                  placeholder="Emailová adresa"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Heslo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-1 sm:text-sm"
                  placeholder="Heslo"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V1a1 1 0 012 0v3a8 8 0 018 8h3a1 1 0 110 2h-3a8 8 0 01-8 8v3a1 1 0 11-2 0v-3a8 8 0 01-8-8H1a1 1 0 010-2h3z"
                    ></path>
                  </svg>
                </span>
              ) : (
                "Registrovat se"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Máte už účet?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Přihlásit se
          </Link>
        </p>
      </div>
    </div>
  );
}
