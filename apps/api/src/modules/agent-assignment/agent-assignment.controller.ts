import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AgentAssignmentService } from './agent-assignment.service';
import { CheckAbility } from '@/common/decorators';
import { PermissionGuard } from '@/common/guards';
import { CreateAgentAssignmentDto, UpdateAgentAssignmentDto } from './dto';

export const agentAssignmentSubject = 'agent-assignment';

@Controller('')
export class AgentAssignmentController {
  @Inject()
  private readonly agentAssignmentService: AgentAssignmentService;

  @CheckAbility({ subject: agentAssignmentSubject, action: 'create' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/agent-assignments')
  async create(@Body() dto: CreateAgentAssignmentDto) {
    return await this.agentAssignmentService.save(dto);
  }

  @CheckAbility({ subject: agentAssignmentSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/agent-assignments')
  async readAll() {
    return await this.agentAssignmentService.getAll();
  }

  @CheckAbility({ subject: agentAssignmentSubject, action: 'read' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/agent-assignments/:id')
  async readById(@Param('id') id: string) {
    return await this.agentAssignmentService.getById(parseInt(id, 10));
  }

  @CheckAbility({ subject: agentAssignmentSubject, action: 'update' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Put('api/v1/agent-assignments/:id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateAgentAssignmentDto) {
    return await this.agentAssignmentService.editById(parseInt(id, 10), dto);
  }

  @CheckAbility({ subject: agentAssignmentSubject, action: 'delete' })
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('api/v1/agent-assignments/:id')
  async deleteById(@Param('id') id: string) {
    return await this.agentAssignmentService.removeById(parseInt(id, 10));
  }
}
