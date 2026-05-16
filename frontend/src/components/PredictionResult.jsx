import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';

const PredictionResult = ({ prediction }) => {
    if (!prediction) return null;

    const { predicted_price, confidence_range_min, confidence_range_max } = prediction;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 p-8 border border-primary-500/30 rounded-2xl bg-primary-500/10 text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Estimated Valuation</span>
                <h2 className="text-5xl font-bold text-white mt-2 mb-4">
                    {formatCurrency(predicted_price)}
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">
                        Confidence Range: <span className="text-white font-medium">{formatCurrency(confidence_range_min)} - {formatCurrency(confidence_range_max)}</span>
                    </span>
                </div>

                <div className="flex items-start gap-2 max-w-md text-xs text-slate-500">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>This valuation is based on historical market data and may vary depending on actual vehicle condition, locality, and market demand.</p>
                </div>
            </motion.div>

            {/* Background Decor */}
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
        </motion.div>
    );
};

export default PredictionResult;
