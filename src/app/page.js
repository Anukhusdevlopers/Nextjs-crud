'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

export default function PostsPage() {
  const [post, setPost] = useState({ title: '', content: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    fetchPosts();
  }, []);

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/posts');
      setPosts(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch posts.' });
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/posts/${editPostId}`, post);
        setAlert({ type: 'success', message: 'Post updated successfully!' });
      } else {
        await axios.post('http://localhost:4000/posts', post);
        setAlert({ type: 'success', message: 'Post added successfully!' });
      }
      setPost({ title: '', content: '' });
      setIsEditing(false);
      setEditPostId(null);
      fetchPosts();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save post. Please try again!' });
    }
    setTimeout(() => setAlert({ type: '', message: '' }), 3000);
  };

  const editPost = (id) => {
    const postToEdit = posts.find(post => post._id === id);
    setPost({
      title: postToEdit.title || '',
      content: postToEdit.content || ''
    });
    setIsEditing(true);
    setEditPostId(id);
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/posts/${id}`);
      setAlert({ type: 'success', message: 'Post deleted successfully!' });
      fetchPosts();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete post. Please try again!' });
    }
    setTimeout(() => setAlert({ type: '', message: '' }), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 mb-8" data-aos="fade-left">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isEditing ? 'Edit Post' : 'Add a New Post'}
        </h1>

        {alert.message && (
          <div
            className={`mb-4 p-4 rounded-md text-sm font-medium ${alert.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={addPost} className="space-y-4" data-aos="fade-left" data-aos-duration="1000">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter post title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="content"
              placeholder="Write your post content here"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-32"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Post' : 'Add Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts available.</p>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-t" data-aos="fade-up">
                  <td className="px-4 py-2 text-sm text-gray-800">{post.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{post.content}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => editPost(post._id)} className="text-indigo-600 hover:underline mr-2" data-aos="zoom-in">
                      Edit
                    </button>
                    <button onClick={() => deletePost(post._id)} className="text-red-600 hover:underline" data-aos="zoom-in">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
