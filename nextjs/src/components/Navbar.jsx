"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { GiCardPlay } from "react-icons/gi";

const NavBar = () => {
  const [opened, setOpened] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(() => router.pathname);

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);

  const toggleMenu = () => {
    setOpened(!opened);
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GiCardPlay
                className="h-8 w-8 text-indigo-600 dark:text-indigo-300"
                alt="Card Opener Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Kartičkový Svět!
              </span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={opened}
            >
              {opened ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/pack"
              className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                activeLink === "/pack"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : ""
              }`}
            >
              Balíčky
            </Link>
            <Link
              href="/collection"
              className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                activeLink === "/collection"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : ""
              }`}
            >
              Kolekce
            </Link>
            <Link
              href="/trade"
              className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                activeLink === "/trade"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : ""
              }`}
            >
              Směnárna
            </Link>
            <Link
              href="/stats"
              className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                activeLink === "/stats"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : ""
              }`}
            >
              Statistiky
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 flex items-center space-x-2 ${
                    activeLink === "/profile"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : ""
                  }`}
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span>Profil</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 px-4 text-indigo-600 hover:text-indigo-800 rounded-md transition duration-300"
                >
                  Přihlášení
                </Link>
                <Link
                  href="/register"
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-300"
                >
                  Registrace
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`md:hidden ${opened ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/pack"
            className={`block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
              activeLink === "/pack"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                : ""
            }`}
          >
            Balíčky
          </Link>
          <Link
              href="/collection"
              className={`py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                activeLink === "/collection"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : ""
              }`}
            >
              Kolekce
            </Link>
          <Link
            href="/trade"
            className={`block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
              activeLink === "/trade"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                : ""
            }`}
          >
            Směnárna
          </Link>
          <Link
            href="/stats"
            className={`block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
              activeLink === "/stats"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                : ""
            }`}
          >
            Statistiky
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/profile"
                className={`block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300 ${
                  activeLink === "/profile"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : ""
                }`}
              >
                Profil
              </Link>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="block py-2 px-3 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-md transition duration-300"
              >
                Přihlášení
              </Link>
              <Link
                href="/register"
                className="block py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-300"
              >
                Registrace
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
