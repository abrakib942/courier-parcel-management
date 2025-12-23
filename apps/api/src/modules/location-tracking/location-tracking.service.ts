import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreateLocationTrackingDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';

@Injectable()
export class LocationTrackingService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreateLocationTrackingDto): Promise<ServiceResult> {
    if (!dto.parcelId || dto.lat === undefined || dto.lng === undefined) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid coordinates' },
        'Parcel ID and valid coordinates are required',
      );
    }

    const parcelExists = await this.db.parcel.findFirst({
      where: { id: dto.parcelId },
    });

    if (!parcelExists) {
      return createErrorResult(
        { name: 'forbidden', message: 'Parcel not found' },
        'Parcel not found',
      );
    }

    const data = await this.db.locationTracking.create({
      data: {
        parcelId: dto.parcelId,
        lat: dto.lat,
        lng: dto.lng,
      },
    });

    return createSuccessResult(data, 'Location updated successfully');
  }

  async getByParcelId(parcelId: number): Promise<ServiceResult> {
    if (!parcelId || parcelId <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid parcel ID' },
        'Invalid parcel ID',
      );
    }

    const data = await this.db.locationTracking.findMany({
      where: { parcelId },
      orderBy: { createdAt: 'asc' },
    });

    return createSuccessResult(data, 'Location tracking retrieved successfully');
  }
}
