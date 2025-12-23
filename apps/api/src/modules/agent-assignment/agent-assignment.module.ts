import { Module } from '@nestjs/common';
import { AgentAssignmentController } from './agent-assignment.controller';
import { AgentAssignmentService } from './agent-assignment.service';

@Module({
  controllers: [AgentAssignmentController],
  providers: [AgentAssignmentService]
})
export class AgentAssignmentModule {}
