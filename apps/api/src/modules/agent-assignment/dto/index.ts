import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAgentAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  parcelId: number;

  @IsNumber()
  @IsNotEmpty()
  agentId: number;
}

export class UpdateAgentAssignmentDto extends PartialType(CreateAgentAssignmentDto) {}
