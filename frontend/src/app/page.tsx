
'use client';

import { useState } from 'react';
import { useForecasts, Forecast } from '../hooks/useForecasts';
import { usePosts, Post, Reply } from '../hooks/usePosts';

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

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function Home() {
  const { forecasts, loading: forecastsLoading, error: forecastsError } = useForecasts();
  const { posts, loading: postsLoading, error: postsError, createPost, createReply, likePost } = usePosts();

  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: number]: boolean }>({});

  const handlePostSubmit = async () => {
    if (newPostContent.trim()) {
      await createPost('名無しさん', newPostContent);
      setNewPostContent('');
    }
  };

  const handleReplySubmit = async (postId: number) => {
    if (replyContent[postId] && replyContent[postId].trim()) {
      await createReply(postId, '名無しさん', replyContent[postId]);
      setReplyContent({ ...replyContent, [postId]: '' });
      setShowReplyForm({ ...showReplyForm, [postId]: false });
    }
  };

  const handleLike = async (postId: number) => {
    await likePost(postId);
  };

  const todayForecast = forecasts.length > 0 ? forecasts[0] : null;
  const weeklyForecasts = forecasts.length > 1 ? forecasts.slice(1, 7) : [];

  if (forecastsLoading || postsLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (forecastsError || postsError) {
    return <div className="flex justify-center items-center min-h-screen">Error: {forecastsError?.message || postsError?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-ocean-deep text-glow-blue font-serif antialiased">
      <header className="text-center py-12 relative overflow-hidden">
        <h1 className="text-6xl md:text-7xl font-bold relative z-10 text-glow-blue drop-shadow-lg">
          ホタルイカ予報
        </h1>
        {/* Subtle glowing effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="w-64 h-64 bg-glow-blue rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-20">
        {/* Today's Forecast */}
        {todayForecast && (
          <section className="text-center my-16 bg-ocean-light p-10 rounded-2xl shadow-xl border border-accent-blue/30 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-4xl font-semibold mb-6 text-glow-blue">今日の身投げ予報</h2>
            <div className="inline-block bg-ocean-deep p-10 rounded-xl shadow-inner border border-accent-blue/50">
              <div className="text-8xl mb-4 animate-pulse-glow">{predictionEmojis[todayForecast.prediction] || '❓'}</div>
              <p className="text-5xl font-extrabold text-glow-blue">{todayForecast.prediction}</p>
            </div>
          </section>
        )}

        {/* Weekly Forecast */}
        <section className="my-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-glow-blue">週間予報</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {weeklyForecasts.map((forecast: Forecast) => (
              <div key={forecast.id} className="bg-ocean-light p-6 rounded-xl shadow-md border border-accent-blue/20 text-center transform hover:scale-105 transition-transform duration-300">
                <p className="font-bold text-xl mb-2 text-glow-blue">{formatDate(forecast.date)}</p>
                <div className="text-5xl my-3">{predictionEmojis[forecast.prediction] || '❓'}</div>
                <p className="text-lg">{forecast.prediction}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bulletin Board */}
        <section className="my-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-glow-blue">みんなの口コミ掲示板</h2>
          <div className="max-w-3xl mx-auto">
            {/* Post Form */}
            <div className="bg-ocean-light p-6 rounded-xl shadow-lg mb-10 border border-accent-blue/30">
              <textarea
                className="w-full bg-ocean-deep p-4 rounded-lg text-glow-blue placeholder-gray-500 focus:ring-2 focus:ring-accent-blue outline-none transition-all duration-200 resize-y min-h-[100px]"
                placeholder="今日の様子を教えて！"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              ></textarea>
              <button
                className="mt-4 w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                onClick={handlePostSubmit}
              >
                投稿する
              </button>
            </div>

            {/* Posts */}
            <div className="space-y-8">
              {posts.map((post: Post) => (
                <div key={post.id} className="bg-ocean-light p-6 rounded-xl shadow-lg border border-accent-blue/20">
                  <p className="text-sm text-gray-400 mb-2">{post.username} {formatDateTime(post.created_at)}</p>
                  <p className="text-lg mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center mt-4 text-sm space-x-4">
                    <button className="text-accent-blue hover:text-glow-blue transition-colors duration-200 flex items-center space-x-1" onClick={() => handleLike(post.id)}>
                      <span>いいね👍</span>
                      <span className="font-bold">{post.likes}</span>
                    </button>
                    <button className="text-accent-blue hover:text-glow-blue transition-colors duration-200" onClick={() => setShowReplyForm({ ...showReplyForm, [post.id]: !showReplyForm[post.id] })}>返信する</button>
                  </div>
                  {showReplyForm[post.id] && (
                    <div className="mt-6 p-4 bg-ocean-deep rounded-lg border border-accent-blue/30">
                      <textarea
                        className="w-full bg-transparent p-3 rounded-md text-glow-blue placeholder-gray-500 focus:ring-2 focus:ring-accent-blue outline-none transition-all duration-200 resize-y min-h-[80px]"
                        placeholder="返信を入力"
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      ></textarea>
                      <button
                        className="mt-3 bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        返信を投稿
                      </button>
                    </div>
                  )}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-6 pl-6 border-l-2 border-accent-blue/50 space-y-6">
                      {post.replies.map((reply: Reply) => (
                        <div key={reply.id} className="bg-ocean-deep p-4 rounded-lg shadow-inner border border-accent-blue/20">
                          <p className="text-sm text-gray-400 mb-1">{reply.username} {formatDateTime(reply.created_at)}</p>
                          <p className="text-base leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
