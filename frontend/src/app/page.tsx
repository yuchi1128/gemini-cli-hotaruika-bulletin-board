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
    return <div className="flex justify-center items-center min-h-screen bg-deep-ocean">Loading...</div>;
  }

  if (forecastsError || postsError) {
    return <div className="flex justify-center items-center min-h-screen bg-deep-ocean">Error: {forecastsError?.message || postsError?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-deep-ocean text-bright-cyan font-serif antialiased animate-fade-in">
      <header className="text-center py-12 md:py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-glow-accent animate-pulse-glow">
          ホタルイカ予報
        </h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Today's Forecast */}
        {todayForecast && (
          <section className="text-center my-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-aqua-blue">今日の身投げ予報</h2>
            <div className="inline-block bg-ocean-surface/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-aqua-blue/20">
              <div className="text-8xl md:text-9xl mb-4">{predictionEmojis[todayForecast.prediction] || '❓'}</div>
              <p className="text-4xl md:text-5xl font-bold text-white">{todayForecast.prediction}</p>
            </div>
          </section>
        )}

        {/* Weekly Forecast */}
        <section className="my-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-semibold text-center mb-10 text-aqua-blue">週間予報</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {weeklyForecasts.map((forecast: Forecast, index: number) => (
              <div key={forecast.id} className="bg-ocean-surface/50 p-6 rounded-xl shadow-md border border-aqua-blue/20 text-center transform hover:scale-105 hover:bg-ocean-surface/80 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <p className="font-bold text-lg mb-3 text-light-blue">{formatDate(forecast.date)}</p>
                <div className="text-5xl my-3">{predictionEmojis[forecast.prediction] || '❓'}</div>
                <p className="text-base text-white">{forecast.prediction}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Posts Section */}
        <section className="my-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-semibold text-center mb-10 text-aqua-blue">掲示板</h2>
          <div className="max-w-2xl mx-auto">
            {/* New Post Form */}
            <div className="bg-ocean-surface/50 p-6 rounded-xl shadow-md mb-8 border border-aqua-blue/20">
              <textarea
                className="w-full bg-deep-ocean p-3 rounded-lg border border-aqua-blue/30 focus:ring-2 focus:ring-glow-accent focus:outline-none transition-all"
                rows={3}
                placeholder="新しい投稿..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              ></textarea>
              <button
                className="mt-4 px-6 py-2 bg-aqua-blue text-deep-ocean font-bold rounded-lg hover:bg-glow-accent transition-colors duration-300"
                onClick={handlePostSubmit}
              >
                投稿
              </button>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post: Post) => (
                <div key={post.id} className="bg-ocean-surface/50 p-5 rounded-xl shadow-md animate-fade-in border border-aqua-blue/20">
                  <p className="text-light-blue">{post.content}</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-aqua-blue">
                    <span>{formatDateTime(post.created_at)}</span>
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleLike(post.id)} className="hover:text-glow-accent transition-colors">❤️ {post.likes}</button>
                      <button onClick={() => setShowReplyForm({ ...showReplyForm, [post.id]: !showReplyForm[post.id] })} className="hover:text-glow-accent transition-colors">返信</button>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {showReplyForm[post.id] && (
                    <div className="mt-4">
                      <textarea
                        className="w-full bg-deep-ocean p-2 rounded-lg border border-aqua-blue/30 focus:ring-2 focus:ring-glow-accent focus:outline-none transition-all"
                        rows={2}
                        placeholder="返信..."
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      ></textarea>
                      <button
                        className="mt-2 px-4 py-1 bg-aqua-blue text-deep-ocean font-bold rounded-lg hover:bg-glow-accent transition-colors duration-300"
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        返信
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-aqua-blue/30 space-y-3">
                      {post.replies.map((reply: Reply) => (
                        <div key={reply.id} className="text-sm">
                          <p className="text-light-blue">{reply.content}</p>
                          <span className="text-xs text-aqua-blue/80">{formatDateTime(reply.created_at)}</span>
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