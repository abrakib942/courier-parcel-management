'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, PackagePlus, Truck, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/store/api/hook';
import { useGetMyParcelsQuery } from '@/store/api/parcelApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAppSelector(state => state.auth);
  const { data, isLoading } = useGetMyParcelsQuery({ page: 1, limit: 10 });

  const parcels = data?.data?.data || [];
  const stats = {
    total: parcels.length,
    inTransit: parcels.filter(p => p.status === 'IN_TRANSIT').length,
    delivered: parcels.filter(p => p.status === 'DELIVERED').length,
    pending: parcels.filter(p => p.status === 'BOOKED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's an overview of your parcels</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Parcels"
          value={stats.total}
          icon={<Package className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatsCard
          title="In Transit"
          value={stats.inTransit}
          icon={<Truck className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatsCard
          title="Delivered"
          value={stats.delivered}
          icon={<CheckCircle className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<XCircle className="h-4 w-4" />}
          loading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/book-parcel">
            <Button>
              <PackagePlus className="mr-2 h-4 w-4" />
              Book New Parcel
            </Button>
          </Link>
          <Link href="/my-parcels">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              View All Parcels
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Parcels */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No parcels yet. Book your first parcel!</p>
              <Link href="/book-parcel">
                <Button className="mt-4">Book Parcel</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {parcels.slice(0, 5).map(parcel => (
                <ParcelItem key={parcel.id} parcel={parcel} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function ParcelItem({ parcel }: { parcel: any }) {
  const statusColors = {
    BOOKED: 'bg-blue-100 text-blue-800',
    PICKED_UP: 'bg-purple-100 text-purple-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    RETURNED: 'bg-red-100 text-red-800',
  };

  return (
    // <Link href={`/my-parcels/${parcel.id}`}>
    //    </Link>
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{parcel.trackingCode}</p>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusColors[parcel.status as keyof typeof statusColors]
            }`}
          >
            {parcel.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {parcel.pickupAddress} → {parcel.deliveryAddress}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{parcel.paymentType}</p>
        {parcel.codAmount && <p className="text-sm text-muted-foreground">৳{parcel.codAmount}</p>}
      </div>
    </div>
  );
}
