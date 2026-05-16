import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const useCarPrediction = () => {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [predicting, setPredicting] = useState(false);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('car_prediction_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/metadata`);
                setMetadata(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load vehicle data. Please ensure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, []);

    const getPrediction = async (data) => {
        setPredicting(true);
        setPrediction(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/predict`, data);
            const result = response.data;
            setPrediction(result);

            const newHistory = [
                { ...data, ...result, id: Date.now() },
                ...history.slice(0, 4)
            ];
            setHistory(newHistory);
            localStorage.setItem('car_prediction_history', JSON.stringify(newHistory));

            return result;
        } catch (err) {
            setError('Prediction failed. Please try again.');
            throw err;
        } finally {
            setPredicting(false);
        }
    };

    return {
        metadata,
        loading,
        error,
        prediction,
        predicting,
        history,
        getPrediction
    };
};
