// src/user/user.controller.ts
import {
    Controller,
    Get,
    UseGuards,
    Req,
    ForbiddenException,
    Patch,
    Param,
    Body,
  } from '@nestjs/common';
  import { AuthGuard } from '../guards/auth.guard';
  import type { Request } from 'express';
  import { PrismaClient, Role } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
  @Controller('users')
  @UseGuards(AuthGuard)
  export class UserController {
    @Get('me')
    getMe(@Req() req: Request) {
      return req.user;
    }
  
    @Get('drivers')
    async getAllDrivers(@Req() req: Request) {
      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenException('Only admins can view drivers');
      }
  
      return prisma.user.findMany({
        where: { role: 'DRIVER' },
        select: { id: true, name: true, email: true },
      });
    }
  
    @Patch(':id/location')
    async updateLocation(
      @Param('id') id: string,
      @Body() body: { lat: number; lng: number },
      @Req() req: Request,
    ) {
      if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
        throw new ForbiddenException('You cannot update this location');
      }
  
      return prisma.user.update({
        where: { id },
        data: {
          locationLat: body.lat,
          locationLng: body.lng,
        },
      });
    }
  }