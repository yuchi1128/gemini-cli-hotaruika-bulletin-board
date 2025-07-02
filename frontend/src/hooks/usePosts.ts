
import { useState, useEffect } from 'react';

export interface Reply {
  id: number;
  post_id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: number;
  username: string;
  content: string;
  created_at: string;
  replies: Reply[];
  likes: number;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (username: string, content: string) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, content }),
    });
    if (!res.ok) {
      throw new Error('Failed to create post');
    }
    fetchPosts(); // Refresh posts after creation
  };

  const createReply = async (postId: number, username: string, content: string) => {
    const res = await fetch(`/api/posts/${postId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, content }),
    });
    if (!res.ok) {
      throw new Error('Failed to create reply');
    }
    fetchPosts(); // Refresh posts after reply
  };

  const likePost = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error('Failed to like post');
    }
    fetchPosts(); // Refresh posts after like
  };

  return { posts, loading, error, createPost, createReply, likePost };
};
