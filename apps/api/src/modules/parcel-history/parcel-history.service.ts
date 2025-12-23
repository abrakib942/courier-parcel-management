import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreateParcelStatusHistoryDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';

@Injectable()
export class ParcelStatusHistoryService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreateParcelStatusHistoryDto): Promise<ServiceResult> {
    if (!dto.parcelId || !dto.status) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid data' },
        'Parcel ID and status are required',
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

    const data = await this.db.$transaction(async tx => {
      const history = await tx.parcelStatusHistory.create({
        data: {
          parcelId: dto.parcelId,
          status: dto.status,
          note: dto.note,
        },
      });

      await tx.parcel.update({
        where: { id: dto.parcelId },
        data: {
          status: dto.status,
        },
      });

      return history;
    });

    return createSuccessResult(data, 'Parcel status updated successfully');
  }

  async getByParcelId(parcelId: number): Promise<ServiceResult> {
    if (!parcelId || parcelId <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID',
      );
    }

    const data = await this.db.parcelStatusHistory.findMany({
      where: { parcelId },
      orderBy: { createdAt: 'asc' },
    });

    return createSuccessResult(data, 'Parcel status history retrieved successfully');
  }
}
