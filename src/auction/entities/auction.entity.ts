import { NoticeEntity } from 'src/notice/entities/notice.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Auction')
export class AuctionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  description: string;

  @Column()
  startPrice: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Date = new Date();

  @Column()
  photoUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDt: Date = new Date();

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.auctions)
  user: UserEntity;

  @OneToMany(() => NoticeEntity, (notice) => notice.user)
  notices: NoticeEntity[];
}
