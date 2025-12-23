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
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/parcels')
  async create(@Body() dto: CreateParcelDto) {
    return await this.parcelService.save(dto);
  }

  @CheckAbility({ subject: parcelSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/parcels')
  async readAll() {
    return await this.parcelService.getAll();
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
