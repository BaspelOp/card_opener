'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function ProfileComponent() {
  const { data: session, status } = useSession();

  console.log("Session data:", session);
  console.log("Session status:", status);


  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Načítání...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Nejste přihlášeni. Přihlaste se prosím.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer"
        >Přihlásit se</button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 py-10">
      <div className="flex justify-center items-center flex-col max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Profil</h1>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-600 text-sm">Jméno:</p>
            <p className="text-lg font-medium">{session.user.name || "Neznámé jméno"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email:</p>
            <p className="text-lg font-medium">{session.user.email}</p>
          </div>
          {session.user.role && (
            <div>
              <p className="text-gray-600 text-sm">Role:</p>
              <p className="text-lg font-medium">{session.user.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
