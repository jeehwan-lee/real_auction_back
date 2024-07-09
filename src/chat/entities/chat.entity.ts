import { AuctionEntity } from 'src/auction/entities/auction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  messageType: string;

  @Column()
  userId: number;

  @Column()
  auctionId: number;

  @ManyToOne(() => AuctionEntity, (auction) => auction.attendances)
  auction: AuctionEntity;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();
}
