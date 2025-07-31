// src/job/job.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClient, JobStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JobService {
  async createJob(
    user: { id: string; role: Role },
    data: { title: string; description: string; assignedTo?: string },
  ) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Only admins can create jobs');

    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo ? { connect: { id: data.assignedTo } } : undefined,
      },
    });
  }

  async getJobs(user: { id: string; role: Role }, status?: JobStatus) {
    const filter = status ? { status } : {};

    if (user.role === 'ADMIN') {
      return prisma.job.findMany({
        where: filter,
        include: { assignedTo: true },
      });
    } else {
      return prisma.job.findMany({
        where: { userId: user.id, ...filter },
        include: { assignedTo: true },
      });
    }
  }

  async updateStatus(jobId: string, user: { id: string; role: Role }, status: JobStatus) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== user.id) {
      throw new ForbiddenException('Not allowed to update this job');
    }

    return prisma.job.update({
      where: { id: jobId },
      data: { status },
    });
  }
}