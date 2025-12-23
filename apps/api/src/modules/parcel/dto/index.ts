import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { PaymentType, ParcelStatus, PaymentStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateParcelDto {
  //   @IsString()
  //   @IsNotEmpty()
  //   trackingCode: string;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsOptional()
  @IsNumber()
  pickupLat?: number;

  @IsOptional()
  @IsNumber()
  pickupLng?: number;

  @IsOptional()
  @IsNumber()
  deliveryLat?: number;

  @IsOptional()
  @IsNumber()
  deliveryLng?: number;

  @IsOptional()
  @IsString()
  parcelType?: string;

  @IsOptional()
  @IsString()
  parcelSize?: string;

  @IsEnum(ParcelStatus)
  status: ParcelStatus;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsNumber()
  codAmount?: number;

  @IsOptional()
  @IsString()
  qrCode?: string;

  @IsOptional()
  @IsString()
  barCode?: string;
}

export class UpdateParcelDto extends PartialType(CreateParcelDto) {
  @IsOptional()
  @IsEnum(ParcelStatus)
  status?: ParcelStatus;
}
