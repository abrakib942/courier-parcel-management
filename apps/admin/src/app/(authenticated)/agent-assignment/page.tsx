'use client';

import { getAgents, getParcels } from '@/apis';
import GenericViewGenerator from '@/components/global/GenericViewGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

const Page = () => {
  const [agents, setAgents] = useState<any>();
  const [parcels, setParcels] = useState<any>();

  useEffect(() => {
    getAgents()
      .then(({ data }) => {
        setAgents(data);
      })
      .catch(console.error);

    getParcels()
      .then(({ data }) => {
        setParcels(data);
      })
      .catch(console.error);
  }, []);
  return (
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
                ignoredColumns: ['id', 'agentId', 'parcelId', 'updatedAt'],
                actionIdentifier: 'id',
                onDataModify: data =>
                  _.map(data, d => ({
                    ...d,
                    parcel: d.parcel?.trackingCode,
                    agent: d.agent.name,
                    assignedAt: new Date(d.assignedAt).toLocaleString('en-GB'),
                  })),
              }}
              addNew={{
                uri: `/api/v1/agent-assignments`,
              }}
              viewOne={{
                uri: '/api/v1/agent-assignments/{id}',
                identifier: '{id}',
              }}
              editExisting={{
                uri: '/api/v1/agent-assignments/{id}',
                identifier: '{id}',
              }}
              removeOne={{
                uri: `/api/v1/agent-assignments/{id}`,
                identifier: '{id}',
              }}
              fields={[
                {
                  type: 'select-sync',
                  name: 'parcelId',
                  title: 'Parcel',
                  placeholder: 'Select Parcel',
                  initialValue: null,
                  options: _.map(parcels, parcel => ({
                    label: `${parcel?.trackingCode}-(${parcel.customer?.name})`,
                    value: parcel.id,
                  })),
                  validate: v => (!v.agentId ? 'Required!' : null),
                  isSearchable: true,
                },
                {
                  type: 'select-sync',
                  name: 'agentId',
                  title: 'Agent',
                  placeholder: 'Select Agent',
                  initialValue: null,
                  options: _.map(agents, agent => ({
                    label: agent.name,
                    value: agent.id,
                  })),
                  validate: v => (!v.agentId ? 'Required!' : null),
                  isSearchable: true,
                },
              ]}
            />
          ),
          [agents, parcels],
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
