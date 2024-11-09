import { ProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Your admin page content */}
      </div>
    </ProtectedRoute>
  );
}