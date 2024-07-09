import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AttendanceService } from 'src/attendance/attendance.service';
import { AuctionService } from 'src/auction/auction.service';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private attendanceService: AttendanceService,
    private auctionService: AuctionService,
    private chatService: ChatService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log('DISCONNECT');
    const rooms = Array.from(client.rooms);
    rooms.forEach((room) => {
      if (room !== client.id) {
        client.leave(room);
      }
    });

    console.log(client);
  }

  handleConnection(client: Socket) {
    console.log('COOONECT');
    console.log(client);
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, data: any) {
    const { auctionId } = data;

    // 위 메세지 CHAT DB에 저장하기
    await this.chatService.createChat(data);

    // 1. 메세지를 받으면 MESSAGE DB에 저장
    // 2. 받은 메세지를 접속한 방에 브로드캐스트 방식으로 전송
    socket.to(auctionId).emit('message', data);
  }

  @SubscribeMessage('join')
  async joinAuctionRoom(socket: Socket, data: any) {
    console.log('JOINNNN');

    const { userId, userName, auctionId } = data;

    socket.join(auctionId);

    // 1. Attendance Table에서 기존에 접속한 사용자인지 확인
    const attendanceCheckResult =
      await this.attendanceService.checkUserInAuctionRoom(userId, auctionId);

    // 2. 새로 접속한 사용자일 경우
    if (attendanceCheckResult.length == 0) {
      const enteredAuction =
        await this.auctionService.getAuctionByAuctionId(auctionId);

      // Attendance Enter SERVICE 실행 -> ATTENDANCE TABLE에 사용자 저장
      await this.attendanceService.createAttendance({
        auctionId: auctionId,
        userId: userId,
        auctionName: enteredAuction.id,
      });

      // "이지환님이 접속했습니다" 메세지 브로드캐스트 방식으로 전송
      const enterMessage = {
        messageType: 'notice',
        message: `${userName}님이 접속했습니다`,
        userId: userId,
        auctionId: Number(enteredAuction.id),
      };

      socket.to(auctionId).emit('message', enterMessage);

      // 위 메세지 CHAT DB에 저장하기
      await this.chatService.createChat(enterMessage);
    }
  }
}
