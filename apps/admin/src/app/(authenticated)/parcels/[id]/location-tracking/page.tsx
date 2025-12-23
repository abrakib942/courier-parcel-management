'use client';

import GenericViewGenerator from '@/components/global/GenericViewGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id: parcelId } = useParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Location History</CardTitle>
      </CardHeader>
      <CardContent>
        <GenericViewGenerator
          name="location-tracking"
          title="Location Logs"
          subtitle="Parcel route history"
          viewAll={{
            uri: `/api/v1/location-tracking/${parcelId}`,
            ignoredColumns: ['id', 'parcelId', 'updatedAt'],
            actionIdentifier: 'id',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Page;
