"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Notify from "@/components/Notify";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-indigo-700 text-white p-2 rounded-md shadow-md">
                <p className="label">{`${label} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function Stats() {
    const [topUsers, setTopUsers] = useState([]);
    const [mostOwnedCards, setMostOwnedCards] = useState([]);
    const [mostWantedCards, setMostWantedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notify, setNotify] = useState({ visible: false, message: '', type: '' });

    const handleNotify = (message, type) => {
        setNotify({ visible: true, message, type });
        setTimeout(() => {
            setNotify({ ...notify, visible: false });
        }, 5000);
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);

                const responses = await Promise.all([
                    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statistic: 'top-users' }) }),
                    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statistic: 'most-owned' }) }),
                    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statistic: 'most-wanted' }) }),
                ]);

                if (!responses.every(res => res.ok)) {
                    return handleNotify('Chyba při načítání statistik.', 'error');
                }

                const [topUsersData, mostOwnedData, mostWantedData] = await Promise.all(responses.map(res => res.json()));

                setTopUsers(topUsersData);
                setMostOwnedCards(mostOwnedData);
                setMostWantedCards(mostWantedData);
                setLoading(false);
                handleNotify('Statistiky byly úspěšně načteny.', 'success');

            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching statistics:', err);
                handleNotify('Nepodařilo se načíst statistiky.', 'error');
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <div className="container mx-auto p-6 flex justify-center items-center">Načítání statistik...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-6 text-red-500 flex justify-center items-center">Chyba při načítání statistik: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 flex flex-col items-center justify-center">
            {notify.visible && <Notify message={notify.message} type={notify.type} />}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-4">Statistiky</h1>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center">
                        <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Top 10 uživatelů s nejvíce kartami</h2>
                        <div className="w-full h-60">
                            <ResponsiveContainer>
                                <BarChart data={topUsers}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis dataKey="username" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="card_count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center">
                        <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Top 10 vlastněných karet</h2>
                        <div className="w-full h-60">
                            <ResponsiveContainer>
                                <BarChart data={mostOwnedCards}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="card_count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center">
                        <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Top 10 nejžádanějších karet (ve směnárně)</h2>
                        <div className="w-full h-60">
                            <ResponsiveContainer>
                                <BarChart data={mostWantedCards}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="card_count" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}