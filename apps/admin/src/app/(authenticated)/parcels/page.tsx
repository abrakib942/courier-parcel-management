'use client';

import GenericViewGenerator from '@/components/global/GenericViewGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { getCustomers } from '@/apis';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IAction } from '@/components/global/data-table';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SelectOption {
  label: string;
  value: number;
}

const Page = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState<any>();

  useEffect(() => {
    getCustomers()
      .then(({ data }) => {
        setCustomers(data);
      })
      .catch(console.error);
  }, []);

  console.log({ customers });

  return (
    <Card>
      <CardContent className="pt-6">
        {useMemo(
          () => (
            <GenericViewGenerator
              name="parcel"
              title="Parcels"
              subtitle="Manage parcels here"
              viewAll={{
                uri: `/api/v1/parcels`,
                ignoredColumns: [
                  'id',
                  'customerId',
                  'pickupLat',
                  'pickupLng',
                  'deliveryLat',
                  'deliveryLng',
                  'updatedAt',
                ],
                actionIdentifier: 'id',
                onDataModify: data =>
                  _.map(data, d => ({
                    ...d,
                    customer: d.customer?.name,
                  })),
              }}
              addNew={{
                uri: `/api/v1/parcels`,
              }}
              viewOne={{
                uri: '/api/v1/parcels/{id}',
                identifier: '{id}',
              }}
              editExisting={{
                uri: '/api/v1/parcels/{id}',
                identifier: '{id}',
              }}
              removeOne={{
                uri: '/api/v1/parcels/{id}',
                identifier: '{id}',
              }}
              customActions={
                [
                  {
                    color: 'default',
                    icon: <ArrowRight className="h-4 w-4" />,
                    text: 'Tracking',
                    callback: (identifier: string | number) => {
                      router.push(`/parcels/${identifier}/location-tracking`);
                    },
                  },
                ] as IAction[]
              }
              fields={[
                {
                  type: 'select-sync',
                  name: 'customerId',
                  title: 'Customer',
                  placeholder: 'Enter customer ID',
                  initialValue: null,
                  options: _.map(
                    customers || [],
                    (customer: Customer): SelectOption => ({
                      label: customer.name,
                      value: customer.id,
                    }),
                  ),
                  validate: v => (!v.customerId ? 'Required!' : null),
                  isSearchable: true,
                },
                {
                  type: 'text',
                  name: 'pickupAddress',
                  title: 'Pickup Address',
                  placeholder: 'Enter pickup address',
                  initialValue: null,
                },
                {
                  type: 'text',
                  name: 'deliveryAddress',
                  title: 'Delivery Address',
                  placeholder: 'Enter delivery address',
                  initialValue: null,
                },
                {
                  type: 'select-sync',
                  name: 'paymentType',
                  title: 'Payment Type',
                  placeholder: 'Select payment type',
                  initialValue: null,
                  options: [
                    { value: 'COD', label: 'COD' },
                    { value: 'BKASH', label: 'Bkash' },
                    { value: 'INTERNET_BANKING', label: 'Internet Banking' },
                    // { value: 'PREPAID', label: 'Prepaid' },
                  ],
                },
                {
                  type: 'number',
                  name: 'codAmount',
                  placeholder: 'Enter COD amount',
                  title: 'Amount',
                  initialValue: null,
                },
                {
                  type: 'select-sync',
                  name: 'status',
                  title: 'Parcel Status',
                  placeholder: 'Select Parcel type',
                  initialValue: null,
                  options: [
                    { value: 'BOOKED', label: 'Booked' },
                    { value: 'PICKED_UP', label: 'Picked Up' },
                    { value: 'IN_TRANSIT', label: 'In Transit' },
                    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                    { value: 'FAILED', label: 'Failed' },
                  ],
                },

                {
                  type: 'select-sync',
                  name: 'paymentStatus',
                  title: 'Payment Status',
                  placeholder: 'Select Payment Status',
                  initialValue: null,
                  options: [
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'PAID', label: 'Paid' },
                    { value: 'FAILED', label: 'Failed' },
                  ],
                },
              ]}
            />
          ),
          [customers],
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
