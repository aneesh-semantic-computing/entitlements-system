import { Controller, Get, Post, Param, Body, UseGuards, Patch, Query } from '@nestjs/common';
import { AccessRequestService } from '../services/access-request.service';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('access-requests')
@UseGuards(RolesGuard)
export class AccessRequestController {
  constructor(private readonly accessRequestService: AccessRequestService) {}

  @Post()
  @Roles('quant', 'ops')
  async create(
    @Body() createAccessRequestDto: CreateAccessRequestDto,
    @Body('apiKey') apiKey: string,
  ) {
    return this.accessRequestService.create(createAccessRequestDto, apiKey);
  }

  @Patch(':id/approve')
  @Roles('ops')
  async approve(@Param('id') id: number, @Body('apiKey') apiKey: string) {
    return this.accessRequestService.approve(id, apiKey);
  }

  @Patch(':id/reject')
  @Roles('ops')
  async reject(@Param('id') id: number, @Body('apiKey') apiKey: string) {
    return this.accessRequestService.reject(id, apiKey);
  }

  @Get()
  @Roles('ops')
  async findAll() {
    return this.accessRequestService.findAll();
  }

  @Get(':id')
  @Roles('ops')
  async findByRequestId(@Param('id') requestId: number) {
    return this.accessRequestService.findByRequestId(requestId);
  }

  @Get('/user/:userId')
  @Roles('ops')
  async findAllByUser(@Param('userId') userId: number, @Query('status') status: string) {
    return this.accessRequestService.findAllByUser(userId, status);
  }
}
