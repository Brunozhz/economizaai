import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  is_admin?: boolean;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Fetch admin roles
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        const adminUserIds = new Set(rolesData?.map(r => r.user_id) || []);

        const profilesWithRoles = (profilesData || []).map(p => ({
          ...p,
          is_admin: adminUserIds.has(p.user_id),
        }));

        setProfiles(profilesWithRoles);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">{profiles.length} usuários cadastrados</p>
        </div>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários
          </CardTitle>
          <CardDescription>Todos os usuários registrados na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {profiles.length > 0 ? (
            <div className="divide-y divide-border">
              {profiles.map((profile) => (
                <div key={profile.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{profile.name || 'Sem nome'}</span>
                        {profile.is_admin && (
                          <Badge variant="secondary" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {profile.email}
                        </span>
                        {profile.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {profile.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum usuário encontrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
