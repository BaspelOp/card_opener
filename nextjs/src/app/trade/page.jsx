"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Notify from "@/components/Notify";
import Tilt from "react-parallax-tilt";

export default function Trade() {
  const [outgoingOffers, setOutgoingOffers] = useState([]);
  const [incomingOffers, setIncomingOffers] = useState([]);
  const [isCreatingNewOffer, setIsCreatingNewOffer] = useState(false);
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userAllData, setUserAllData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [notify, setNotify] = useState({
    visible: false,
    message: "",
    type: ""
  });

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

  // Otočení konkrétní kartičky
  const flipCard = (key) => {
    setFlippedCards((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

    console.log("Flipping card:", key);
  };

  const handleNotify = (message, type) => {
    setNotify({ visible: true, message, type });
    setTimeout(() => {
      setNotify({ ...notify, visible: false });
    }, 5000);
  };

  const handleInputChange = (event) => {
    const text = event.target.value;

    setSearchText(text);
    if (text.length > 0 && userAllData) {
      const results = userAllData.users.filter((user) =>
        user.user_name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedUserId(user.user_id);
    setSearchText(user.user_name);
    setSearchResults([]);

    setFormData((prevState) => ({
      ...prevState,
      toUserId: user.user_id
    }));
  };

  const [formData, setFormData] = useState({
    offeredCard: "",
    requestedCard: "",
    toUserId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (name === "offeredCard" || name === "requestedCard") {
      const normalizedCardValue = value
        .replace("🃏", "")
        .trim()
        .split("|")[0]
        .trim();
      const userData =
        name === "offeredCard" ? currentUser.cards : selectedUser.cards;
      const cardFound = userData.find((card) => {
        const normalizedCardName = card.card_name
          .replace("🃏", "")
          .trim()
          .split("|")[0]
          .trim();
        return normalizedCardName === normalizedCardValue;
      });

      if (cardFound) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: cardFound.card_id
        }));
      }
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!session) return;

      const response = await fetch("/api/user/all-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      setUserAllData(data);
      setCurrentUser(
        data.users.find((user) => user.user_id === session.user.databaseId)
      );
      setSelectedUser(
        data.users.find((user) => user.user_id === selectedUserId)
      );
    };

    const fetchOutgoingOffers = async () => {
      if (!session) return;

      const response = await fetch("/api/trade/outgoing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      setOutgoingOffers(data);
    };

    const fetchIncomingOffers = async () => {
      if (!session) return;

      const response = await fetch("/api/trade/incoming", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      setIncomingOffers(data);
    };

    fetchAllUsers();
    fetchOutgoingOffers();
    fetchIncomingOffers();
  }, [session]);

  const createNewOffer = async (e) => {
    e.preventDefault();
    setIsCreatingNewOffer(false);
    setFormData({
      offeredCard: "",
      requestedCard: "",
      toUserId: ""
    });

    if (!session && !isCreatingNewOffer) return;

    const response = await fetch("/api/trade/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) return;

    const data = await response.json();
    handleNotify(
      data.error ? data.error : data.message,
      data.error ? "error" : "success"
    );
  };

  const handleCancelOffer = async (offerId) => {
    if (!session) return;

    const response = await fetch("/api/trade/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ offerId })
    });

    if (!response.ok) return;

    const data = await response.json();
    handleNotify(
      data.error ? data.error : data.message,
      data.error ? "error" : "success"
    );
    setOutgoingOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
  };

  const handleAcceptOffer = async (offerId) => {
    if (!session) return;

    const response = await fetch("/api/trade/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ offerId })
    });

    if (!response.ok) return;

    const data = await response.json();
    handleNotify(
      data.error ? data.error : data.message,
      data.error ? "error" : "success"
    );
    setIncomingOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
  };

  const handleCreateNewOfferClick = () => {
    setIsCreatingNewOffer(true);
  };

  const handleCloseNewOfferModal = () => {
    setIsCreatingNewOffer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-16 flex flex-col items-center justify-center">
      {notify.visible && <Notify message={notify.message} type={notify.type} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            Obchody s kartičkami
          </h1>
        </header>

        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <button
            onClick={handleCreateNewOfferClick}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-indigo-600"
          >
            Vytvořit novou nabídku
          </button>

          {isCreatingNewOffer && (
            <form onSubmit={createNewOffer}>
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-lg">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4">
                    Nová nabídka
                  </h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Vyber svou kartičku:
                    </label>
                    <select
                      className="w-full border rounded px-4 py-2"
                      name="offeredCard"
                      value={formData.offeredCard}
                      onChange={handleChange}
                    >
                      {currentUser?.cards.map((card) => (
                        <option key={card.card_id} value={card.card_id}>
                          🃏 {card.card_name} | ({card.collection_name}) (
                          {card.card_quantity})x
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 relative">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Vyber uživatele:
                    </label>
                    <input
                      type="text"
                      name="toUserId"
                      value={searchText}
                      onChange={handleInputChange}
                      placeholder="Hledat uživatele podle jména"
                      className="w-full border rounded px-4 py-2"
                    />
                    {searchResults.length > 0 && (
                      <ul className="absolute left-0 right-0 bg-white border rounded shadow-lg mt-1 w-full max-h-60 overflow-y-auto z-10">
                        {searchResults.map((user) => (
                          <li
                            key={user.user_id}
                            onClick={() => handleSelectUser(user)}
                            className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                          >
                            {user.user_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedUser && (
                      <p className="mt-2 text-sm text-gray-600">
                        Vybraný uživatel: {selectedUser.user_name} (ID:{" "}
                        {selectedUser.user_id})
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Vyber kartičku od uživatele:
                    </label>
                    <select
                      className="w-full border rounded px-4 py-2"
                      name="requestedCard"
                      value={formData.requestedCard}
                      onChange={handleChange}
                    >
                      {selectedUser?.cards.map((card) => (
                        <option key={card.card_id} value={card.card_id}>
                          🃏 {card.card_name} | ({card.collection_name}) (
                          {card.card_quantity})x
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-indigo-600"
                    >
                      Odeslat nabídku
                    </button>
                    <button
                      onClick={handleCloseNewOfferModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded hover:cursor-pointer transition duration-300 ease-in-out focus-visible:outline-gray-600"
                    >
                      Zavřít
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Moje odeslané nabídky
          </h2>
          {!isCreatingNewOffer && (
            <>
              {outgoingOffers.length === 0 ? (
                <p className="text-gray-600">Žádné odeslané nabídky.</p>
              ) : (
                <ul className="divide-y divide-gray-200 overflow-y-auto max-h-60">
                  <li className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-4 gap-4">
                    <span>Nabízené</span>
                    <span>Požadované</span>
                    <span>Stav</span>
                    <span className="text-right">Akce</span>
                  </li>
                  {outgoingOffers.map((offer) => (
                    <li
                      key={offer.id}
                      className="px-4 py-3 bg-white hover:bg-gray-100 grid grid-cols-4 gap-4 items-center overflow-hidden"
                    >
                      <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        perspective={700}
                        scale={1.02}
                        glareEnable={
                          offer.offered_card.rarity_name === "Rare" ||
                          offer.offered_card.rarity_name === "Mythical" ||
                          offer.offered_card.rarity_name === "Legendary"
                        }
                        glareMaxOpacity={0.3}
                        glareColor={
                          offer.offered_card.rarity_name === "Rare"
                            ? "blue"
                            : offer.offered_card.rarity_name === "Mythical"
                            ? "purple"
                            : offer.offered_card.rarity_name === "Legendary"
                            ? "yellow"
                            : undefined
                        }
                        glarePosition="all"
                        transitionSpeed={200}
                        className="flex items-center gap-2 relative w-40 h-40 flex-shrink-0 cursor-pointer"
                      >
                        <div onClick={() => flipCard(`${offer.id}_offered`)} className={`flip-card-inner ${flippedCards[`${offer.id}_offered`] ? "flipped" : ""}`}>
                          <div className="flip-card-front absolute inset-0 w-full h-full">
                            <img
                              src={offer.offered_card.image_path}
                              alt={`${offer.offered_card.name} Image`}
                              className="relative inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.offered_card.frame_image_path}
                              alt={`${offer.offered_card.name} Frame`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.offered_card.icon_image_path}
                              alt={`${offer.offered_card.name} Icon`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                          </div>
                          <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                            <div className="text-xs font-bold mb-1">{offer.offered_card.name}</div>
                            <div className="text-xs mb-1">
                              <span className={getRarityColor(offer.offered_card.rarity_name)}>{offer.offered_card.rarity_name}</span>
                            </div>
                            <div className="text-xs">Kolekce: {offer.offered_card.collection_name}</div>
                          </div>
                        </div>
                      </Tilt>
                      <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        perspective={700}
                        scale={1.02}
                        glareEnable={
                          offer.wanted_card.rarity_name === "Rare" ||
                          offer.wanted_card.rarity_name === "Mythical" ||
                          offer.wanted_card.rarity_name === "Legendary"
                        }
                        glareMaxOpacity={0.3}
                        glareColor={
                          offer.wanted_card.rarity_name === "Rare"
                            ? "blue"
                            : offer.wanted_card.rarity_name === "Mythical"
                            ? "purple"
                            : offer.wanted_card.rarity_name === "Legendary"
                            ? "yellow"
                            : undefined
                        }
                        glarePosition="all"
                        transitionSpeed={200}
                        className="flex items-center gap-2 relative w-40 h-40 flex-shrink-0 cursor-pointer"
                      >
                        <div onClick={() => flipCard(`${offer.id}_wanted`)} className={`flip-card-inner ${flippedCards[`${offer.id}_wanted`] ? "flipped" : ""}`}>
                          <div className="flip-card-front absolute inset-0 w-full h-full">
                            <img
                              src={offer.wanted_card.image_path}
                              alt={`${offer.wanted_card.name} Image`}
                              className="relative inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.wanted_card.frame_image_path}
                              alt={`${offer.wanted_card.name} Frame`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.wanted_card.icon_image_path}
                              alt={`${offer.wanted_card.name} Icon`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                          </div>
                          <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                            <div className="text-xs font-bold mb-1">{offer.wanted_card.name}</div>
                            <div className="text-xs mb-1">
                              <span className={getRarityColor(offer.wanted_card.rarity_name)}>{offer.wanted_card.rarity_name}</span>
                            </div>
                            <div className="text-xs">Kolekce: {offer.wanted_card.collection_name}</div>
                          </div>
                        </div>
                      </Tilt>
                      <span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800`}
                        >
                          Aktivní
                        </span>
                      </span>
                      <span className="text-right">
                        <button
                          onClick={() => handleCancelOffer(offer.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-red-600"
                        >
                          Zrušit
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Moje přijaté nabídky
          </h2>
          {!isCreatingNewOffer && (
            <>
              {incomingOffers.length === 0 ? (
                <p className="text-gray-600">Žádné přijaté nabídky.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-4 gap-4">
                    <span>Od hráče</span>
                    <span>Nabízí</span>
                    <span>Požaduje</span>
                    <span className="text-right">Akce</span>
                  </li>
                  {incomingOffers.map((offer) => (
                    <li
                      key={offer.id}
                      className="px-4 py-3 bg-white hover:bg-gray-100 grid grid-cols-4 gap-4 items-center overflow-hidden"
                    >
                      <span className="text-xs font-semibold truncate text-gray-700">
                        {offer.from_username}
                      </span>
                      <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        perspective={700}
                        scale={1.02}
                        glareEnable={
                          offer.offered_card.rarity_name === "Rare" ||
                          offer.offered_card.rarity_name === "Mythical" ||
                          offer.offered_card.rarity_name === "Legendary"
                        }
                        glareMaxOpacity={0.3}
                        glareColor={
                          offer.offered_card.rarity_name === "Rare"
                            ? "blue"
                            : offer.offered_card.rarity_name === "Mythical"
                            ? "purple"
                            : offer.offered_card.rarity_name === "Legendary"
                            ? "yellow"
                            : undefined
                        }
                        glarePosition="all"
                        transitionSpeed={200}
                        className="flex items-center gap-2 relative w-40 h-40 flex-shrink-0 cursor-pointer"
                      >
                        <div onClick={() => flipCard(`${offer.id}_offered`)} className={`flip-card-inner ${flippedCards[`${offer.id}_offered`] ? "flipped" : ""}`}>
                          <div className="flip-card-front absolute inset-0 w-full h-full">
                            <img
                              src={offer.offered_card.image_path}
                              alt={`${offer.offered_card.name} Image`}
                              className="relative inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.offered_card.frame_image_path}
                              alt={`${offer.offered_card.name} Frame`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.offered_card.icon_image_path}
                              alt={`${offer.offered_card.name} Icon`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                          </div>
                          <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                            <div className="text-xs font-bold mb-1">{offer.offered_card.name}</div>
                            <div className="text-xs mb-1">
                              <span className={getRarityColor(offer.offered_card.rarity_name)}>{offer.offered_card.rarity_name}</span>
                            </div>
                            <div className="text-xs">Kolekce: {offer.offered_card.collection_name}</div>
                          </div>
                        </div>
                      </Tilt>
                      <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        perspective={700}
                        scale={1.02}
                        glareEnable={
                          offer.wanted_card.rarity_name === "Rare" ||
                          offer.wanted_card.rarity_name === "Mythical" ||
                          offer.wanted_card.rarity_name === "Legendary"
                        }
                        glareMaxOpacity={0.3}
                        glareColor={
                          offer.wanted_card.rarity_name === "Rare"
                            ? "blue"
                            : offer.wanted_card.rarity_name === "Mythical"
                            ? "purple"
                            : offer.wanted_card.rarity_name === "Legendary"
                            ? "yellow"
                            : undefined
                        }
                        glarePosition="all"
                        transitionSpeed={200}
                        className="flex items-center gap-2 relative w-40 h-40 flex-shrink-0 cursor-pointer"
                      >
                        <div onClick={() => flipCard(`${offer.id}_wanted`)} className={`flip-card-inner ${flippedCards[`${offer.id}_wanted`] ? "flipped" : ""}`}>
                          <div className="flip-card-front absolute inset-0 w-full h-full">
                            <img
                              src={offer.wanted_card.image_path}
                              alt={`${offer.wanted_card.name} Image`}
                              className="relative inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.wanted_card.frame_image_path}
                              alt={`${offer.wanted_card.name} Frame`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <img
                              src={offer.wanted_card.icon_image_path}
                              alt={`${offer.wanted_card.name} Icon`}
                              className="absolute inset-0 object-cover pointer-events-none max-w-full max-h-full"
                            />
                            <div className="absolute left-0 bottom-0 text-center py-3 w-27">
                              <div className="text-xs font-semibold truncate text-white">
                                {offer.wanted_card.name}
                              </div>
                              <div className="text-[0.5rem] text-gray-300 truncate">
                                Kol: {offer.wanted_card.collection_name}
                              </div>
                              {offer.wanted_card.rarity_name && (
                                <div className={`text-[0.5rem] truncate ${getRarityColor(offer.wanted_card.rarity_name)}`}>
                                  R: {offer.wanted_card.rarity_name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flip-card-back absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                            <div className="text-xs font-bold mb-1">{offer.wanted_card.name}</div>
                            <div className="text-xs mb-1">
                              Rarita: <span className={getRarityColor(offer.wanted_card.rarity_name)}>{offer.wanted_card.rarity_name}</span>
                            </div>
                            <div className="text-xs">Kolekce: {offer.wanted_card.collection_name}</div>
                          </div>
                        </div>
                      </Tilt>
                      <span className="text-right">
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-green-600"
                        >
                          Přijmout
                        </button>
                        <button
                          onClick={() => handleCancelOffer(offer.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out hover:cursor-pointer focus-visible:outline-red-600"
                        >
                          Odmítnout
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
