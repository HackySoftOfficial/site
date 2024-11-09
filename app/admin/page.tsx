import { ProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      {/* Your admin page content */}
    </ProtectedRoute>
  );
}