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
            name="agent-assignment"
            title="Agent Assignments"
            subtitle="Assign parcels to agents"
            viewAll={{
              uri: `/api/v1/agent-assignments`,
              ignoredColumns: ['id', 'updatedAt'],
              actionIdentifier: 'id',
            }}
            addNew={{
              uri: `/api/v1/agent-assignments`,
            }}
            removeOne={{
              uri: `/api/v1/agent-assignments/{id}`,
              identifier: '{id}',
            }}
            fields={[
              {
                type: 'number',
                name: 'parcelId',
                title: 'Parcel ID',
                placeholder: '',
                initialValue: null,
              },
              {
                type: 'number',
                name: 'agentId',
                title: 'Agent ID',
                placeholder: '',
                initialValue: null,
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
