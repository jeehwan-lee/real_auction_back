import { AuctionEntity } from 'src/auction/entities/auction.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  messageType: string;

  @Column()
  message: string;

  @Column()
  userId: number;

  @Column()
  auctionId: number;

  @ManyToOne(() => AuctionEntity, (auction) => auction.chatList)
  auction: AuctionEntity;

  @ManyToOne(() => UserEntity, (user) => user.chatList)
  user?: UserEntity;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();
}
