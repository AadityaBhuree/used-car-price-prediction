import React from 'react';
import { Car, BarChart3, History, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <header className="py-6 mb-12 flex items-center justify-between border-b border-white/5">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <div className="bg-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/30">
                    <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight leading-none">AutoValue AI</h1>
                    <p className="text-primary-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Enterprise Car Valuation</p>
                </div>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
                {[
                    { name: 'Predictor', icon: Layers, active: true },
                    { name: 'Analytics', icon: BarChart3 },
                    { name: 'History', icon: History },
                ].map((item) => (
                    <a
                        key={item.name}
                        href={`#${item.name.toLowerCase()}`}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${item.active ? 'text-primary-400' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                    </a>
                ))}
            </nav>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-slate-300 text-xs font-medium">Model v1.0.4 Online</span>
                </div>
            </motion.div>
        </header>
    );
};

export default Header;
