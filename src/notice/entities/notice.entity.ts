import { AuctionEntity } from 'src/auction/entities/auction.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Notice')
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  description: string;

  @Column()
  auctionId: number;

  @ManyToOne(() => AuctionEntity, (auction) => auction.notices)
  auction: AuctionEntity;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.auctions)
  user: UserEntity;
}
