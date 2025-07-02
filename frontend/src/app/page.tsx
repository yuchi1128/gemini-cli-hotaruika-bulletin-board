
'use client';

import { useForecasts, Forecast } from '../hooks/useForecasts';

// Map predictions to emojis
const predictionEmojis: { [key: string]: string } = {
  "なし": "😴",
  "プチ湧き": "🦑",
  "チョイ湧き": "🦑🦑",
  "湧き": "🦑🦑🦑",
  "爆湧き": "🎉🦑🎉",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export default function Home() {
  const { forecasts, loading, error } = useForecasts();

  const todayForecast = forecasts.length > 0 ? forecasts[0] : null;
  const weeklyForecasts = forecasts.length > 1 ? forecasts.slice(1, 7) : [];

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-ocean-deep text-glow-blue font-serif">
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold">ホタルイカ予報</h1>
      </header>

      <main className="container mx-auto px-4">
        {/* Today's Forecast */}
        {todayForecast && (
          <section className="text-center my-12">
            <h2 className="text-3xl mb-4">今日の身投げ予報</h2>
            <div className="bg-ocean-light p-8 rounded-lg inline-block">
              <div className="text-6xl mb-4">{predictionEmojis[todayForecast.prediction] || '❓'}</div>
              <p className="text-4xl font-bold">{todayForecast.prediction}</p>
            </div>
          </section>
        )}

        {/* Weekly Forecast */}
        <section className="my-12">
          <h2 className="text-2xl text-center mb-8">週間予報</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {weeklyForecasts.map((forecast: Forecast) => (
              <div key={forecast.id} className="bg-ocean-light p-4 rounded-lg">
                <p className="font-bold">{formatDate(forecast.date)}</p>
                <div className="text-4xl my-2">{predictionEmojis[forecast.prediction] || '❓'}</div>
                <p>{forecast.prediction}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bulletin Board */}
        <section className="my-12">
          <h2 className="text-2xl text-center mb-8">みんなの口コミ掲示板</h2>
          <div className="max-w-2xl mx-auto">
            {/* Post Form */}
            <div className="bg-ocean-light p-4 rounded-lg mb-8">
              <textarea className="w-full bg-ocean-deep p-2 rounded-md text-glow-blue" placeholder="今日の様子を教えて！"></textarea>
              <button className="bg-accent-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">投稿する</button>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {/* Sample Post */}
              <div className="bg-ocean-light p-4 rounded-lg">
                <p className="text-sm text-gray-400">名無しさん 2025/07/02 21:00</p>
                <p className="mt-2">今日は結構見れました！</p>
                <div className="flex items-center mt-4 text-sm">
                  <button className="text-accent-blue hover:text-white">いいね👍 12</button>
                  <button className="ml-4 text-accent-blue hover:text-white">返信する</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
