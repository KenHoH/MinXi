import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ILogService } from '@app/contracts/interfaces/log/ILogService';
import { UserLog } from './entities/log.entity';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { LogReq } from '@app/contracts/shared-dto/log/request/log.req.dto';
import { Repository } from './repository/repository';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { mapToUserLog } from './utils/mapToLog';

@Injectable()
export class LogService implements ILogService {
  constructor(private readonly repo: Repository) {}
  private readonly logger = new Logger(LogService.name);

  async create(userId: number, dto: LogReq): Promise<Ack> {
    try {
      await this.repo.createLog(userId, dto);
      return {
        Msg: `Log '${userId}' created successfully`,
        Valid: true,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create log for user id: '${userId}': ${error.message}`,
      );
      throw httpToRpc(
        new HttpException('Failed to Create Log', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async findAll(): Promise<UserLog[]> {
    try {
      const logs = await this.repo.getAllLogs();
      return logs.map(mapToUserLog);
    } catch (error) {
      this.logger.error(`Failed to get all logs: ${error.message}`);
      throw httpToRpc(
        new HttpException('Failed to Retrieve Logs', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async findOne(userId: number): Promise<UserLog[]> {
    try {
      const logs = await this.repo.getLogsByUserId(userId);
      return logs.map(mapToUserLog);
    } catch (error) {
      this.logger.error(
        `Failed to get logs for user id ${userId}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to Retrieve Logs by User',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async findDate(date: string): Promise<UserLog[]> {
    try {
      // date format: 'YYYY-MM-DD'
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException(
          'Invalid date format. Expected YYYY-MM-DD',
          HttpStatus.BAD_REQUEST,
        );
      }

      const logs = await this.repo.getLogsByDate(parsedDate);
      return logs.map(mapToUserLog);
    } catch (error) {
      this.logger.error(
        `Failed to get logs for date ${date}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to Retrieve Logs by Date',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async removeBefore(date: string): Promise<number> {
    try {
      // date format: 'YYYY-MM-DD'
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException(
          'Invalid date format. Expected YYYY-MM-DD',
          HttpStatus.BAD_REQUEST,
        );
      }

      const count = await this.repo.deleteLogsBefore(parsedDate);
      this.logger.log(`Removed ${count} logs before ${date}`);
      return count;
    } catch (error) {
      this.logger.error(
        `Failed to delete logs before ${date}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException('Failed to Delete Logs', HttpStatus.BAD_REQUEST),
      );
    }
  }
}
