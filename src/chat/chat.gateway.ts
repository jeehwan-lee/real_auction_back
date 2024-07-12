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
import { BidService } from 'src/bid/bid.service';

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private attendanceService: AttendanceService,
    private auctionService: AuctionService,
    private chatService: ChatService,
    private bidServce: BidService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log('DISCONNECT');
  }

  handleConnection(client: Socket) {
    console.log('COOONECT');
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, data: any) {
    const { auctionId } = data;

    // 1. 위 메세지 CHAT DB에 저장하기
    await this.chatService.createChat(data);

    // 2. 받은 메세지를 접속한 방에 브로드캐스트 방식으로 전송
    this.server.to(auctionId).emit('message', data);
  }

  @SubscribeMessage('join')
  async joinAuctionRoom(socket: Socket, data: any) {
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

      this.server.to(auctionId).emit('message', enterMessage);

      // 위 메세지 CHAT DB에 저장하기
      await this.chatService.createChat(enterMessage);
    }
  }

  @SubscribeMessage('exit')
  async exitAuctionRoom(socket: Socket, data: any) {
    const { userId, userName, auctionId, auctionName } = data;

    // 1. Attendance Table에서 기존에 접속한 사용자인지 확인
    const attendanceCheckResult =
      await this.attendanceService.checkUserInAuctionRoom(userId, auctionId);

    // 2. 참여중인 사용자일 경우
    if (attendanceCheckResult.length != 0) {
      // Attendance Enter SERVICE 실행 -> ATTENDANCE TABLE에 사용자 저장
      await this.attendanceService.deleteAttendance({
        auctionId: auctionId,
        userId: userId,
        auctionName: auctionName,
      });

      // 입찰한 경매 가격 모두 삭제

      // "이지환님이 퇴장했습니다" 메세지 브로드캐스트 방식으로 전송
      const enterMessage = {
        messageType: 'notice',
        message: `${userName}님이 퇴장했습니다`,
        userId: userId,
        auctionId: auctionId,
      };

      this.server.to(auctionId).emit('message', enterMessage);

      // 위 메세지 CHAT DB에 저장하기
      await this.chatService.createChat(enterMessage);

      // 새로 갱신된 옥션의 입찰가 Client로 보내줌
      const auction =
        await this.auctionService.getAuctionByAuctionId(auctionId);

      this.server.to(auctionId).emit('updateAuctionInfo', auction);
    }
  }

  @SubscribeMessage('bidding')
  async bidAuction(socket: Socket, data: any) {
    const { userId, auctionId, auctionName, userName, bidPrice } = data;

    await this.bidServce.createBid({
      userId: userId,
      auctionId: auctionId,
      auctionName: auctionName,
      bidPrice: bidPrice,
    });

    // "이지환님이 1,000,000원에 입찰에 참여했습니다" 메세지 브로드캐스트 방식으로 전송
    const biddingMessage = {
      messageType: 'notice',
      message: `${userName}님이 ${bidPrice}원에 입찰에 참여했습니다`,
      userId: userId,
      auctionId: Number(auctionId),
    };

    this.server.to(auctionId).emit('message', biddingMessage);

    // 위 메세지 CHAT DB에 저장하기
    await this.chatService.createChat(biddingMessage);

    // 새로 갱신된 옥션의 입찰가 Client로 보내줌
    const auction = await this.auctionService.getAuctionByAuctionId(auctionId);

    this.server.to(auctionId).emit('updateAuctionInfo', auction);
  }
}
