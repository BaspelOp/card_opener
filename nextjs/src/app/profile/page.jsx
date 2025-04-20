"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaBoxOpen,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

export default function ProfileComponent() {
  const [userData, setUserData] = useState(null);
  const [expandedCollections, setExpandedCollections] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const { data: session, status } = useSession();
  let hasFetched = false;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "text-gray-500";
      case "Uncommon":
        return "text-green-500";
      case "Rare":
        return "text-yellow-400";
      case "Mythical":
        return "text-purple-500";
      case "Legendary":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };

  const flipCard = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const loadUserData = async () => {
    if (hasFetched) return;
    if (!session) return;

    hasFetched = true;

    const response = await fetch("/api/user/user-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) return;

    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    loadUserData();
  }, [session]);

  const toggleCollection = (collectionId) => {
    setExpandedCollections((prevState) => ({
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
        <p className="text-lg font-semibold text-indigo-700">
          Načítání profilu...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center">
        <p className="text-lg font-semibold text-red-500 mb-4">
          Nejste přihlášeni. Pro zobrazení profilu se prosím přihlaste.
        </p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus-visible:outline-indigo-600 shadow-md flex items-center hover:cursor-pointer transition duration-200 ease-in-out"
        >
          <FaUserCircle className="inline-block mr-2" /> Přihlásit se
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl">
        <div className="flex justify-center mb-6">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="rounded-full w-32 h-32 object-cover border-4 border-indigo-300 shadow-md"
          />
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-indigo-700">
            {session?.user?.username || "Neznámý uživatel"}
          </h2>
          <p className="text-gray-600">{session?.user?.email}</p>
          {session?.user?.role && (
            <p className="text-sm text-indigo-500 mt-2">
              Role: {session.user.role}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
            <FaBoxOpen className="mr-2 text-indigo-500" /> Vaše sbírka
          </h3>
          <div className="bg-indigo-50 rounded-md p-4 text-gray-700">
            <p className="font-semibold mb-2">Seznam vašich karet:</p>
            {Object.keys(groupedCards).length > 0 ? (
              Object.entries(groupedCards).map(
                ([collectionId, collectionData]) => (
                  <div key={collectionId} className="mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-200"
                      onClick={() => toggleCollection(collectionId)}
                    >
                      <h4 className="font-semibold text-lg text-indigo-600">
                        {collectionData.name}
                      </h4>
                      {expandedCollections[collectionId] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                    {expandedCollections[collectionId] && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-2">
                        {Object.values(collectionData.cards).map(
                          (card, index) => (
                            <Tilt
                              key={card.id}
                              tiltMaxAngleX={10}
                              tiltMaxAngleY={10}
                              perspective={500}
                              scale={1.02}
                              glareEnable={
                                card.rarity_name === "Rare" ||
                                card.rarity_name === "Mythical" ||
                                card.rarity_name === "Legendary" ||
                                card.holo
                              }
                              glareMaxOpacity={0.3}
                              glareColor={
                                card.rarity_name === "Rare"
                                  ? "blue"
                                  : card.rarity_name === "Mythical"
                                    ? "purple"
                                    : card.rarity_name === "Legendary"
                                      ? "yellow"
                                      : undefined
                              }
                              glarePosition="all"
                              transitionSpeed={200}
                            >
                              <motion.div
                                className={`relative w-24 h-36 rounded-md shadow-md overflow-hidden cursor-pointer`}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 5 * 0.1 }}
                                onClick={() => flipCard(index)}
                              >
                                <div
                                  className={`flip-card-inner ${flippedCards[index] ? "flipped" : ""}`}
                                >
                                  <div className="flip-card-front absolute inset-0 w-full h-full">
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
                                  </div>
                                  <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                                    <div className="text-xs font-bold mb-1">
                                      {card.card_name}
                                    </div>
                                    <div className="text-xs mb-1">
                                      <span
                                        className={getRarityColor(
                                          card.rarity_name
                                        )}
                                      >
                                        {card.rarity_name}
                                      </span>
                                    </div>
                                    <div className="text-xs">
                                      Kolekce: {card.collection_name}
                                    </div>
                                    {card.card_quantity > 1 && (
                                      <span className="mt-2 bg-indigo-500 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md">
                                        x{card.card_quantity}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </Tilt>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <>
                <p>Zde se zobrazí vaše karty po načtení.</p>
                <p className="mt-2 italic text-sm">Zatím žádné nemáte.</p>
                <p className="mt-1 italic text-sm">
                  Otevřete si nějaké v sekci s balíčky!
                </p>
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
