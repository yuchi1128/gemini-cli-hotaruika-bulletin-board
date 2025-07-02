
import { useState, useEffect } from 'react';

export interface Forecast {
  id: number;
  date: string;
  location: string;
  prediction: string;
}

export const useForecasts = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const res = await fetch('/api/forecasts');
        if (!res.ok) {
          throw new Error('Failed to fetch forecasts');
        }
        const data = await res.json();
        setForecasts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, []);

  return { forecasts, loading, error };
};
