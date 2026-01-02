import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import AdminSidebar from './AdminSidebar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!adminLoading && !isAdmin && user) {
      navigate('/');
      return;
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main 
        className={cn(
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
