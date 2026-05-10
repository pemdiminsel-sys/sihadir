import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpdService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { name, code } = data;
    return this.prisma.oPD.create({ data: { name, code } });
  }

  async findAll() {
    return this.prisma.oPD.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.oPD.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    const { name, code } = data;
    return this.prisma.oPD.update({ where: { id }, data: { name, code } });
  }

  async remove(id: string) {
    return this.prisma.oPD.delete({ where: { id } });
  }
}
