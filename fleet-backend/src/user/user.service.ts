import { Injectable, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async createDriver(
    admin: { id: string; role: Role },
    data: { name: string; email: string },
  ) {
    if (admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create drivers');
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ForbiddenException('Email already in use');
    }

    // Generate secure 8-char alphanumeric password
    const plainPassword = randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const driver = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'DRIVER',
        mustUpdatePassword: true,
      },
    });

    return {
      message: 'Driver created',
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
      },
      plainPassword, // Send plain password to show in admin dashboard or email
    };
  }
}
