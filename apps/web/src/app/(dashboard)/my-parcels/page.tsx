'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Package, Eye } from 'lucide-react';
import type { ParcelStatus } from '@/types/parcel';
import { useGetMyParcelsQuery } from '@/store/api/parcelApi';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function MyParcelsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetMyParcelsQuery({ page, limit: 10, status });
  const parcels = data?.data?.data || [];

  const filteredParcels = search
    ? parcels.filter(p => p.trackingCode.toLowerCase().includes(search.toLowerCase()))
    : parcels;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Parcels</h1>
          <p className="text-muted-foreground">Track and manage all your parcels</p>
        </div>
        <Link href="/book-parcel">
          <Button>Book New Parcel</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking code..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="BOOKED">Booked</SelectItem>
                <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parcels List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredParcels.length} Parcel{filteredParcels.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No parcels found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? 'Try adjusting your search' : 'Start by booking your first parcel'}
              </p>
              {!search && (
                <Link href="/book-parcel">
                  <Button>Book Parcel</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParcels.map(parcel => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ParcelCard({ parcel }: { parcel: any }) {
  const statusConfig: Record<ParcelStatus, { label: string; variant: any }> = {
    BOOKED: { label: 'Booked', variant: 'default' },
    PICKED_UP: { label: 'Picked Up', variant: 'secondary' },
    IN_TRANSIT: { label: 'In Transit', variant: 'default' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', variant: 'default' },
    DELIVERED: { label: 'Delivered', variant: 'default' },
    FAILED: { label: 'Failed', variant: 'destructive' },
    CANCELLED: { label: 'Cancelled', variant: 'secondary' },
    RETURNED: { label: 'Returned', variant: 'secondary' },
  };

  const config = statusConfig[parcel.status as ParcelStatus];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{parcel.trackingCode}</h3>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">From:</p>
            <p className="font-medium">{parcel.pickupAddress}</p>
          </div>
          <div>
            <p className="text-muted-foreground">To:</p>
            <p className="font-medium">{parcel.deliveryAddress}</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{parcel.paymentType}</span>
          {parcel.codAmount && <span>৳{parcel.codAmount}</span>}
          <span>{formatDateTime(parcel.createdAt)}</span>
        </div>
      </div>
      <Link href={`/track/${parcel.trackingCode}`}>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Track
        </Button>
      </Link>
    </div>
  );
}
