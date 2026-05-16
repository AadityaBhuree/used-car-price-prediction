import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, History as HistoryIcon, BarChart3, Info } from 'lucide-react';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Dashboard from './components/Dashboard';
import { useCarPrediction } from './hooks/useCarPrediction';

function App() {
  const {
    metadata,
    loading,
    error,
    prediction,
    predicting,
    history,
    getPrediction
  } = useCarPrediction();

  const [activeTab, setActiveTab] = useState('predictor');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing AI Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 max-w-7xl mx-auto pb-20">
      <Header />

      <main>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form & Result */}
          <div className="lg:col-span-7 space-y-8">
            <section id="predictor">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Car Valuation</h2>
                <p className="text-slate-400">Enter simple vehicle details to get an instant AI-powered market price estimation.</p>
              </div>

              <div className="glass-card rounded-3xl p-8">
                <PredictionForm
                  metadata={metadata}
                  onPredict={getPrediction}
                  predicting={predicting}
                />
              </div>

              <AnimatePresence>
                {prediction && <PredictionResult prediction={prediction} />}
              </AnimatePresence>
            </section>
          </div>

          {/* Right Column: History & Stats Snapshot */}
          <div className="lg:col-span-5 space-y-8">
            <section id="history">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-primary-400" />
                  Recent History
                </h3>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                {history.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {history.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/5 transition-colors cursor-default group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-emerald-400 font-bold text-sm">
                            ₹{new Intl.NumberFormat('en-IN').format(item.predicted_price)}
                          </span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>{item.company}</span>
                          <span>•</span>
                          <span>{item.year}</span>
                          <span>•</span>
                          <span>{item.fuel_type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <HistoryIcon className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Your prediction history will appear here.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600/20 to-primary-600/20 rounded-2xl p-6 border border-indigo-500/20 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-widest mb-3">
                  <Info className="w-4 h-4" />
                  Model Accuracy
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{(metadata?.metrics?.r2_score * 100).toFixed(1)}% R² Score</h4>
                <p className="text-indigo-200/60 text-sm leading-relaxed">
                  Our algorithm has been trained on over 13,000 clean records, achieving high precision across major automotive brands.
                </p>
              </div>
              <BarChart3 className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/10 group-hover:scale-110 transition-transform duration-500" />
            </section>
          </div>
        </div>

        {/* Analytics Section */}
        <section id="analytics" className="mt-20">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Market Intelligence</h2>
            <p className="text-slate-400 max-w-2xl">Visualizing deeper insights from our training dataset to help you understand market fluctuations.</p>
          </div>
          <Dashboard metadata={metadata} />
        </section>
      </main>

      <footer className="mt-24 pt-8 border-t border-white/5 text-center">
        <p className="text-slate-600 text-sm">
          © 2026 AutoValue AI. Enterprise-Grade Vehicle Valuation Ecosystem.
        </p>
      </footer>
    </div>
  );
}

export default App;
