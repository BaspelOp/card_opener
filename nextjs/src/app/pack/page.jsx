"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Notify from "@/components/Notify";

export default function Pack() {
  const [opened, setOpened] = useState(false);
  const [cards, setCards] = useState([]);
  const [packs, setPacks] = useState([]);
  const { data: session } = useSession();

  const [notify, setNotify] = useState({
    visible: false,
    message: "",
    type: ""
  });

  const handleNotify = (message, type) => {
    setNotify({ visible: true, message, type });
    setTimeout(() => {
      setNotify({ ...notify, visible: false });
    }, 5000);
  };

  let hasFetched = false;

  const openPack = async (packId) => {
    if (!session) {
      return handleNotify("Nejprve se přihlašte!", "error");
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
      saveCards(data);
    }
  };

  const saveCards = async (cards) => {
    const response = await fetch("/api/save-cards", {
      method: "POST",
      body: JSON.stringify({ cards }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    handleNotify(data.error ? data.error : data.message, data.error ? "error" : "success")
  };

  const fetchPacks = async () => {
    if (hasFetched) return;
    hasFetched = true;

    const response = await fetch("api/get-packs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setPacks(data);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 flex items-center justify-center pointer-events-none">
      {notify.visible && <Notify message={notify.message} type={notify.type} />}
      <div className="container mx-auto text-center flex justify-center items-center">
        {!opened ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {packs.map((pack, _) => (
              <motion.div
                key={pack.id}
                className="w-60 h-80 rounded-xl shadow-lg overflow-hidden cursor-pointer pointer-events-auto transform transition-transform hover:scale-105"
                style={{
                  backgroundImage: pack.image_path ? `url(${pack.image_path})` : "linear-gradient(to bottom right, #a855f7, #8b5cf6)",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => openPack(pack.id)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
                  <h3 className="font-bold text-xl mb-3">{pack.name}</h3>
                  <div className="text-sm text-gray-300">Obsahuje {pack.number_of_cards} karet</div>
                  <motion.div
                    className="absolute bottom-4 w-full px-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 py-12">Otevřené karty:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {cards.map((card, index) => (
                <Tilt
                  key={card.id}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={500}
                  scale={1.02}
                  glareEnable={
                    card.rarity_name === "Mythical" ||
                    card.rarity_name === "Legendary" ||
                    card.holo
                  }
                  glareMaxOpacity={0.3}
                  glareColor="white"
                  glarePosition="all"
                  transitionSpeed={200}
                >
                  <motion.div
                    className={`relative w-36 h-52 rounded-lg shadow-md overflow-hidden`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={card.card_image}
                      alt={card.card_name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={card.frame_image}
                      alt={`${card.card_name} Frame`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={card.icon_image}
                      alt={`${card.card_name} Icon`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src="/images/Plates/Cars/Plate_empty.png"
                      alt={`${card.card_name} Plate`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-white text-center py-3">
                      <div className="text-sm font-semibold">{card.card_name}</div>
                      <div className="text-xs text-gray-300">Kolekce: {card.collection_name}</div>
                      {card.rarity_name && (
                        <div className="text-xs text-yellow-400">Rarita: {card.rarity_name}</div>
                      )}
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
            <motion.button
              className="mt-10 px-8 py-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 hover:cursor-pointer shadow-lg text-lg font-semibold"
              onClick={() => {
                setOpened(false);
                setCards([]);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Zpět na balíčky
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}