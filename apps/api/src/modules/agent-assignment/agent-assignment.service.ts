import { Injectable, Inject } from '@nestjs/common';
import { DbService } from '@/db/db.service';
import { CreateAgentAssignmentDto, UpdateAgentAssignmentDto } from './dto';
import { createSuccessResult, createErrorResult, ServiceResult } from '@/common/interfaces';

@Injectable()
export class AgentAssignmentService {
  constructor(@Inject(DbService) private readonly db: DbService) {}

  async save(dto: CreateAgentAssignmentDto): Promise<ServiceResult> {
    if (!dto.parcelId || !dto.agentId) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid input' },
        'Parcel ID and Agent ID are required',
      );
    }

    const existingAssignment = await this.db.agentAssignment.findFirst({
      where: { parcelId: dto.parcelId },
    });

    if (existingAssignment) {
      return createErrorResult(
        { name: 'badRequest', message: 'Already assigned' },
        'Parcel already assigned to an agent',
      );
    }

    const data = await this.db.agentAssignment.create({
      data: {
        parcelId: dto.parcelId,
        agentId: dto.agentId,
      },
    });

    // update parcel status
    await this.db.parcel.update({
      where: { id: dto.parcelId },
      data: { status: 'PICKED_UP' },
    });

    return createSuccessResult(data, 'Agent assigned to parcel successfully');
  }

  async getAll(): Promise<ServiceResult> {
    const data = await this.db.agentAssignment.findMany({
      include: {
        parcel: true,
        agent: true,
      },
    });

    return createSuccessResult(data, 'Agent assignments retrieved successfully');
  }

  async getById(id: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid assignment ID' },
        'Invalid assignment ID',
      );
    }

    const data = await this.db.agentAssignment.findFirst({
      where: { id },
      include: {
        parcel: true,
        agent: true,
      },
    });

    if (!data) {
      return createErrorResult(
        { name: 'forbidden', message: 'Assignment not found' },
        'Assignment not found',
      );
    }

    return createSuccessResult(data, 'Agent assignment retrieved successfully');
  }

  async editById(id: number, dto: UpdateAgentAssignmentDto): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid assignment ID' },
        'Invalid assignment ID',
      );
    }

    const data = await this.db.agentAssignment.update({
      where: { id },
      data: { ...dto },
    });

    return createSuccessResult(data, 'Agent assignment updated successfully');
  }

  async removeById(id: number): Promise<ServiceResult> {
    if (!id || id <= 0) {
      return createErrorResult(
        { name: 'badRequest', message: 'Invalid assignment ID' },
        'Invalid assignment ID',
      );
    }

    const data = await this.db.agentAssignment.delete({
      where: { id },
    });

    return createSuccessResult(data, 'Agent assignment removed successfully');
  }
}
