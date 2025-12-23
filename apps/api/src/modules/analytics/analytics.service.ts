import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { DateRangeDto } from './dto';
import { createSuccessResult, ServiceResult } from '@/common/interfaces';
import { ParcelStatus, PaymentType } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  private buildDateFilter(dto: DateRangeDto) {
    return {
      ...(dto.from && { gte: new Date(dto.from) }),
      ...(dto.to && { lte: new Date(dto.to) }),
    };
  }

  async dashboard(dto: DateRangeDto): Promise<ServiceResult> {
    const dateFilter = this.buildDateFilter(dto);

    const [totalBookings, failedDeliveries, deliveredParcels, codSum] = await Promise.all([
      this.db.parcel.count({
        where: { createdAt: dateFilter },
      }),
      this.db.parcel.count({
        where: {
          status: ParcelStatus.FAILED,
          createdAt: dateFilter,
        },
      }),
      this.db.parcel.count({
        where: {
          status: ParcelStatus.DELIVERED,
          createdAt: dateFilter,
        },
      }),
      this.db.payment.aggregate({
        _sum: { amount: true },
        where: {
          type: PaymentType.COD,
          createdAt: dateFilter,
        },
      }),
    ]);

    return createSuccessResult(
      {
        totalBookings,
        failedDeliveries,
        deliveredParcels,
        totalCodAmount: codSum._sum.amount ?? 0,
      },
      'Dashboard analytics retrieved successfully',
    );
  }

  async agentPerformance(dto: DateRangeDto): Promise<ServiceResult> {
    const dateFilter = this.buildDateFilter(dto);

    const data = await this.db.agentAssignment.groupBy({
      by: ['agentId'],
      _count: { parcelId: true },
      where: {
        assignedAt: dateFilter,
      },
    });

    return createSuccessResult(data, 'Agent performance analytics retrieved successfully');
  }

  async codReport(dto: DateRangeDto): Promise<ServiceResult> {
    const dateFilter = this.buildDateFilter(dto);

    const data = await this.db.payment.findMany({
      where: {
        type: PaymentType.COD,
        createdAt: dateFilter,
      },
      include: {
        parcel: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return createSuccessResult(data, 'COD report retrieved successfully');
  }
}
