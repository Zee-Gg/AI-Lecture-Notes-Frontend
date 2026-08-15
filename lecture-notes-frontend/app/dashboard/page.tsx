import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <main className="p-10">
        <h1 className="text-2xl font-bold">Dashboard (protected)</h1>
      </main>
    </ProtectedRoute>
  );
}