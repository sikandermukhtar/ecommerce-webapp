// src/components/admin/CategoryForm.tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function CategoryForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/product/add-category', { name });
      setMessage(`Category created: ${res.data.name}`);
      setName('');
    } catch (err: any) {
      setMessage(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        placeholder="Main Category (Men, Women, Kids)"
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Add Category
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
