"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Notify from "@/components/Notify";

export default function Collection() {
  const [collections, setCollections] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
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

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch("/api/pack/get-collections", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      console.log(data.collections);
      handleNotify(
        data.error ? data.error : data.message,
        data.error ? "error" : "success"
      );
      setCollections(data.collections);
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 flex flex-col items-center justify-center">
      {notify.visible && <Notify message={notify.message} type={notify.type} />}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kolekce</h1>
      <div className="container mx-auto px-4">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className="bg-white rounded-md shadow-md border p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {collection.name}
                  </span>
                  <button
                    onClick={() => handleToggle(index)}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-indigo-600"
                  >
                    Náhled
                  </button>
                </div>
                {openIndex === index && (
                  <div className="mt-4">
                    {collection.cards.length > 0 ? (
                      <div className="flex justify-center flex-wrap gap-10">
                        {collection.cards.map((card) => (
                          <Tilt
                            key={card.id}
                            tiltMaxAngleX={10}
                            tiltMaxAngleY={10}
                            perspective={500}
                            scale={1.02}
                            glareEnable={
                              card.rarity.name === "Rare" ||
                              card.rarity.name === "Mythical" ||
                              card.rarity.name === "Legendary" ||
                              card.holo
                            }
                            glareMaxOpacity={0.3}
                            glareColor={
                              card.rarity.name === "Rare" ? "blue" :
                              card.rarity.name === "Mythical" ? "purple" :
                              card.rarity.name === "Legendary" ? "yellow" :
                              undefined
                            }
                            glarePosition="all"
                            transitionSpeed={200}
                            className={`w-[160px] h-[224px]`}
                          >
                            <motion.div
                              className={`relative w-[160px] h-[224px] mb-1`}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <img
                                src={card.image_path}
                                alt={`${card.name} Image`}
                                className="absolute inset-0 w-[160px] h-[224px] object-contain"
                              />
                              <img
                                src={card.frame.image_path}
                                alt={`${card.name} Frame`}
                                className="absolute inset-0 w-[160px] h-[224px] object-contain"
                              />
                              <img
                                src={card.icon.image_path}
                                alt={`${card.name} Icon`}
                                className="absolute inset-0 w-[160px] h-[224px] object-contain"
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-end py-5 w-full z-10">
                                <span className="text-[1rem] font-semibold truncate text-white">
                                  {card.name}
                                </span>
                                {card.rarity?.name && (
                                  <span className="text-[0.8rem] text-yellow-400 truncate">
                                    R: {card.rarity.name}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          </Tilt>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Žádné karty v této kolekci.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
