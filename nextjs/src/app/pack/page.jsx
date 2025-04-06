"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function Pack({ userId }) {
  const [opened, setOpened] = useState(false);
  const [cards, setCards] = useState([]);
  const [packs, setPacks] = useState([]);
  const { data: session, status } = useSession();

  let hasFetched = false;

  const openPack = async (packId) => {
    if (!session) {
      alert("Musíte být přihlášeni, abyste mohli otevřít balíček.");
      return;
    }

    const response = await fetch("/api/open-pack", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.id, packId }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCards(data.cards);
      setOpened(true);
    }
  };

  const fetchPacks = async () => {
    if (hasFetched) return;
    hasFetched = true;

    const response = await fetch("api/get-packs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setPacks(data);
    }
  }

  useEffect(() => {
    fetchPacks();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {!opened ? (
        <>
          {packs.map((pack, _) => (
          <motion.div
            key={pack.id}
            className="w-48 h-64 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer pointer-events-auto"
            // style={{
            //   backgroundImage: `url(${image_path})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "center"
            // }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openPack(pack.id)}
          >
            <div className="text-center">
              {pack.name}
              <div className="text-sm text-gray-200">Počet karet: {pack.number_of_cards}</div>
            </div>
          </motion.div>
        ))}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center pointer-events-auto">
            <div className="grid grid-cols-3 gap-4">
              {cards.map((card, index) => (
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                  perspective={1000}
                  scale={1.05}
                  glareEnable={card.rarity_name === "Mythical" || card.rarity_name === "Legendary" || card.holo}
                  glareMaxOpacity={0.45}
                  glareColor="white"
                  glarePosition="all"
                  transitionSpeed={300}
                >
                  <motion.div
                    key={card.id}
                    className={`w-32 h-48 p-4 flex items-center justify-center text-white font-bold text-lg rounded-lg shadow-lg ${card.rarity_name === "Legendary" ? "bg-amber-400" : card.rarity_name === "Rare" ? "bg-blue-500" : "bg-gray-500"}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                  >
                    <div className="text-center">
                      {card.card_name}
                      <div className="text-sm text-gray-200">Kolekce: {card.collection_name}</div>
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:cursor-pointer"
                onClick={() => {
                  setOpened(false);
                  setCards([]);
                }}
              >
                Zpět na balíčky
              </button>
          </div>
        </>
      )}
    </div>
  );
}
