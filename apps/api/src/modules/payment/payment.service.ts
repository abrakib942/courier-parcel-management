import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';

@Injectable()
export class PaymentService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreatePaymentDto): Promise<ServiceResult> {
    if (!dto.parcelId || dto.amount <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid payment data' },
        'Valid parcel ID and amount are required',
      );
    }

    const parcel = await this.db.parcel.findFirst({
      where: { id: dto.parcelId },
    });

    if (!parcel) {
      return createErrorResult(
        { name: 'forbidden', message: 'Parcel not found' },
        'Parcel not found',
      );
    }

    const data = await this.db.payment.create({
      data: {
        parcelId: dto.parcelId,
        amount: dto.amount,
        type: dto.type,
        status: dto.status,
      },
    });

    // Sync parcel payment status
    await this.db.parcel.update({
      where: { id: dto.parcelId },
      data: {
        paymentStatus: dto.status,
      },
    });

    return createSuccessResult(data, 'Payment created successfully');
  }

  async getAll(): Promise<ServiceResult> {
    const data = await this.db.payment.findMany({
      include: {
        parcel: true,
      },
    });

    return createSuccessResult(data, 'Payments retrieved successfully');
  }

  async getById(id: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid payment ID' },
        'Invalid payment ID',
      );
    }

    const data = await this.db.payment.findFirst({
      where: { id },
      include: { parcel: true },
    });

    if (!data) {
      return createErrorResult(
        { name: 'forbidden', message: 'Payment not found' },
        'Payment not found',
      );
    }

    return createSuccessResult(data, 'Payment retrieved successfully');
  }

  async editById(id: number, dto: UpdatePaymentDto): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid payment ID' },
        'Invalid payment ID',
      );
    }

    const data = await this.db.payment.update({
      where: { id },
      data: { ...dto },
    });

    if (dto.status) {
      await this.db.parcel.update({
        where: { id: data.parcelId },
        data: { paymentStatus: dto.status },
      });
    }

    return createSuccessResult(data, 'Payment updated successfully');
  }
}
