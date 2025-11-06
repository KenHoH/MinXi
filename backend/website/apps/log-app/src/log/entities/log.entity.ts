export class UserLog {
  id?: number;
  userId: number;
  method: string;
  path: string;
  meta?: Record<string, any>;
  createdAt?: Date;
}
