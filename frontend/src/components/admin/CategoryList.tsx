// src/components/admin/CategoryList.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Category = {
  id: string;
  name: string;
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    const res = await api.get('/product/get-categories');
    setCategories(res.data);
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/product/delete-category/${id}`);
    fetchCategories();
  };

  const updateCategory = async () => {
    await api.put(`/product/update-category/${editId}`, { name: editName });
    setEditId(null);
    setEditName('');
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.id} className="flex gap-2 items-center">
          {editId === cat.id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-1"
              />
              <button onClick={updateCategory} className="bg-green-500 text-white px-2 py-1">Save</button>
            </>
          ) : (
            <>
              <span>{cat.name}</span>
              <button
                onClick={() => {
                  setEditId(cat.id);
                  setEditName(cat.name);
                }}
                className="bg-yellow-500 text-white px-2 py-1"
              >
                Edit
              </button>
            </>
          )}
          <button
            onClick={() => deleteCategory(cat.id)}
            className="bg-red-600 text-white px-2 py-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
