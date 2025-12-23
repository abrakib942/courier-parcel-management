import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

export const paymentSubject = 'payment';

@Controller('')
export class PaymentController {
  @Inject()
  private readonly paymentService: PaymentService;

  @CheckAbility({ subject: paymentSubject, action: 'create' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/payments')
  async create(@Body() dto: CreatePaymentDto) {
    return await this.paymentService.save(dto);
  }

  @CheckAbility({ subject: paymentSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/payments')
  async readAll() {
    return await this.paymentService.getAll();
  }

  @CheckAbility({ subject: paymentSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/payments/:id')
  async readById(@Param('id') id: string) {
    return await this.paymentService.getById(parseInt(id, 10));
  }

  @CheckAbility({ subject: paymentSubject, action: 'update' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Put('api/v1/payments/:id')
  async updateById(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return await this.paymentService.editById(parseInt(id, 10), dto);
  }
}
