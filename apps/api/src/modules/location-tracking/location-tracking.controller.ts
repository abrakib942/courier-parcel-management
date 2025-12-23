import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { LocationTrackingService } from './location-tracking.service';
import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { CreateLocationTrackingDto } from './dto';

export const locationTrackingSubject = 'location-tracking';

@Controller('')
export class LocationTrackingController {
  @Inject()
  private readonly locationTrackingService: LocationTrackingService;

  @CheckAbility({ subject: locationTrackingSubject, action: 'create' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/location-tracking')
  async create(@Body() dto: CreateLocationTrackingDto) {
    return await this.locationTrackingService.save(dto);
  }

  @CheckAbility({ subject: locationTrackingSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/location-tracking/:parcelId')
  async getByParcel(@Param('parcelId') parcelId: string) {
    return await this.locationTrackingService.getByParcelId(parseInt(parcelId, 10));
  }
}
