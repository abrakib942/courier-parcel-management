'use client';

import GenericViewGenerator from '@/components/global/GenericViewGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const Page = () => {
  const { id } = useParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel #{id}</CardTitle>
      </CardHeader>

      <CardContent>
        {useMemo(
          () => (
            <GenericViewGenerator
              name="parcel-status"
              title="Parcel Status History"
              subtitle="Track parcel lifecycle"
              viewAll={{
                uri: `/api/v1/parcel-status-history/${id}`,
                ignoredColumns: ['id', 'parcelId', 'updatedAt'],
                actionIdentifier: 'id',
              }}
            />
          ),
          [id],
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
