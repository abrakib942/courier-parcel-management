export type ParcelStatus =
  | 'BOOKED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'OUT_FOR_DELIVERY'
  | 'RETURNED'
  | 'CANCELLED'
  | 'FAILED';

export type PaymentType = 'COD' | 'BKASH' | 'INTERNET_BANKING' | 'PREPAID';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Parcel {
  id: number;
  trackingCode: string;
  customerId: number;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  parcelType?: string;
  parcelSize?: string;
  status: ParcelStatus;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  codAmount?: number;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParcelRequest {
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  parcelType?: string;
  parcelSize?: string;
  paymentType: PaymentType;
  codAmount?: number;
}

export interface TrackingInfo {
  parcel: Parcel;
  statusHistory: ParcelStatusHistory[];
  trackingLogs: LocationTracking[];
}

export interface ParcelStatusHistory {
  id: number;
  status: ParcelStatus;
  note?: string;
  createdAt: string;
}

export interface LocationTracking {
  id: number;
  lat: number;
  lng: number;
  createdAt: string;
}
