import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { PaymentType, ParcelStatus, PaymentStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateParcelDto {
  //   @IsString()
  //   @IsNotEmpty()
  //   trackingCode: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  pickupLat?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  pickupLng?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  deliveryLat?: number;

  @Type(() => Number)
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

  @Type(() => Number)
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
