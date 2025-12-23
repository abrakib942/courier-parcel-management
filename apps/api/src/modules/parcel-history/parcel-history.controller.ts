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

import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { CreateParcelStatusHistoryDto } from './dto';
import { ParcelStatusHistoryService } from './parcel-history.service';

export const parcelStatusHistorySubject = 'parcel-status-history';

@Controller('')
export class ParcelStatusHistoryController {
  @Inject()
  private readonly parcelStatusHistoryService: ParcelStatusHistoryService;

  @CheckAbility({ subject: parcelStatusHistorySubject, action: 'create' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/parcel-status-history')
  async create(@Body() dto: CreateParcelStatusHistoryDto) {
    return await this.parcelStatusHistoryService.save(dto);
  }

  @CheckAbility({ subject: parcelStatusHistorySubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcel-status-history/:parcelId')
  async getByParcel(@Param('parcelId') parcelId: string) {
    return await this.parcelStatusHistoryService.getByParcelId(parseInt(parcelId, 10));
  }
}
