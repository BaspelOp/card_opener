'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function ProfileComponent() {
  const { data: session, status } = useSession();
  let hasFetched = false;

  console.log("Session data:", session);
  console.log("Session status:", status);

  const loadUserData = async () => {
    if (hasFetched) return;
    if (!session) return;

    hasFetched = true;

    const response = await fetch("/api/user-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) return;

    const data = await response.json();
    console.log("User data:", data);
  }

  useEffect(() => {
    loadUserData();
  }, []);

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
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 hover:cursor-pointer focus-visible:outline-indigo-600"
        >Přihlásit se</button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-content items-center h-screen bg-gray-100 py-16">
        <div className="flex justify-center bg-white shadow-md rounded-lg p-6 w-1/4 h-full ml-10 mt-15">
          <div className="flex flex-col items-center gap-4">
            <img src="/avatar.png" alt="Avatar picture" className="w-48" />

            <div className="w-full text-left">
              <p className="text-gray-600 text-2xl">Jméno:</p>
              <p className="text-lg font-medium">{session.user.username || "Neznámé jméno"}</p>
            </div>

            <div className="w-full text-left">
              <p className="text-gray-600 text-2xl">Email:</p>
              <p className="text-lg font-medium">{session.user.email}</p>
            </div>

            {session.user.role && (
              <div className="w-full text-left">
                <p className="text-gray-600 text-2xl">Role:</p>
                <p className="text-lg font-medium">{session.user.role}</p>
              </div>
            )}

            <div className="w-full flex flex-col items-center p-5">
              <div className="w-full flex justify-center mb-4">
                <div className="w-32 h-[2px] bg-gray-600" />
              </div>
              <button 
                disabled={status === "loading"}
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 hover:cursor-pointer focus-visible:outline-red-600"
              >
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-full bg-white shadow-md rounded-lg w-3/4 m-10 mt-25">
          {/* <div className="flex flex-col gap-4">
              <div>
                <p className="text-gray-600 text-sm">Jméno:</p>
                <p className="text-lg font-medium">{session.user.username || "Neznámé jméno"}</p>
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
            </div> */}
            <div>
              <p className="text-gray-600 text-2xl">Balíčky:</p>
              <p className="text-lg font-medium">Zde budou vaše balíčky a karty.</p>
              <p className="text-lg font-medium">Zatím žádné nemáte.</p>
              <p className="text-lg font-medium">Pokud chcete nějaké mít, otevřete si je.</p>
            </div>
        </div>
      </div>
    </>
  );
}
