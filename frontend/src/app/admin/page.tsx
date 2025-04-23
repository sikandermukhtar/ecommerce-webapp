// src/pages/admin/dashboard.tsx
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryList from '@/components/admin/CategoryList';

export default function AdminDashboard() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Main Category</h2>
        <CategoryForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
        <CategoryList />
      </section>
    </main>
  );
}
