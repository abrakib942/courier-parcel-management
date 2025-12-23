import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreateParcelDto, UpdateParcelDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';
import { randomUUID } from 'crypto';

@Injectable()
export class ParcelService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreateParcelDto): Promise<ServiceResult> {
    if (!dto.pickupAddress || !dto.deliveryAddress) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid addresses' },
        'Pickup and delivery address are required',
      );
    }

    if (dto.paymentType === 'COD' && !dto.codAmount) {
      return createErrorResult(
        { name: 'badRequest', message: 'COD amount required' },
        'COD amount is required for COD parcels',
      );
    }

    const data = await this.db.parcel.create({
      data: {
        trackingCode: `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customerId: dto.customerId,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        deliveryLat: dto.deliveryLat,
        deliveryLng: dto.deliveryLng,
        parcelType: dto.parcelType,
        status: dto.status,
        paymentStatus: dto.paymentStatus,
        parcelSize: dto.parcelSize,
        paymentType: dto.paymentType,
        codAmount: dto.codAmount,
        qrCode: randomUUID(),
        userId: dto.userId,
      },
    });

    return createSuccessResult(data, 'Parcel booked successfully');
  }

  async getAll(): Promise<ServiceResult> {
    const data = await this.db.parcel.findMany({
      include: {
        customer: true,
        assignments: {
          include: { agent: true },
        },
      },
    });

    return createSuccessResult(data, 'Parcels retrieved successfully');
  }

  async getById(id: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID provided',
      );
    }

    const data = await this.db.parcel.findFirst({
      where: { id },
      include: {
        statusHistory: true,
        trackingLogs: true,
        assignments: {
          include: { agent: true },
        },
      },
    });

    if (!data) {
      return createErrorResult(
        { name: 'forbidden', message: 'Parcel not found' },
        'Parcel not found',
      );
    }

    return createSuccessResult(data, 'Parcel retrieved successfully');
  }

  async editById(id: number, dto: UpdateParcelDto): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID provided',
      );
    }

    const data = await this.db.parcel.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.status && {
          statusHistory: {
            create: {
              status: dto.status,
            },
          },
        }),
      },
    });

    return createSuccessResult(data, 'Parcel updated successfully');
  }

  async removeById(id: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID provided',
      );
    }

    const data = await this.db.parcel.delete({
      where: { id },
    });

    return createSuccessResult(data, 'Parcel deleted successfully');
  }
}
