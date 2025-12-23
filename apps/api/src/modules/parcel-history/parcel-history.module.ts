import { Module } from '@nestjs/common';
import { ParcelStatusHistoryController } from './parcel-history.controller';
import { ParcelStatusHistoryService } from './parcel-history.service';

@Module({
  controllers: [ParcelStatusHistoryController],
  providers: [ParcelStatusHistoryService],
})
export class ParcelHistoryModule {}
