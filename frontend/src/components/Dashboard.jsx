import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = ({ metadata }) => {
    if (!metadata) return null;

    // Prepare dummy-ish data based on metadata for visualization
    // In a real app, this would come from a dedicated stats endpoint
    const companyPrices = metadata.companies.slice(0, 10).map(company => ({
        name: company,
        avgPrice: Math.floor(Math.random() * 800000) + 200000
    })).sort((a, b) => b.avgPrice - a.avgPrice);

    const yearTrend = metadata.years.slice(0, 12).reverse().map(year => ({
        year,
        price: Math.floor(Math.random() * 400000) + (year - 2000) * 50000
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
                    <p className="text-white font-bold">
                        ₹{new Intl.NumberFormat('en-IN').format(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-6">Market Value by Brand</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={companyPrices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                tick={{ fill: '#94a3b8' }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={v => `₹${v / 100000}L`}
                                tick={{ fill: '#94a3b8' }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: '#ffffff05' }}
                            />
                            <Bar dataKey="avgPrice" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-6">Price Trend by Year</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={yearTrend}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 100000}L`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
