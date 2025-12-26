import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreateParcelDto, UpdateParcelDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';
import { randomUUID } from 'crypto';

@Injectable()
export class ParcelService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreateParcelDto): Promise<ServiceResult> {
    const data = await this.db.parcel.create({
      data: {
        trackingCode: `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customerId: Number(dto.customerId),
        pickupAddress: dto?.pickupAddress,
        deliveryAddress: dto?.deliveryAddress,
        pickupLat: dto?.pickupLat,
        pickupLng: dto?.pickupLng,
        deliveryLat: dto?.deliveryLat,
        deliveryLng: dto?.deliveryLng,
        parcelType: dto?.parcelType,
        status: dto?.status,
        paymentStatus: dto.paymentStatus,
        parcelSize: dto?.parcelSize,
        paymentType: dto?.paymentType,
        codAmount: dto?.codAmount,
        qrCode: randomUUID(),
        userId: dto?.userId,
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

  
  async getMyParcels(
    customerId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<ServiceResult> {
    if (!customerId || customerId <= 0) {
      return createErrorResult(
        { name: 'unauthorized', message: 'Invalid customer' },
        'Customer ID is required',
      );
    }

    const skip = (page - 1) * limit;

    const where: any = { customerId };
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.db.parcel.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          assignments: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.db.parcel.count({ where }),
    ]);

    return createSuccessResult(
      {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      'My parcels retrieved successfully',
    );
  }

  async trackByCode(trackingCode: string): Promise<ServiceResult> {
    if (!trackingCode) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid tracking code' },
        'Tracking code is required',
      );
    }

    const data = await this.db.parcel.findUnique({
      where: { trackingCode },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        assignments: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        trackingLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!data) {
      return createErrorResult(
        { name: 'forbidden', message: 'Parcel not found' },
        'No parcel found with this tracking code',
      );
    }

    return createSuccessResult(
      {
        parcel: data,
        statusHistory: data.statusHistory,
        trackingLogs: data.trackingLogs,
      },
      'Parcel tracking information retrieved successfully',
    );
  }

  async cancelParcel(id: number, customerId: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID provided',
      );
    }

    // Check if parcel belongs to customer
    const parcel = await this.db.parcel.findFirst({
      where: { id, customerId },
    });

    if (!parcel) {
      return createErrorResult(
        { name: 'forbidden', message: 'Parcel not found or unauthorized' },
        'You can only cancel your own parcels',
      );
    }

    // Check if parcel can be cancelled
    const nonCancellableStatuses = ['DELIVERED', 'CANCELLED', 'RETURNED'];
    if (nonCancellableStatuses.includes(parcel.status)) {
      return createErrorResult(
        { name: 'badRequest', message: 'Cannot cancel parcel' },
        `Cannot cancel parcel with status: ${parcel.status}`,
      );
    }

    const data = await this.db.parcel.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: {
            status: 'CANCELLED',
            note: 'Cancelled by customer',
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    return createSuccessResult(data, 'Parcel cancelled successfully');
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
        customerId: Number(dto.customerId),

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
