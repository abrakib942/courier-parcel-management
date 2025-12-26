'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAppSelector } from '@/store/api/hook';

export default function ProfilePage() {
  const { user } = useAppSelector(state => state.auth);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    BLOCKED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <Badge className={`mt-2 ${statusColors[user.status]}`}>{user.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={user.email} />
            {user.phone && (
              <InfoItem icon={<Phone className="h-5 w-5" />} label="Phone" value={user.phone} />
            )}
            {user.address && (
              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Address"
                value={user.address}
              />
            )}
            {user.dateOfBirth && (
              <InfoItem
                icon={<Calendar className="h-5 w-5" />}
                label="Date of Birth"
                value={user.dateOfBirth}
              />
            )}
            {user.gender && (
              <InfoItem icon={<User className="h-5 w-5" />} label="Gender" value={user.gender} />
            )}
            {user.nid && (
              <InfoItem icon={<User className="h-5 w-5" />} label="NID" value={user.nid} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
