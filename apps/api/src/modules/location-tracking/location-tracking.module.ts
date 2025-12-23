import { Module } from '@nestjs/common';
import { LocationTrackingController } from './location-tracking.controller';
import { LocationTrackingService } from './location-tracking.service';

@Module({
  controllers: [LocationTrackingController],
  providers: [LocationTrackingService],
})
export class LocationTrackingModule {}
