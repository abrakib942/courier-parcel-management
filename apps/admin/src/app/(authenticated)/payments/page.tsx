'use client';

import GenericViewGenerator from '@/components/global/GenericViewGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

const Page = () => (
  <Card>
    <CardContent className="pt-6">
      {useMemo(
        () => (
          <GenericViewGenerator
            name="payment"
            title="Payments"
            subtitle="Manage COD & prepaid payments"
            viewAll={{
              uri: `/api/v1/payments`,
              ignoredColumns: ['id', 'parcelId', 'updatedAt'],
              actionIdentifier: 'id',
            }}
            editExisting={{
              uri: `/api/v1/payments/{id}`,
              identifier: '{id}',
            }}
            fields={[
              {
                type: 'select-sync',
                name: 'status',
                title: 'Payment Status',
                initialValue: 'PENDING',
                placeholder: '',
                options: [
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'PAID', label: 'PAID' },
                  { value: 'FAILED', label: 'FAILED' },
                ],
              },
            ]}
          />
        ),
        [],
      )}
    </CardContent>
  </Card>
);

export default Page;
