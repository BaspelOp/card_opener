"use client";

import Link from "next/link";
import { FaBoxOpen, FaUserCircle, FaInfoCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";


export default function Home() {

  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Vítejte na Kartičkovém Světě!</h1>
        <p className="text-lg text-gray-600">Objevte, sbírejte a otevírejte vzrušující balíčky karet.</p>
      </header>

      <section className="bg-white shadow-md rounded-lg p-8 mb-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
          <FaInfoCircle className="mr-2" /> O naší stránce
        </h2>
        <p className="text-gray-700 mb-4">
          Tato stránka je vaším portálem do světa digitálních sběratelských karet.
          Můžete zde otevírat virtuální balíčky, získávat nové karty do své sbírky
          a prozkoumávat různé kolekce.
        </p>
        <p className="text-gray-700">
          Připojte se k nám a zažijte radost z objevování vzácných a unikátních karet!
        </p>
      </section>

      <section className="flex flex-wrap justify-center gap-6 max-w-2xl w-full">
        <Link href="/pack" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-md shadow-md transition duration-300 ease-in-out flex items-center">
          <FaBoxOpen className="mr-2" /> Otevřít balíčky
        </Link>

        {status === "authenticated" ? (
          <Link href="/profile" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-md shadow-md transition duration-300 ease-in-out flex items-center">
            <FaUserCircle className="mr-2" /> Váš profil
          </Link>
        ) : (
            <Link href="/register" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-md shadow-md transition duration-300 ease-in-out flex items-center">
                <FaUserCircle className="mr-2" /> Registrovat se
            </Link>
        )}
      </section>
    </div>
  );
}