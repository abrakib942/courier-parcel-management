'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Package, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTrackParcelQuery } from '@/store/api/parcelApi';
import { formatDateTime } from '@/lib/utils';

const TrackingMap = dynamic(() => import('../../../../components/parcel/TrackingMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export default function TrackingDetailsPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = use(params);
  const { data, isLoading, error } = useTrackParcelQuery(trackingCode);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Parcel not found. Please check your tracking code.</AlertDescription>
      </Alert>
    );
  }

  const { parcel, statusHistory, trackingLogs } = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{parcel.trackingCode}</h1>
          <p className="text-muted-foreground">Track your parcel in real-time</p>
        </div>
        <Badge className="text-lg px-4 py-2">{parcel.status.replace('_', ' ')}</Badge>
      </div>

      {/* Map */}
      {(parcel.pickupLat || parcel.deliveryLat) && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingMap
              pickup={
                parcel.pickupLat && parcel.pickupLng
                  ? [parcel.pickupLat, parcel.pickupLng]
                  : undefined
              }
              delivery={
                parcel.deliveryLat && parcel.deliveryLng
                  ? [parcel.deliveryLat, parcel.deliveryLng]
                  : undefined
              }
              trackingLogs={trackingLogs}
            />
          </CardContent>
        </Card>
      )}

      {/* Parcel Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parcel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Tracking Code" value={parcel.trackingCode} />
            <DetailRow label="Type" value={parcel.parcelType || 'N/A'} />
            <DetailRow label="Size" value={parcel.parcelSize || 'N/A'} />
            <DetailRow label="Payment" value={parcel.paymentType} />
            {parcel.codAmount && <DetailRow label="COD Amount" value={`৳${parcel.codAmount}`} />}
            <DetailRow label="Booked" value={formatDateTime(parcel.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pickup Address</p>
              <p className="font-medium">{parcel.pickupAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Address</p>
              <p className="font-medium">{parcel.deliveryAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory.length === 0 ? (
              <p className="text-muted-foreground">No status updates yet</p>
            ) : (
              statusHistory.map((history, index) => (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary h-3 w-3" />
                    {index !== statusHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{history.status.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(history.createdAt)}
                      </p>
                    </div>
                    {history.note && (
                      <p className="text-sm text-muted-foreground">{history.note}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
