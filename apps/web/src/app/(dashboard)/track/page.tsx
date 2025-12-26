'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

export default function TrackParcelPage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      router.push(`/track/${trackingCode.trim()}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Parcel</CardTitle>
          <CardDescription>Enter your tracking code to see real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingCode">Tracking Code</Label>
              <Input
                id="trackingCode"
                placeholder="e.g., TRK-1234567890-123"
                value={trackingCode}
                onChange={e => setTrackingCode(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Track Parcel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
