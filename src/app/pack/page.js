"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Pack({ userId }) {
    const [opened, setOpened] = useState(false);
    const [cards, setCards] = useState([]);

    const openPack = async () => {
        const response = await fetch("/api/open-pack", {
            method: "POST",
            body: JSON.stringify({ userId: 1, packId: 1 }),
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

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {!opened ? (
                <motion.div 
                    className="w-48 h-64 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openPack}
                    >
                    Otevřít balíček
                </motion.div>
            ) : (
                <>
                    <div className='flex flex-col items-center'>
                        <div className="grid grid-cols-3 gap-4">
                            {cards.map((card, index) => (
                                <Tilt
                                    tiltMaxAngleX={20}
                                    tiltMaxAngleY={20}
                                    perspective={1000}
                                    scale={1.05}
                                    glareEnable={card.holo}
                                    glareMaxOpacity={0.45}
                                    glareColor="white"
                                    glarePosition='all'
                                    transitionSpeed={300}
                                >
                                    <motion.div
                                        key={card.id}
                                        className={`w-32 h-48 p-4 flex items-center justify-center text-white font-bold text-lg rounded-lg shadow-lg ${card.rarity === "legendary" ? "bg-purple-500" : card.rarity === "rare" ? "bg-blue-500" : "bg-gray-500"}`}
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.3 }}
                                    >
                                        {card.name}
                                    </motion.div>
                                </Tilt>
                            ))}
                        </div>
                        <div className="w-full text-center mt-4">
                            <div 
                                className="text-blue-500 cursor-pointer block"
                                onClick={() => {
                                    setOpened(false);
                                    setCards([]);
                                }}
                            >
                                Otevřít další balíček
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}