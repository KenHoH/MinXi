import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { Injectable, Logger } from '@nestjs/common';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
@Injectable()
export class Repository {
  constructor(private readonly prisma: LogDatabaseConnection) {}
  private readonly logger = new Logger(Repository.name);

  async createLog(userId: number, dto: LogReq) {
    await this.prisma.userLog.create({
      data: {
        userId: userId,
        method: dto.method,
        path: dto.path,
        meta: dto.meta,
      },
    });
  }

  async getAllLogs() {
    return await this.prisma.userLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLogsByUserId(userId: number) {
    return await this.prisma.userLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLogsByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.userLog.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteLogsBefore(date: Date) {
    const result = await this.prisma.userLog.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });

    this.logger.log(
      `Deleted ${result.count} logs before ${date.toISOString()}`,
    );
    return result.count;
  }
}
