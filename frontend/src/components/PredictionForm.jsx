import React, { useState, useEffect } from 'react';
import { Car, Calendar, Gauge, Fuel, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PredictionForm = ({ metadata, onPredict, predicting }) => {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        year: '',
        kms_driven: '',
        fuel_type: ''
    });

    const [availableModels, setAvailableModels] = useState([]);

    useEffect(() => {
        if (formData.company && metadata?.models_by_company) {
            setAvailableModels(metadata.models_by_company[formData.company] || []);
            setFormData(prev => ({ ...prev, name: '' }));
        }
    }, [formData.company, metadata]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPredict(formData);
    };

    const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white [&>option]:text-black focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none";
    const labelClasses = "block text-sm font-medium text-slate-400 mb-2 ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div>
                    <label className={labelClasses}>Company</label>
                    <div className="relative">
                        <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        >
                            <option value="" disabled>Select Brand</option>
                            {metadata?.companies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Model */}
                <div>
                    <label className={labelClasses}>Model</label>
                    <div className="relative">
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                            disabled={!formData.company}
                        >
                            <option value="" disabled>Select Model</option>
                            {availableModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Year */}
                <div>
                    <label className={labelClasses}>Year</label>
                    <div className="relative">
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        >
                            <option value="" disabled>Select Year</option>
                            {metadata?.years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Fuel Type */}
                <div>
                    <label className={labelClasses}>Fuel Type</label>
                    <div className="relative">
                        <select
                            name="fuel_type"
                            value={formData.fuel_type}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        >
                            <option value="" disabled>Select Fuel</option>
                            {metadata?.fuel_types.map(fuel => (
                                <option key={fuel} value={fuel}>{fuel}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* KMS Driven */}
                <div className="md:col-span-2">
                    <label className={labelClasses}>Kilometers Driven</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="kms_driven"
                            value={formData.kms_driven}
                            onChange={handleChange}
                            placeholder="e.g. 50000"
                            className={inputClasses}
                            required
                            min="0"
                        />
                        <Gauge className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={predicting}
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
                {predicting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Search className="w-5 h-5" />
                        Predict Valuation
                    </>
                )}
            </motion.button>
        </form>
    );
};

export default PredictionForm;
