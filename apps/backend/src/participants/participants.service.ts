import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.participant.create({ data });
  }

  async findAll() {
    return this.prisma.participant.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.participant.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.participant.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.participant.delete({ where: { id } });
  }
}
