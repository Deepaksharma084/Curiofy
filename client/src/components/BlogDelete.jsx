import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function DeleteBlogButton({ blogId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_BASE_URL}/blogs/delete/${blogId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for sending cookies
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate('/'); // Redirect to home page after successful deletion
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className='bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition-colors disabled:bg-gray-400'
    >
      {isDeleting ? 'Deleting...' : 'Delete Blog'}
    </button>
  );
}

export default DeleteBlogButton;
