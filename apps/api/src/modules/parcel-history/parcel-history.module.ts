import { Module } from '@nestjs/common';
import { ParcelHistoryController } from './parcel-history.controller';
import { ParcelHistoryService } from './parcel-history.service';

@Module({
  controllers: [ParcelHistoryController],
  providers: [ParcelHistoryService]
})
export class ParcelHistoryModule {}
