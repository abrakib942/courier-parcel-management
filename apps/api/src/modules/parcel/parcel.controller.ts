import {
  UseGuards,
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Put,
  Inject,
  ValidationPipe,
  Query,
  Request,
} from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { CreateParcelDto, UpdateParcelDto } from './dto';

export const parcelSubject = 'parcel';

@Controller('')
export class ParcelController {
  @Inject()
  private readonly parcelService: ParcelService;

  @CheckAbility({ subject: parcelSubject, action: 'create' })
  // @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/parcels')
  async create(@Body() dto: CreateParcelDto) {
    console.log({ dto });
    return await this.parcelService.save(dto);
  }

  @CheckAbility({ subject: parcelSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcels')
  async readAll() {
    return await this.parcelService.getAll();
  }

  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcels/my-parcels')
  async getMyParcels(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const customerId = req.user?.id;

    return await this.parcelService.getMyParcels(
      customerId,
      parseInt(page || '1', 10),
      parseInt(limit || '10', 10),
      status,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcels/track/:trackingCode')
  async trackParcel(@Param('trackingCode') trackingCode: string) {
    return await this.parcelService.trackByCode(trackingCode);
  }

  @HttpCode(HttpStatus.OK)
  @Put('api/v1/parcels/:id/cancel')
  async cancelParcel(@Param('id') id: string, @Request() req: any) {
    const customerId = req.user?.id;
    return await this.parcelService.cancelParcel(parseInt(id, 10), customerId);
  }

  @CheckAbility({ subject: parcelSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcels/:id')
  async readById(@Param('id') id: string) {
    return await this.parcelService.getById(parseInt(id, 10));
  }

  @CheckAbility({ subject: parcelSubject, action: 'update' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Put('api/v1/parcels/:id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateParcelDto) {
    return await this.parcelService.editById(parseInt(id, 10), dto);
  }

  @CheckAbility({ subject: parcelSubject, action: 'delete' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('api/v1/parcels/:id')
  async deleteById(@Param('id') id: string) {
    return await this.parcelService.removeById(parseInt(id, 10));
  }
}
