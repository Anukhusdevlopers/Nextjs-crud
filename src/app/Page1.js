'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from '@/components/PostForm';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await axios.get('/api/posts');
    setPosts(response.data);
  };

  const addPost = async (post) => {
    await axios.post('/api/posts', post);
    fetchPosts();
  };

  const deletePost = async (id) => {
    await axios.delete(`/api/posts?id=${id}`);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <PostForm onSubmit={addPost} />
      <ul className="space-y-4 mt-4">
        {posts.map((post) => (
          <li key={post._id} className="p-4 bg-white shadow-md rounded">
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p>{post.content}</p>
            <button
              className="text-red-500"
              onClick={() => deletePost(post._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
