// src/job/job.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { JobService } from './job.service';
import { AuthGuard } from '../guards/auth.guard';
import type { Request } from 'express';
import { JobStatus } from '@prisma/client';

@Controller('jobs')
@UseGuards(AuthGuard)
export class JobController {
  constructor(private jobService: JobService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body()
    body: { title: string; description: string; assignedTo?: string },
  ) {
    return this.jobService.createJob(req.user as any, body);
  }

  @Get()
  getAll(@Req() req: Request) {
    const status = req.query?.status as JobStatus | undefined;
    return this.jobService.getJobs(req.user as any, status);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { status: JobStatus },
  ) {
    return this.jobService.updateStatus(id, req.user as any, body.status);
  }
}
