import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  parcelId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
