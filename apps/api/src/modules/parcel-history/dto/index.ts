import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParcelStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateParcelStatusHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  parcelId: number;

  @IsEnum(ParcelStatus)
  status: ParcelStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
export class UpdateParcelStatusHistoryDto extends PartialType(CreateParcelStatusHistoryDto) {}