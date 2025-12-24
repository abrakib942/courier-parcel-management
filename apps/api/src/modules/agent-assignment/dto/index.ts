import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAgentAssignmentDto {
  @IsNotEmpty()
  parcelId: string | number;

  @IsNotEmpty()
  agentId: string | number;
}

export class UpdateAgentAssignmentDto extends PartialType(CreateAgentAssignmentDto) {}
