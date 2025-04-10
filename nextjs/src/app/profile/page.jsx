"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ProfileComponent() {
    const [userData, setUserData] = useState(null);
    const [expandedCollections, setExpandedCollections] = useState({});
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
        });

        if (!response.ok) return;

        const data = await response.json();
        console.log("User cards data:", data);
        setUserData(data);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const toggleCollection = (collectionId) => {
        setExpandedCollections(prevState => ({
            ...prevState,
            [collectionId]: !prevState[collectionId]
        }));
    };

    const groupCardsByCollection = (cards) => {
        if (!cards) return {};
        return cards.reduce((acc, card) => {
            const { collection_id, collection_name } = card;
            if (!acc[collection_id]) {
                acc[collection_id] = { name: collection_name, cards: {} };
            }
            if (!acc[collection_id].cards[card.card_name]) {
                acc[collection_id].cards[card.card_name] = { ...card, quantity: 0 };
            }
            acc[collection_id].cards[card.card_name].quantity++;
            return acc;
        }, {});
    };

    const groupedCards = groupCardsByCollection(userData);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <p className="text-lg font-semibold text-indigo-700">Načítání profilu...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <motion.div
                className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-lg font-semibold text-red-500 mb-4">
                    Nejste přihlášeni. Pro zobrazení profilu se prosím přihlaste.
                </p>
                <button
                    onClick={() => signIn()}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus-visible:outline-indigo-600 shadow-md flex items-center"
                >
                    <FaUserCircle className="inline-block mr-2" /> Přihlásit se
                </button>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex justify-center items-center">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl">
                <div className="flex justify-center mb-6">
                    <img src="/avatar.png" alt="Avatar" className="rounded-full w-32 h-32 object-cover border-4 border-indigo-300 shadow-md" />
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-indigo-700">{session?.user?.username || "Neznámý uživatel"}</h2>
                    <p className="text-gray-600">{session?.user?.email}</p>
                    {session?.user?.role && (
                        <p className="text-sm text-indigo-500 mt-2">Role: {session.user.role}</p>
                    )}
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
                        <FaBoxOpen className="mr-2 text-indigo-500" /> Vaše sbírka
                    </h3>
                    <div className="bg-indigo-50 rounded-md p-4 text-gray-700">
                        <p className="font-semibold mb-2">Seznam vašich karet:</p>
                        {Object.keys(groupedCards).length > 0 ? (
                            Object.entries(groupedCards).map(([collectionId, collectionData]) => (
                                <div key={collectionId} className="mb-4">
                                    <div
                                        className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-200"
                                        onClick={() => toggleCollection(collectionId)}
                                    >
                                        <h4 className="font-semibold text-lg text-indigo-600">{collectionData.name}</h4>
                                        {expandedCollections[collectionId] ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                    {expandedCollections[collectionId] && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-2">
                                            {Object.values(collectionData.cards).map(card => (
                                                <div key={card.card_name} className="relative w-24 h-36 rounded-md shadow-md overflow-hidden">
                                                  <img
                                                      src={card.card_image_path}
                                                      alt={card.card_name}
                                                      className="absolute inset-0 w-full h-full object-cover"
                                                  />
                                                  <img
                                                      src={card.frame_image_path}
                                                      alt={`${card.card_name} Frame`}
                                                      className="absolute inset-0 w-full h-full object-cover"
                                                  />
                                                  <img 
                                                      src={card.icon_image_path} 
                                                      alt={`${card.card_name} Icon`} 
                                                      className="absolute inset-0 w-full h-full object-cover"
                                                      />
                                                  <img
                                                      src="/images/Plates/Cars/Plate_empty.png"
                                                      alt={`${card.card_name} Plate`}
                                                      className="absolute inset-0 w-full h-full object-cover"
                                                  />
                                                  <div className="absolute bottom-0 left-0 right-0 text-white text-center py-2"> 
                                                      <div className="text-xs font-semibold truncate">{card.card_name}</div> 
                                                      <div className="text-[0.5rem] text-gray-300 truncate">Kol: {card.collection_name}</div> 
                                                      {card.rarity_name && (
                                                          <div className="text-[0.5rem] text-yellow-400 truncate">R: {card.rarity_name}</div> 
                                                      )}
                                                  </div>
                                                  {card.card_quantity > 1 && (
                                                      <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md transform">
                                                          x{card.card_quantity}
                                                      </span>
                                                  )}
                                              </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <>
                                <p>Zde se zobrazí vaše karty po načtení.</p>
                                <p className="mt-2 italic text-sm">Zatím žádné nemáte.</p>
                                <p className="mt-1 italic text-sm">Otevřete si nějaké v sekci s balíčky!</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        disabled={status === "loading"}
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus-visible:outline-red-500 shadow-md flex items-center justify-center hover:cursor-pointer transition duration-200 ease-in-out"
                    >
                        <FaSignOutAlt className="mr-2" /> Odhlásit se
                    </button>
                </div>
            </div>
        </div>
    );
}