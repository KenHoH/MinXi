import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';
import { BroadcastNotifReq } from '@app/contracts/shared-dto/sse/req/BroadcastNotifReq';
import { ConnectionStatsRes } from '@app/contracts/shared-dto/sse/res/ConnectionStatsRes';
import { Observable } from 'rxjs';

export interface ISSEService {
  subscribeToRoom(roomId: string): Promise<Observable<MessageEvent>>;
  sendBroadcast(roomId: string, dto: BroadcastMsgReq): Promise<Ack>;
  sendNotification(userId: number, dto: BroadcastNotifReq): Promise<Ack>;
  removeRoomConnection(roomId: string);
  getConnectionStats(): Promise<ConnectionStatsRes>;
}
