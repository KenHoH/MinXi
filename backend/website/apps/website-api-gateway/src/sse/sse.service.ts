import { SOCIAL_MSG, SSE_MSG } from '@app/common/constants/messageEvent';
import { SOCIAL_SERVICES, SSE_SERVICES } from '@app/common/constants/services';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { ISSEService } from '@app/contracts/interfaces/app/ISSEService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { SendMessageDto } from '@app/contracts/shared-dto/social/request/sendMessageDTO';
import { MessageResponseDto } from '@app/contracts/shared-dto/social/response/messageResDTO';
import { BroadcastMsgReq } from '@app/contracts/shared-dto/sse/req/BroadcastMsgReq';
import { ConnectionStatsRes } from '@app/contracts/shared-dto/sse/res/ConnectionStatsRes';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Http2ServerRequest } from 'http2';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { buildMessageResponse } from './utils/buildMsgRes';

@Injectable()
export class SseService implements ISSEService {
  constructor(
    @Inject(SOCIAL_SERVICES.CLIENT) private readonly client: ClientProxy,
  ) {}
  private roomConnections = new Map<string, Subject<any>>();

  async subscribeToRoom(roomId: string): Promise<Observable<MessageEvent>> {
    let connection = this.roomConnections.get(roomId);

    if (!connection) {
      connection = new Subject();
      this.roomConnections.set(roomId, connection);
    }

    return connection.asObservable().pipe(
      map(
        (data) =>
          ({
            type: 'message',
            data: JSON.stringify(data),
          }) as MessageEvent,
      ),
    );
  }

  async sendBroadcast(roomId: string, dto: BroadcastMsgReq): Promise<Ack> {
    const connection = this.roomConnections.get(roomId);

    if (!connection) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    }

    const message = buildMessageResponse(dto);

    connection.next({
      type: 'NEW_MESSAGE',
      data: message,
    });

    await this.forwardMessage(dto);
    return {
      Valid: true,
      Msg: 'Successfully sent message',
    };
  }

  private async forwardMessage(dto: BroadcastMsgReq) {
    const payload: SendMessageDto = {
      authorId: dto.authorId,
      content: dto.content,
      mediaUrl: dto.mediaUrl,
      roomId: dto.roomId,
    };

    try {
      await firstValueFrom(this.client.send(SOCIAL_MSG.sendMessage, payload));
    } catch (err) {
      throw new HttpException(
        'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeRoomConnection(roomId: string) {
    const connection = this.roomConnections.get(roomId);
    if (connection) {
      connection.complete();
      this.roomConnections.delete(roomId);
    }
  }

  async getConnectionStats(): Promise<ConnectionStatsRes> {
    return {
      totalRooms: this.roomConnections.size,
      rooms: Array.from(this.roomConnections.keys()),
    };
  }
}
