import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any) {
    // 1. 메세지를 받으면 MESSAGE DB에 저장
    // 2. 받은 메세지를 접속한 방에 브로드캐스트 방식으로 전송
    const { userId, roomId, message } = data;

    socket.to(roomId).emit('message', message);
  }

  @SubscribeMessage('join')
  joinAuctionRoom(socket: Socket, data: any) {
    const { userId, roomId } = data;
    // 1. Attendance Table에서 기존에 접속한 사용자인지 확인
    // 2. 새로 접속한 사용자일 경우 "이지환님이 접속했습니다" 메세지 브로드캐스트 방식으로 전송
    socket.join(roomId);

    socket
      .to(roomId)
      .emit('message', `${roomId} 옥션에 있는 사람들에게 보내는 메세지입니다.`);
  }
}
