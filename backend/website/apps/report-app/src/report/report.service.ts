import { LogDatabaseConnection } from '@app/common/database/log-database-connection/log-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IReportService } from '@app/contracts/interfaces/app/IReportService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { ReportDto } from '@app/contracts/shared-dto/report/response';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { mapReportToDto } from './utils/mapToDTO';

@Injectable()
export class ReportService implements IReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private readonly prisma: LogDatabaseConnection) {}

  async getAllReports(): Promise<ReportDto[]> {
    try {
      const reports = await this.prisma.report.findMany();

      if (!reports || reports.length === 0) {
        throw httpToRpc(
          new HttpException('No reports found', HttpStatus.NOT_FOUND),
        );
      }

      return reports.map(mapReportToDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to get all reports', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to get all reports',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getReportsByUser(userId: number): Promise<ReportDto[]> {
    try {
      if (!userId) {
        throw httpToRpc(
          new HttpException('userId is required', HttpStatus.BAD_REQUEST),
        );
      }

      const reports = await this.prisma.report.findMany({
        where: {
          userId,
        },
      });

      if (!reports || reports.length === 0) {
        throw httpToRpc(
          new HttpException(
            'No reports found for this user',
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return reports.map(mapReportToDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to get reports by user', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to get reports by user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async createReport(
    creator_id: number,
    userId: number,
    desc: string,
    type: string,
  ): Promise<Ack> {
    try {
      if (!creator_id || !userId || !desc || !type) {
        throw httpToRpc(
          new HttpException('All fields are required', HttpStatus.BAD_REQUEST),
        );
      }

      if (creator_id === userId) {
        throw httpToRpc(
          new HttpException('Cannot report yourself', HttpStatus.BAD_REQUEST),
        );
      }

      const validTypes = ['Abuse', 'Spam', 'Missinformation'];
      if (!validTypes.includes(type)) {
        throw httpToRpc(
          new HttpException(
            'Invalid report type. Must be one of: Abuse, Spam, Missinformation',
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      await this.prisma.report.create({
        data: {
          creatorId: creator_id,
          userId,
          desc,
          type,
          isActive: true,
        },
      });

      return { Valid: true, Msg: 'Report created successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to create report', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to create report',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async activateReport(id: number): Promise<Ack> {
    try {
      if (!id) {
        throw httpToRpc(
          new HttpException('Report id is required', HttpStatus.BAD_REQUEST),
        );
      }

      const report = await this.prisma.report.findUnique({
        where: { id },
      });

      if (!report) {
        throw httpToRpc(
          new HttpException('Report not found', HttpStatus.NOT_FOUND),
        );
      }

      if (report.isActive) {
        throw httpToRpc(
          new HttpException('Report is already active', HttpStatus.CONFLICT),
        );
      }

      await this.prisma.report.update({
        where: { id },
        data: { isActive: true },
      });

      return { Valid: true, Msg: 'Report activated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to activate report', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to activate report',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deactivateReport(id: number): Promise<Ack> {
    try {
      if (!id) {
        throw httpToRpc(
          new HttpException('Report id is required', HttpStatus.BAD_REQUEST),
        );
      }

      const report = await this.prisma.report.findUnique({
        where: { id },
      });

      if (!report) {
        throw httpToRpc(
          new HttpException('Report not found', HttpStatus.NOT_FOUND),
        );
      }

      if (!report.isActive) {
        throw httpToRpc(
          new HttpException('Report is already inactive', HttpStatus.CONFLICT),
        );
      }

      await this.prisma.report.update({
        where: { id },
        data: { isActive: false },
      });

      return { Valid: true, Msg: 'Report deactivated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to deactivate report', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to deactivate report',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deleteReport(id: number): Promise<Ack> {
    try {
      if (!id) {
        throw httpToRpc(
          new HttpException('Report id is required', HttpStatus.BAD_REQUEST),
        );
      }

      const report = await this.prisma.report.findUnique({
        where: { id },
      });

      if (!report) {
        throw httpToRpc(
          new HttpException('Report not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.report.delete({
        where: { id },
      });

      return { Valid: true, Msg: 'Report deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to delete report', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete report',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
