import { UserLog } from '../entities/log.entity';

export function mapToUserLog(log: any): UserLog {
  return {
    id: log.id,
    userId: log.userId,
    method: log.method,
    path: log.path,
    meta: log.meta,
    createdAt: log.createdAt,
  };
}
