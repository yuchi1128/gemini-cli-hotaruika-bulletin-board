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
              <textarea
                className="w-full bg-ocean-deep p-2 rounded-md text-glow-blue"
                placeholder="今日の様子を教えて！"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              ></textarea>
              <button
                className="bg-accent-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handlePostSubmit}
              >
                投稿する
              </button>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post: Post) => (
                <div key={post.id} className="bg-ocean-light p-4 rounded-lg">
                  <p className="text-sm text-gray-400">{post.username} {formatDateTime(post.created_at)}</p>
                  <p className="mt-2">{post.content}</p>
                  <div className="flex items-center mt-4 text-sm">
                    <button className="text-accent-blue hover:text-white" onClick={() => handleLike(post.id)}>いいね👍 {post.likes}</button>
                    <button className="ml-4 text-accent-blue hover:text-white" onClick={() => setShowReplyForm({ ...showReplyForm, [post.id]: !showReplyForm[post.id] })}>返信する</button>
                  </div>
                  {showReplyForm[post.id] && (
                    <div className="mt-4">
                      <textarea
                        className="w-full bg-ocean-deep p-2 rounded-md text-glow-blue"
                        placeholder="返信を入力"
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      ></textarea>
                      <button
                        className="bg-accent-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        返信を投稿
                      </button>
                    </div>
                  )}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 pl-8 border-l border-gray-600 space-y-4">
                      {post.replies.map((reply: Reply) => (
                        <div key={reply.id} className="bg-ocean-deep p-3 rounded-lg">
                          <p className="text-sm text-gray-400">{reply.username} {formatDateTime(reply.created_at)}</p>
                          <p className="mt-1">{reply.content}</p>
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