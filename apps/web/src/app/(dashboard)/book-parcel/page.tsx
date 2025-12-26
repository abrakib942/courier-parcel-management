'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateParcelMutation } from '@/store/api/parcelApi';
import { useAppDispatch, useAppSelector } from '@/store/api/hook';
import { useEffect } from 'react';
import { loadFromStorage } from '@/store/slices/authSlice';

const bookParcelSchema = z.object({
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  parcelType: z.string().optional(),
  parcelSize: z.string().optional(),
  paymentType: z.enum(['COD', 'PREPAID', 'BKASH', 'INTERNET_BANKING']),
  codAmount: z.string().optional(),
});

type BookParcelForm = z.infer<typeof bookParcelSchema>;

export default function BookParcelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createParcel, { isLoading }] = useCreateParcelMutation();

  const user = useAppSelector(state => state.auth.user);

  console.log({ user });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookParcelForm>({
    resolver: zodResolver(bookParcelSchema),
    defaultValues: {
      paymentType: 'COD',
    },
  });

  const paymentType = watch('paymentType');

  const onSubmit = async (data: BookParcelForm) => {
    try {
      const payload = {
        ...data,
        customerId: user?.id,
        codAmount: data.codAmount ? parseFloat(data.codAmount) : undefined,
      };

      const result = await createParcel(payload).unwrap();

      if (result.data) {
        toast({
          title: 'Parcel booked successfully',
          description: `Tracking code: ${result.data.trackingCode}`,
        });
        router.push('/my-parcels');
      }
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Book a Parcel</CardTitle>
          <CardDescription>Fill in the details to book your parcel for delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Pickup Address */}
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                placeholder="Enter pickup address"
                {...register('pickupAddress')}
              />
              {errors.pickupAddress && (
                <p className="text-sm text-destructive">{errors.pickupAddress.message}</p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address *</Label>
              <Input
                id="deliveryAddress"
                placeholder="Enter delivery address"
                {...register('deliveryAddress')}
              />
              {errors.deliveryAddress && (
                <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
              )}
            </div>

            {/* Parcel Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parcelType">Parcel Type</Label>
                <Select onValueChange={value => setValue('parcelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Documents">Documents</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parcelSize">Parcel Size</Label>
                <Select onValueChange={value => setValue('parcelSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Large">Large</SelectItem>
                    <SelectItem value="Extra Large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select
                defaultValue="COD"
                onValueChange={value => setValue('paymentType', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="PREPAID">Prepaid</SelectItem>
                  <SelectItem value="BKASH">bKash</SelectItem>
                  <SelectItem value="INTERNET_BANKING">Internet Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* COD Amount */}
            {paymentType === 'COD' && (
              <div className="space-y-2">
                <Label htmlFor="codAmount">COD Amount (৳) *</Label>
                <Input
                  id="codAmount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  {...register('codAmount')}
                />
                {errors.codAmount && (
                  <p className="text-sm text-destructive">{errors.codAmount.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Parcel'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
