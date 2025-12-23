import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards, Inject } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { DateRangeDto } from './dto';

export const analyticsSubject = 'analytics';

@Controller('')
export class AnalyticsController {
  @Inject()
  private readonly analyticsService: AnalyticsService;

  @CheckAbility({ subject: analyticsSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/analytics/dashboard')
  async dashboard(@Query() dto: DateRangeDto) {
    return await this.analyticsService.dashboard(dto);
  }

  @CheckAbility({ subject: analyticsSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/analytics/agents')
  async agentPerformance(@Query() dto: DateRangeDto) {
    return await this.analyticsService.agentPerformance(dto);
  }

  @CheckAbility({ subject: analyticsSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/analytics/cod')
  async codReport(@Query() dto: DateRangeDto) {
    return await this.analyticsService.codReport(dto);
  }
}
